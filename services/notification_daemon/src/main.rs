use notification_daemon::start_notification_daemon;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Axiora OS Notification Daemon...");
    start_notification_daemon().await
}
