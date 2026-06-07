import { useState, useEffect } from 'react';
import { Dock } from './components/Dock';
import { Launcher } from './components/Launcher';
import { NotificationCenter } from './components/NotificationCenter';
import { Welcome } from './components/Welcome';
import { Settings } from './components/Settings';
import { ContextMenu } from './components/ContextMenu';
import { WorkspaceManager } from './components/WorkspaceManager';

const isFirstRun = !localStorage.getItem('axiora-welcome-done');

function App() {
  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(!isFirstRun);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle WorkspaceManager with Meta+Tab
      if (e.key === 'Tab' && e.metaKey) {
        e.preventDefault();
        setShowWorkspaces(prev => !prev);
        return;
      }
      
      // Toggle Launcher with Super/Meta key
      if (e.key === 'Meta') {
        setShowLauncher(prev => !prev);
      }
      // Close things with Escape
      if (e.key === 'Escape') {
        setShowLauncher(false);
        setShowNotifications(false);
        setShowSettings(false);
        setShowWorkspaces(false);
        setContextMenu(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* First-run welcome wizard */}
      {!welcomeDone && <Welcome onComplete={() => setWelcomeDone(true)} />}

      {/* Top-right hot corner → Notification Center */}
      <div
        style={{ position: 'fixed', top: 0, right: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowNotifications(!showNotifications)}
        title="Toggle Notification Center"
      />

      {/* Top-left hot corner → Launcher */}
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowLauncher(!showLauncher)}
        title="Toggle Launcher"
      />

      {showLauncher && <Launcher onClose={() => setShowLauncher(false)} />}
      {showNotifications && <NotificationCenter />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showWorkspaces && <WorkspaceManager onClose={() => setShowWorkspaces(false)} />}
      
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      <Dock onOpenSettings={() => setShowSettings(true)} onOpenLauncher={() => setShowLauncher(true)} />
    </div>
  );
}

export default App;

