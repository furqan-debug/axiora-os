use serde::{Serialize, Deserialize};
use zbus::{interface, Connection};

#[derive(Serialize, Deserialize, Clone)]
pub struct AppInfo {
    id: String,
    name: String,
    is_running: bool,
}

pub struct DockServer {
    // For MVP, we mock the list of running applications
    mock_apps: Vec<AppInfo>,
}

#[interface(name = "com.axiora.Dock")]
impl DockServer {
    async fn get_running_apps(&self) -> String {
        // In a real Wayland compositor, this would query layer-shell or wlroots for open windows
        // For the MVP DBus API, we return a serialized JSON string of the apps.
        serde_json::to_string(&self.mock_apps).unwrap_or_else(|_| "[]".to_string())
    }
}

pub async fn start_dock_daemon() -> Result<(), Box<dyn std::error::Error>> {
    let server = DockServer {
        mock_apps: vec![
            AppInfo { id: "browser".to_string(), name: "Browser".to_string(), is_running: true },
            AppInfo { id: "terminal".to_string(), name: "Terminal".to_string(), is_running: true },
        ],
    };

    let _conn = Connection::session()
        .await?
        .object_server()
        .at("/com/axiora/Dock", server)
        .await?;

    println!("Axiora OS Dock Daemon running on DBus...");
    std::future::pending::<()>().await;
    Ok(())
}
