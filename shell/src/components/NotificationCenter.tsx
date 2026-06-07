import React, { useState } from 'react';
import './NotificationCenter.css';

interface Notification {
  id: string;
  app: string;
  icon: string;
  title: string;
  body: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', app: 'System', icon: '⚙️', title: 'System Update', body: 'Axiora OS Dev Build is ready to install.' },
  { id: '2', app: 'Messages', icon: '💬', title: 'Alice', body: 'Are we still meeting at 3 PM?' },
];

export const NotificationCenter: React.FC = () => {
  const [focusMode, setFocusMode] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  return (
    <div className="notification-panel">
      <div className="quick-settings">
        <button 
          className={`qs-toggle ${wifi ? 'active' : ''}`}
          onClick={() => setWifi(!wifi)}
        >
          <span className="qs-icon">📶</span> Wi-Fi
        </button>
        <button 
          className={`qs-toggle ${bluetooth ? 'active' : ''}`}
          onClick={() => setBluetooth(!bluetooth)}
        >
          <span className="qs-icon">🛜</span> Bluetooth
        </button>
        <button 
          className="qs-toggle"
        >
          <span className="qs-icon">🌗</span> Theme
        </button>
        <button 
          className={`qs-toggle ${focusMode ? 'active' : ''}`}
          onClick={() => setFocusMode(!focusMode)}
        >
          <span className="qs-icon">🌙</span> Focus
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
        
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No new notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="notification-card">
              <div className="notification-icon">{n.icon}</div>
              <div className="notification-content">
                <h4>{n.title}</h4>
                <p>{n.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
