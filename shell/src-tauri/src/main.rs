// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, SystemExt};

#[tauri::command]
fn get_system_stats() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let total_mem = sys.total_memory() / 1024 / 1024;
    let used_mem = sys.used_memory() / 1024 / 1024;
    
    format!("RAM: {}MB / {}MB", used_mem, total_mem)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_system_stats])
        .run(tauri::generate_context!())
        .expect("error while running axiora-shell application");
}
