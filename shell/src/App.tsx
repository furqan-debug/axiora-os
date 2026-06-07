import { useState } from 'react';
import { Dock } from './components/Dock';
import { Launcher } from './components/Launcher';
import { NotificationCenter } from './components/NotificationCenter';

function App() {
  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, right: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowNotifications(!showNotifications)}
        title="Toggle Notification Center"
      />

      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowLauncher(!showLauncher)}
        title="Toggle Launcher"
      />

      {showLauncher && <Launcher onClose={() => setShowLauncher(false)} />}
      {showNotifications && <NotificationCenter />}
      
      <Dock />
    </>
  );
}

export default App;
