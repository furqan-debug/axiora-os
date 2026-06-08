import { useState, useEffect } from 'react';
import { Dock } from './components/Dock';
import { Launcher } from './components/Launcher';
import { NotificationCenter } from './components/NotificationCenter';
import { Welcome } from './components/Welcome';
import { Settings } from './components/Settings';
import { MenuBar } from './components/MenuBar';
import { ContextMenu } from './components/ContextMenu';
import { WorkspaceManager } from './components/WorkspaceManager';
import { WindowManagerProvider, useWindowManager } from './components/WindowManagerProvider';
import type { AppWindow } from './components/WindowManagerProvider';
import { Window } from './components/Window';

// Mock Apps
import { TerminalApp } from './components/apps/TerminalApp';
import { FilesApp } from './components/apps/FilesApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { NotesApp } from './components/apps/NotesApp';

const isFirstRun = !localStorage.getItem('axiora-welcome-done');

// Helper to render the correct app component inside the Window wrapper
const DesktopWindows: React.FC = () => {
  const { windows } = useWindowManager();

  const renderApp = (appWindow: AppWindow) => {
    switch (appWindow.appId) {
      case 'terminal': return <TerminalApp appWindow={appWindow} />; 
      case 'files': return <FilesApp appWindow={appWindow} />; 
      case 'browser': return <BrowserApp appWindow={appWindow} />; 
      case 'calculator': return <CalculatorApp appWindow={appWindow} />; 
      case 'notes': return <NotesApp appWindow={appWindow} />; 
      default: return <div style={{ padding: '20px', color: 'white' }}>App "{appWindow.appId}" not found.</div>;
    }
  };

  const getAppDimensions = (appId: string) => {
    switch (appId) {
      case 'terminal': return { w: 700, h: 450 };
      case 'browser': return { w: 1000, h: 700 };
      case 'calculator': return { w: 320, h: 500 };
      case 'notes': return { w: 600, h: 500 };
      default: return { w: 800, h: 600 };
    }
  };

  return (
    <>
      {windows.map(appWindow => {
        const { w, h } = getAppDimensions(appWindow.appId);
        return (
          <Window key={appWindow.id} appWindow={appWindow} defaultWidth={w} defaultHeight={h}>
            {renderApp(appWindow)}
          </Window>
        );
      })}
    </>
  );
};

function Desktop() {
  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(!isFirstRun);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, type: 'desktop' | 'window', targetId?: string} | null>(null);
  
  const { closeWindow, minimizeWindow } = useWindowManager();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.metaKey) {
        e.preventDefault();
        setShowWorkspaces(prev => !prev);
        return;
      }
      if (e.key === 'Meta') {
        setShowLauncher(prev => !prev);
      }
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
    
    // Check if clicked inside a window
    const windowElement = (e.target as HTMLElement).closest('[data-window-id]');
    if (windowElement) {
      const winId = windowElement.getAttribute('data-window-id');
      if (winId) {
        setContextMenu({ x: e.clientX, y: e.clientY, type: 'window', targetId: winId });
        return;
      }
    }

    setContextMenu({ x: e.clientX, y: e.clientY, type: 'desktop' });
  };

  return (
    <div 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {!welcomeDone && <Welcome onComplete={() => setWelcomeDone(true)} />}

      <div
        style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowNotifications(!showNotifications)}
        title="Toggle Notification Center"
      />

      <div
        style={{ position: 'absolute', top: '28px', left: 0, width: '50px', height: '50px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setShowLauncher(!showLauncher)}
        title="Toggle Launcher"
      />

      <MenuBar />

      <div className="desktop-area" style={{ position: 'absolute', top: '28px', left: 0, right: 0, bottom: 0 }}>
        {/* Render the actual applications managed by WindowManager */}
        <DesktopWindows />
      </div>

      {/* System Overlays */}
      {showLauncher && <Launcher onClose={() => setShowLauncher(false)} />}
      {showNotifications && <NotificationCenter />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showWorkspaces && <WorkspaceManager onClose={() => setShowWorkspaces(false)} />}
      
      {contextMenu && contextMenu.type === 'desktop' && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {contextMenu && contextMenu.type === 'window' && contextMenu.targetId && (
        <div 
          className="dock-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="dock-context-item danger"
            onClick={() => {
              closeWindow(contextMenu.targetId!);
              setContextMenu(null);
            }}
          >
            Close Window
          </div>
          <div 
            className="dock-context-item"
            onClick={() => {
              minimizeWindow(contextMenu.targetId!);
              setContextMenu(null);
            }}
          >
            Minimize Window
          </div>
        </div>
      )}

      <Dock onOpenSettings={() => setShowSettings(true)} onOpenLauncher={() => setShowLauncher(true)} />
    </div>
  );
}

function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}

export default App;
