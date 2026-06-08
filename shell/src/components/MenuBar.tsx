import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Wifi, BatteryMedium, Apple } from 'lucide-react';
import { useWindowManager } from './WindowManagerProvider';
import './MenuBar.css';

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState('RAM: Loading...');
  const { windows, activeWindowId } = useWindowManager();

  const activeWindow = windows.find(w => w.id === activeWindowId);
  const activeAppName = activeWindow ? activeWindow.title : 'Finder';

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

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <div className="menu-item apple-logo">
          <Apple size={16} fill="currentColor" />
        </div>
        <div className="menu-item active-app-name">
          {activeAppName}
        </div>
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Window</div>
        <div className="menu-item">Help</div>
      </div>

      <div className="menu-bar-right">
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
