use focus_mode::start_focus_mode_daemon;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Axiora OS Focus Mode Daemon...");
    start_focus_mode_daemon().await
}
