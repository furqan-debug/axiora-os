use std::collections::HashMap;
use zbus::{interface, Connection};
use zbus::zvariant::Value;

pub struct NotificationServer {
    // Stores notifications in a simple queue for the MVP
    pub queue: std::sync::Mutex<Vec<String>>,
}

#[interface(name = "org.freedesktop.Notifications")]
impl NotificationServer {
    /// Standard Desktop Notification DBus method
    async fn notify(
        &self,
        app_name: String,
        replaces_id: u32,
        app_icon: String,
        summary: String,
        body: String,
        actions: Vec<String>,
        hints: HashMap<String, Value<'_>>,
        expire_timeout: i32,
    ) -> u32 {
        println!("Received Notification from {}: {} - {}", app_name, summary, body);
        
        let notif_str = format!("{}|{}|{}|{}", app_name, app_icon, summary, body);
        if let Ok(mut q) = self.queue.lock() {
            q.push(notif_str);
        }

        // Return a dummy notification ID
        replaces_id + 1
    }

    /// Axiora-specific extension to fetch the queue from the UI
    async fn get_axiora_notifications(&self) -> Vec<String> {
        if let Ok(mut q) = self.queue.lock() {
            let res = q.clone();
            q.clear(); // clear after reading
            return res;
        }
        vec![]
    }

    async fn get_capabilities(&self) -> Vec<String> {
        vec![
            "body".to_string(),
            "actions".to_string(),
            "icon-static".to_string(),
        ]
    }

    async fn get_server_information(&self) -> (String, String, String, String) {
        (
            "Axiora Notification Daemon".to_string(),
            "Axiora".to_string(),
            "0.1.0".to_string(),
            "1.2".to_string(),
        )
    }
}

pub async fn start_notification_daemon() -> Result<(), Box<dyn std::error::Error>> {
    let server = NotificationServer {
        queue: std::sync::Mutex::new(Vec::new()),
    };

    let _conn = Connection::session()
        .await?
        .object_server()
        .at("/org/freedesktop/Notifications", server)
        .await?;

    println!("Axiora OS Notification Daemon running on DBus...");
    std::future::pending::<()>().await;
    Ok(())
}
