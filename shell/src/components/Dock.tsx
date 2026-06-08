import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Folder, 
  Globe, 
  TerminalSquare, 
  Settings
} from 'lucide-react';
import { useWindowManager } from './WindowManagerProvider';
import './Dock.css';



interface DockProps {
  onOpenSettings?: () => void;
  onOpenLauncher?: () => void;
}

const PINNED_APPS = [
  { id: 'launcher', name: 'Launcher', icon: <LayoutGrid size={24} strokeWidth={1.5} /> },
  { id: 'files', name: 'Files', icon: <Folder size={24} strokeWidth={1.5} /> },
  { id: 'browser', name: 'Browser', icon: <Globe size={24} strokeWidth={1.5} /> },
  { id: 'terminal', name: 'Terminal', icon: <TerminalSquare size={24} strokeWidth={1.5} /> },
  { id: 'settings', name: 'Settings', icon: <Settings size={24} strokeWidth={1.5} /> },
];

export const Dock: React.FC<DockProps> = ({ onOpenSettings, onOpenLauncher }) => {
  const { windows, openApp, focusWindow, minimizeWindow, closeWindow, activeWindowId } = useWindowManager();
  const runningApps = windows.map(w => ({ id: w.appId, isRunning: true, windowId: w.id }));

  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [dockContextMenu, setDockContextMenu] = useState<{appId: string, x: number, y: number, isRunning: boolean} | null>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setDockContextMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const mergedApps = PINNED_APPS.map(app => {
    const isRunning = runningApps.some(rApp => rApp.id === app.id && rApp.isRunning);
    return { ...app, isRunning };
  });

  return (
    <div className="dock-container glass-surface">
      {mergedApps.map((app) => (
        <div 
          className="dock-item-wrapper" 
          key={app.id}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDockContextMenu({ appId: app.id, x: e.clientX, y: e.clientY - 60, isRunning: app.isRunning });
          }}
        >
          <button 
            className={`dock-item ${hoveredApp === app.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={() => {
              if (app.id === 'settings') {
                if (onOpenSettings) onOpenSettings();
              } else if (app.id === 'launcher') {
                if (onOpenLauncher) onOpenLauncher();
              } else {
                // If the app is already open, focus or toggle minimize
                const existingWindow = windows.find(w => w.appId === app.id);
                if (existingWindow) {
                  if (activeWindowId === existingWindow.id) {
                    minimizeWindow(existingWindow.id);
                  } else {
                    focusWindow(existingWindow.id);
                  }
                } else {
                  openApp(app.id, app.name);
                }
              }
            }}
          >
            <span className="dock-item-icon">{app.icon}</span>
            {app.isRunning && <div className="dock-item-indicator" />}
          </button>
          
          {hoveredApp === app.id && (
            <div className="dock-tooltip">
              {app.name}
            </div>
          )}
        </div>
      ))}
      
      {dockContextMenu && (
        <div 
          className="dock-context-menu"
          style={{ left: dockContextMenu.x, top: dockContextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {dockContextMenu.isRunning ? (
            <div 
              className="dock-context-item danger"
              onClick={() => {
                const existingWindow = windows.find(w => w.appId === dockContextMenu.appId);
                if (existingWindow) closeWindow(existingWindow.id);
                setDockContextMenu(null);
              }}
            >
              Close Window
            </div>
          ) : (
            <div 
              className="dock-context-item"
              onClick={() => {
                const app = PINNED_APPS.find(a => a.id === dockContextMenu.appId);
                if (app) openApp(app.id, app.name);
                setDockContextMenu(null);
              }}
            >
              Open App
            </div>
          )}
        </div>
      )}
    </div>
  );
};
