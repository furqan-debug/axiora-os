// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, SystemExt};
use zbus::{proxy, Connection};

// Define zbus proxies for our background daemons
#[proxy(
    interface = "org.freedesktop.Notifications",
    default_service = "org.freedesktop.Notifications",
    default_path = "/org/freedesktop/Notifications"
)]
trait Notifications {
    async fn get_axiora_notifications(&self) -> zbus::Result<Vec<String>>;
}

#[proxy(
    interface = "com.axiora.FocusMode",
    default_service = "com.axiora.FocusMode",
    default_path = "/com/axiora/FocusMode"
)]
trait FocusMode {
    async fn toggle(&self) -> zbus::Result<bool>;
    async fn get_status(&self) -> zbus::Result<bool>;
}

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
    let conn = Connection::session().await.map_err(|e| e.to_string())?;
    let proxy = NotificationsProxy::new(&conn).await.map_err(|e| e.to_string())?;
    proxy.get_axiora_notifications().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn toggle_focus_mode() -> Result<bool, String> {
    let conn = Connection::session().await.map_err(|e| e.to_string())?;
    let proxy = FocusModeProxy::new(&conn).await.map_err(|e| e.to_string())?;
    proxy.toggle().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn fetch_running_apps() -> Result<String, String> {
    let conn = Connection::session().await.map_err(|e| e.to_string())?;
    let proxy = DockProxy::new(&conn).await.map_err(|e| e.to_string())?;
    proxy.get_running_apps().await.map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            fetch_notifications,
            toggle_focus_mode,
            fetch_running_apps
        ])
        .run(tauri::generate_context!())
        .expect("error while running axiora-shell application");
}
