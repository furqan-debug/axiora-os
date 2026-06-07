import React, { useState } from 'react';
import './Launcher.css';

const INSTALLED_APPS = [
  { id: 'browser', name: 'Browser', icon: '🌐' },
  { id: 'terminal', name: 'Terminal', icon: '💻' },
  { id: 'files', name: 'Files', icon: '📁' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'calendar', name: 'Calendar', icon: '📅' },
  { id: 'music', name: 'Music', icon: '🎵' },
];

export const Launcher: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = INSTALLED_APPS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="launcher-overlay" onClick={onClose}>
      <div className="search-container" onClick={e => e.stopPropagation()}>
        <input 
          type="text" 
          className="search-input"
          placeholder="Search applications, files, and settings..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="app-grid" onClick={e => e.stopPropagation()}>
        {filteredApps.map(app => (
          <button key={app.id} className="app-card">
            <span className="app-icon">{app.icon}</span>
            <span className="app-name">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
