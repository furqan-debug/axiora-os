import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Wifi, Bluetooth, Moon, Sun, Bell, BellOff, X } from 'lucide-react';
import './NotificationCenter.css';

interface Notification {
  id: string;
  app: string;
  icon: string | React.ReactNode;
  title: string;
  body: string;
}

export const NotificationCenter: React.FC = () => {
  const [focusMode, setFocusMode] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from the Rust daemon
    const fetchNotifs = async () => {
      try {
        const rawNotifs: string[] = await invoke('fetch_notifications');
        const parsed = rawNotifs.map((n, i) => {
          const parts = n.split('|');
          return {
            id: i.toString() + '-' + Date.now(),
            app: parts[0] || 'System',
            icon: parts[1] === '🔔' || !parts[1] ? <Bell size={20} /> : <span style={{fontSize: '20px'}}>{parts[1]}</span>,
            title: parts[2] || 'Notification',
            body: parts[3] || ''
          };
        });
        if (parsed.length > 0) {
          setNotifications(prev => [...prev, ...parsed]);
        }
      } catch {
        // Fallback for UI dev
      }
    };
    
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFocus = async () => {
    try {
      const newState: boolean = await invoke('toggle_focus_mode');
      setFocusMode(newState);
    } catch {
      setFocusMode(!focusMode); // Fallback
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notification-panel glass-surface">
      <div className="quick-settings">
        <button 
          className={`qs-toggle ${wifi ? 'active' : ''}`}
          onClick={() => setWifi(!wifi)}
        >
          <div className="qs-icon-wrapper">
            <Wifi size={20} strokeWidth={2} />
          </div>
          <span>Wi-Fi</span>
        </button>
        <button 
          className={`qs-toggle ${bluetooth ? 'active' : ''}`}
          onClick={() => setBluetooth(!bluetooth)}
        >
          <div className="qs-icon-wrapper">
            <Bluetooth size={20} strokeWidth={2} />
          </div>
          <span>Bluetooth</span>
        </button>
        <button 
          className="qs-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <div className="qs-icon-wrapper">
            {theme === 'dark' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
          </div>
          <span>Theme</span>
        </button>
        <button 
          className={`qs-toggle ${focusMode ? 'active' : ''}`}
          onClick={toggleFocus}
        >
          <div className="qs-icon-wrapper">
            {focusMode ? <BellOff size={20} strokeWidth={2} /> : <Bell size={20} strokeWidth={2} />}
          </div>
          <span>Focus</span>
        </button>
      </div>

      <div className="notifications-list">
        <div className="notifications-header">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <button className="clear-btn" onClick={() => setNotifications([])}>
              Clear All
            </button>
          )}
        </div>
        
        <div className="notifications-container">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <BellOff size={48} strokeWidth={1} color="var(--text-disabled)" />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="notification-card">
                <div className="notification-icon-col">{n.icon}</div>
                <div className="notification-content">
                  <div className="notification-card-header">
                    <h4>{n.title}</h4>
                    <button className="notification-close" onClick={() => removeNotification(n.id)}>
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                  <p>{n.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
