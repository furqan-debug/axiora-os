import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  TerminalSquare, 
  Folder, 
  Settings, 
  StickyNote, 
  Calculator, 
  Calendar, 
  Music,
  Search
} from 'lucide-react';
import { useWindowManager } from './WindowManagerProvider';
import './Launcher.css';

const INSTALLED_APPS = [
  { id: 'browser', name: 'Browser', icon: <Globe size={40} strokeWidth={1.5} /> },
  { id: 'terminal', name: 'Terminal', icon: <TerminalSquare size={40} strokeWidth={1.5} /> },
  { id: 'files', name: 'Files', icon: <Folder size={40} strokeWidth={1.5} /> },
  { id: 'settings', name: 'Settings', icon: <Settings size={40} strokeWidth={1.5} /> },
  { id: 'notes', name: 'Notes', icon: <StickyNote size={40} strokeWidth={1.5} /> },
  { id: 'calculator', name: 'Calculator', icon: <Calculator size={40} strokeWidth={1.5} /> },
  { id: 'calendar', name: 'Calendar', icon: <Calendar size={40} strokeWidth={1.5} /> },
  { id: 'music', name: 'Music', icon: <Music size={40} strokeWidth={1.5} /> },
];

export const Launcher: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { openApp } = useWindowManager();

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredApps = INSTALLED_APPS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="launcher-overlay" onClick={onClose}>
      <div className="launcher-content" onClick={e => e.stopPropagation()}>
        <div className="search-container">
          <Search className="search-icon" size={20} strokeWidth={2} />
          <input 
            ref={inputRef}
            type="text" 
            className="search-input"
            placeholder="Search applications, files, and settings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="app-grid-container">
          {filteredApps.length > 0 ? (
            <div className="app-grid">
              {filteredApps.map(app => (
                <button 
                  key={app.id} 
                  className="app-card"
                  onClick={() => {
                    openApp(app.id, app.name);
                    onClose();
                  }}
                >
                  <div className="app-icon">{app.icon}</div>
                  <span className="app-name">{app.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
