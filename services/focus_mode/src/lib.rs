use zbus::{interface, Connection};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

pub struct FocusModeServer {
    is_active: Arc<AtomicBool>,
}

#[interface(name = "com.axiora.FocusMode")]
impl FocusModeServer {
    async fn toggle(&self) -> bool {
        let current = self.is_active.load(Ordering::SeqCst);
        let new_state = !current;
        self.is_active.store(new_state, Ordering::SeqCst);
        println!("Focus mode toggled to: {}", new_state);
        new_state
    }

    async fn get_status(&self) -> bool {
        self.is_active.load(Ordering::SeqCst)
    }
}

pub async fn start_focus_mode_daemon() -> Result<(), Box<dyn std::error::Error>> {
    let server = FocusModeServer {
        is_active: Arc::new(AtomicBool::new(false)),
    };

    let _conn = Connection::session()
        .await?
        .object_server()
        .at("/com/axiora/FocusMode", server)
        .await?;

    println!("Axiora OS Focus Mode Daemon running on DBus...");
    std::future::pending::<()>().await;
    Ok(())
}
