import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  LayoutGrid, 
  Folder, 
  Globe, 
  TerminalSquare, 
  Settings, 
  Wifi, 
  BatteryMedium 
} from 'lucide-react';
import './Dock.css';

interface AppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isRunning: boolean;
}

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
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState('RAM: Loading...');
  const [runningApps, setRunningApps] = useState<AppItem[]>([]);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Fetch system stats
    const fetchStats = async () => {
      try {
        const stats: string = await invoke('get_system_stats');
        setSystemStats(stats);
      } catch (e) {
        console.error(e);
      }
    };

    // Fetch running apps
    const fetchApps = async () => {
      try {
        const appsJson: string = await invoke('fetch_running_apps');
        const apps = JSON.parse(appsJson);
        setRunningApps(apps);
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();
    fetchApps();
    const statInterval = setInterval(() => {
      fetchStats();
      fetchApps();
    }, 2000);
    
    return () => {
      clearInterval(timer);
      clearInterval(statInterval);
    };
  }, []);

  const mergedApps = PINNED_APPS.map(app => {
    const isRunning = runningApps.some(rApp => rApp.id === app.id && rApp.isRunning);
    return { ...app, isRunning };
  });

  return (
    <div className="dock-container glass-surface">
      {mergedApps.map((app) => (
        <div className="dock-item-wrapper" key={app.id}>
          <button 
            className={`dock-item ${hoveredApp === app.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={() => {
              if (app.id === 'settings' && onOpenSettings) onOpenSettings();
              if (app.id === 'launcher' && onOpenLauncher) onOpenLauncher();
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
      <div className="dock-divider" />
      <div className="system-tray">
        <div className="tray-item stats-item" title={systemStats}>
          <span>{systemStats}</span>
        </div>
        <div className="tray-item" title="Wi-Fi">
          <Wifi size={16} strokeWidth={2} />
        </div>
        <div className="tray-item" title="Battery 85%">
          <BatteryMedium size={18} strokeWidth={2} />
        </div>
        <div className="tray-item time-display">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
