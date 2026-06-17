import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Wifi, BatteryMedium, ChevronRight, Check } from 'lucide-react';
import { useWindowManager } from './WindowManagerProvider';
import './MenuBar.css';

export interface MenuBarProps {
  onOpenNotifications?: () => void;
  onOpenLauncher?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onOpenNotifications, onOpenLauncher }) => {
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState('RAM: Loading...');
  const { windows, activeWindowId } = useWindowManager();

  const activeWindow = windows.find(w => w.id === activeWindowId);
  const activeAppName = activeWindow ? activeWindow.title : 'Axiora OS';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Fetch system stats
    const fetchStats = async () => {
      try {
        const stats: string = await invoke('get_system_stats');
        setSystemStats(stats);
      } catch {
        // Fallback or dev
      }
    };

    fetchStats();
    const statInterval = setInterval(() => {
      fetchStats();
    }, 2000);
    
    return () => {
      clearInterval(timer);
      clearInterval(statInterval);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const toggleMenu = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const { closeWindow, minimizeWindow, maximizeWindow, openApp } = useWindowManager();

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <div className="menu-item apple-logo" onClick={onOpenLauncher} style={{ cursor: 'pointer', padding: '0 8px' }}>
          <img src="/favicon.svg" alt="Axiora OS" style={{ width: 16, height: 16, filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }} />
        </div>
        <div className="menu-item active-app-name">
          {activeAppName}
        </div>
        
        <div className="menu-item-container" style={{ position: 'relative' }}>
          <div className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`} onClick={(e) => toggleMenu(e, 'file')}>File</div>
          {activeMenu === 'file' && (
            <div className="menu-dropdown glass-surface">
              <div className="menu-dropdown-item" onClick={() => openApp('notes', 'Notes')}>New Document</div>
              <div className="menu-dropdown-item" onClick={() => openApp('files', 'Files')}>New Window</div>
              <div className="menu-dropdown-divider" />
              <div className="menu-dropdown-item danger" onClick={() => activeWindowId && closeWindow(activeWindowId)}>Close Window</div>
            </div>
          )}
        </div>

        <div className="menu-item-container" style={{ position: 'relative' }}>
          <div className={`menu-item ${activeMenu === 'edit' ? 'active' : ''}`} onClick={(e) => toggleMenu(e, 'edit')}>Edit</div>
          {activeMenu === 'edit' && (
            <div className="menu-dropdown glass-surface">
              <div className="menu-dropdown-item" onClick={() => document.execCommand('undo')}>Undo</div>
              <div className="menu-dropdown-item" onClick={() => document.execCommand('redo')}>Redo</div>
              <div className="menu-dropdown-divider" />
              <div className="menu-dropdown-item" onClick={() => document.execCommand('cut')}>Cut</div>
              <div className="menu-dropdown-item" onClick={() => document.execCommand('copy')}>Copy</div>
              <div className="menu-dropdown-item" onClick={() => document.execCommand('paste')}>Paste</div>
            </div>
          )}
        </div>

        <div className="menu-item-container" style={{ position: 'relative' }}>
          <div className={`menu-item ${activeMenu === 'view' ? 'active' : ''}`} onClick={(e) => toggleMenu(e, 'view')}>View</div>
          {activeMenu === 'view' && (
            <div className="menu-dropdown glass-surface">
              <div className="menu-dropdown-item" onClick={() => activeWindowId && maximizeWindow(activeWindowId)}>Toggle Fullscreen</div>
              <div className="menu-dropdown-item" onClick={() => window.location.reload()}>Reload OS</div>
            </div>
          )}
        </div>

        <div className="menu-item-container" style={{ position: 'relative' }}>
          <div className={`menu-item ${activeMenu === 'window' ? 'active' : ''}`} onClick={(e) => toggleMenu(e, 'window')}>Window</div>
          {activeMenu === 'window' && (
            <div className="menu-dropdown glass-surface">
              <div className="menu-dropdown-item" onClick={() => activeWindowId && minimizeWindow(activeWindowId)}>Minimize</div>
              <div className="menu-dropdown-item" onClick={() => activeWindowId && maximizeWindow(activeWindowId)}>Zoom</div>
            </div>
          )}
        </div>

        <div className="menu-item-container" style={{ position: 'relative' }}>
          <div className={`menu-item ${activeMenu === 'help' ? 'active' : ''}`} onClick={(e) => toggleMenu(e, 'help')}>Help</div>
          {activeMenu === 'help' && (
            <div className="menu-dropdown glass-surface">
              <div className="menu-dropdown-item" onClick={() => window.open('https://github.com/tauri-apps/tauri', '_blank')}>Axiora OS Documentation</div>
            </div>
          )}
        </div>
      </div>

      <div className="menu-bar-right" onClick={onOpenNotifications} style={{ cursor: 'pointer' }}>
        <div className="menu-item stats-item" title={systemStats}>
          {systemStats}
        </div>
        <div className="menu-item">
          <Wifi size={14} strokeWidth={2.5} />
        </div>
        <div className="menu-item">
          <BatteryMedium size={16} strokeWidth={2.5} />
        </div>
        <div className="menu-item time-display">
          {time.toLocaleTimeString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
