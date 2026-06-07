import React, { useState, useEffect } from 'react';
import './Dock.css';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  isRunning: boolean;
}

const PINPED_APPS: AppItem[] = [
  { id: 'launcher', name: 'Launcher', icon: '🚀', isRunning: false },
  { id: 'files', name: 'Files', icon: '📁', isRunning: false },
  { id: 'browser', name: 'Browser', icon: '🌐', isRunning: true },
  { id: 'terminal', name: 'Terminal', icon: '💻', isRunning: true },
  { id: 'settings', name: 'Settings', icon: '⚙️', isRunning: false },
];

export const Dock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dock-container">
      {PINPED_APPS.map((app) => (
        <button key={app.id} className="dock-item" title={app.name}>
          <span className="dock-item-icon">{app.icon}</span>
          {app.isRunning && <div className="dock-item-indicator" />}
        </button>
      ))}
      <div className="dock-divider" />
      <div className="system-tray">
        <span title="Wi-Fi">📶</span>
        <span title="Battery 85%">🔋</span>
        <span>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
