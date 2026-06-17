// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, SystemExt};
#[cfg(target_os = "linux")]
use zbus::{proxy, Connection};

#[cfg(target_os = "linux")]
#[proxy(
    interface = "org.freedesktop.Notifications",
    default_service = "org.freedesktop.Notifications",
    default_path = "/org/freedesktop/Notifications"
)]
trait Notifications {
    async fn get_axiora_notifications(&self) -> zbus::Result<Vec<String>>;
}

#[cfg(target_os = "linux")]
#[proxy(
    interface = "com.axiora.FocusMode",
    default_service = "com.axiora.FocusMode",
    default_path = "/com/axiora/FocusMode"
)]
trait FocusMode {
    async fn toggle(&self) -> zbus::Result<bool>;
    async fn get_status(&self) -> zbus::Result<bool>;
}

#[cfg(target_os = "linux")]
#[proxy(
    interface = "com.axiora.Dock",
    default_service = "com.axiora.Dock",
    default_path = "/com/axiora/Dock"
)]
trait Dock {
    async fn get_running_apps(&self) -> zbus::Result<String>;
}

#[tauri::command]
fn get_system_stats() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let total_mem = sys.total_memory() / 1024 / 1024;
    let used_mem = sys.used_memory() / 1024 / 1024;
    
    format!("RAM: {}MB / {}MB", used_mem, total_mem)
}

#[tauri::command]
async fn fetch_notifications() -> Result<Vec<String>, String> {
    #[cfg(target_os = "linux")]
    {
        let conn = Connection::session().await.map_err(|e| e.to_string())?;
        let proxy = NotificationsProxy::new(&conn).await.map_err(|e| e.to_string())?;
        proxy.get_axiora_notifications().await.map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "linux"))]
    {
        Ok(vec![])
    }
}

#[tauri::command]
async fn toggle_focus_mode() -> Result<bool, String> {
    #[cfg(target_os = "linux")]
    {
        let conn = Connection::session().await.map_err(|e| e.to_string())?;
        let proxy = FocusModeProxy::new(&conn).await.map_err(|e| e.to_string())?;
        proxy.toggle().await.map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "linux"))]
    {
        Ok(false)
    }
}

#[tauri::command]
async fn fetch_running_apps() -> Result<String, String> {
    #[cfg(target_os = "linux")]
    {
        let conn = Connection::session().await.map_err(|e| e.to_string())?;
        let proxy = DockProxy::new(&conn).await.map_err(|e| e.to_string())?;
        proxy.get_running_apps().await.map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "linux"))]
    {
        Ok(String::new())
    }
}

#[derive(serde::Serialize)]
struct FileEntry {
    name: String,
    is_dir: bool,
    size: u64,
}

#[tauri::command]
fn execute_command(cmd: String) -> Result<String, String> {
    let output = std::process::Command::new("bash")
        .arg("-c")
        .arg(cmd)
        .output()
        .map_err(|e| e.to_string())?;
    
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();
    let read_dir = std::fs::read_dir(path).map_err(|e| e.to_string())?;
    
    for entry in read_dir.filter_map(Result::ok) {
        let meta = entry.metadata().map_err(|e| e.to_string())?;
        entries.push(FileEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            is_dir: meta.is_dir(),
            size: meta.len(),
        });
    }
    
    Ok(entries)
}

#[tauri::command]
fn toggle_wifi(state: bool) -> Result<(), String> {
    let arg = if state { "on" } else { "off" };
    std::process::Command::new("nmcli")
        .args(&["radio", "wifi", arg])
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn toggle_bluetooth(state: bool) -> Result<(), String> {
    let arg = if state { "unblock" } else { "block" };
    std::process::Command::new("rfkill")
        .args(&[arg, "bluetooth"])
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn read_note() -> Result<String, String> {
    let path = std::env::temp_dir().join("axiora_notes.txt");
    match std::fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(_) => Ok("Welcome to Notes!\n\nFeel free to jot down your thoughts here! (Auto-saves)".to_string()),
    }
}

#[tauri::command]
fn write_note(content: String) -> Result<(), String> {
    let path = std::env::temp_dir().join("axiora_notes.txt");
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            fetch_notifications,
            toggle_focus_mode,
            fetch_running_apps,
            execute_command,
            list_directory,
            toggle_wifi,
            toggle_bluetooth,
            read_note,
            write_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running axiora-shell application");
}
