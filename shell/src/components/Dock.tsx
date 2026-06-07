import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './Dock.css';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  isRunning: boolean;
}

interface RunningApp {
  id: string;
  name: string;
  icon: string;
  is_active: boolean;
}

interface DockProps {
  onOpenSettings?: () => void;
  onOpenLauncher?: () => void;
}

const PINNED_APPS = [
  { id: 'launcher', name: 'Launcher', icon: '🚀' },
  { id: 'files', name: 'Files', icon: '📁' },
  { id: 'browser', name: 'Browser', icon: '🌐' },
  { id: 'terminal', name: 'Terminal', icon: '💻' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
];

export const Dock: React.FC<DockProps> = ({ onOpenSettings, onOpenLauncher }) => {
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState('RAM: Loading...');
  const [runningApps, setRunningApps] = useState<AppItem[]>([]);

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

  // Merge pinned apps with running state
  const mergedApps = PINNED_APPS.map(app => {
    const isRunning = runningApps.some(rApp => rApp.id === app.id && rApp.is_running);
    return { ...app, isRunning };
  });

  return (
    <div className="dock-container">
      {mergedApps.map((app) => (
        <button 
          key={app.id} 
          className="dock-item" 
          title={app.name}
          onClick={() => {
            if (app.id === 'settings' && onOpenSettings) onOpenSettings();
            if (app.id === 'launcher' && onOpenLauncher) onOpenLauncher();
          }}
        >
          <span className="dock-item-icon">{app.icon}</span>
          {app.isRunning && <div className="dock-item-indicator" />}
        </button>
      ))}
      <div className="dock-divider" />
      <div className="system-tray">
        <span title={systemStats} style={{fontSize: '11px', color: '#ccc', marginRight: '8px'}}>{systemStats}</span>
        <span title="Wi-Fi">📶</span>
        <span title="Battery 85%">🔋</span>
        <span>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

