use dock_daemon::start_dock_daemon;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Axiora OS Dock Daemon...");
    start_dock_daemon().await
}
