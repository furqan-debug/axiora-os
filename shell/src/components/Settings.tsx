import React, { useState, useEffect } from 'react';
import './Settings.css';
import { invoke } from '@tauri-apps/api/core';

const ACCENT_COLORS = [
  { key: 'axiora-blue',   hex: '#007AFF', label: 'Axiora Blue' },
  { key: 'axiora-purple', hex: '#AF52DE', label: 'Axiora Purple' },
  { key: 'emerald-green', hex: '#34C759', label: 'Emerald Green' },
  { key: 'sunset-orange', hex: '#FF9500', label: 'Sunset Orange' },
  { key: 'crimson-red',   hex: '#FF3B30', label: 'Crimson Red' },
];

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [selectedColor, setSelectedColor] = useState('axiora-blue');
  const [focusOnStartup, setFocusOnStartup] = useState(false);
  const [dockAutohide, setDockAutohide] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem('axiora-accent') || 'axiora-blue';
    setSelectedColor(savedColor);
    
    // In a real environment, we'd fetch focusOnStartup and dockAutohide from GSettings via Tauri
    const savedFocus = localStorage.getItem('axiora-focus-startup') === 'true';
    setFocusOnStartup(savedFocus);
    
    const savedDock = localStorage.getItem('axiora-dock-autohide') === 'true';
    setDockAutohide(savedDock);
  }, []);

  const handleColorSelect = async (key: string) => {
    setSelectedColor(key);
    const found = ACCENT_COLORS.find(c => c.key === key);
    if (found) {
      document.documentElement.style.setProperty('--accent-color', found.hex);
      localStorage.setItem('axiora-accent', key);
      try {
        await invoke('set_accent_color', { colorKey: key });
      } catch (e) {
        // Ignore if not running in Tauri
      }
    }
  };

  const handleFocusToggle = () => {
    const newVal = !focusOnStartup;
    setFocusOnStartup(newVal);
    localStorage.setItem('axiora-focus-startup', String(newVal));
  };

  const handleDockToggle = () => {
    const newVal = !dockAutohide;
    setDockAutohide(newVal);
    localStorage.setItem('axiora-dock-autohide', String(newVal));
  };

  return (
    <div className="settings-window">
      <div className="window-header">
        <div className="window-controls">
          <button className="control-btn close" onClick={onClose} aria-label="Close" />
          <button className="control-btn minimize" aria-label="Minimize" />
          <button className="control-btn maximize" aria-label="Maximize" />
        </div>
        <div className="window-title">Settings</div>
        <div style={{width: '44px'}}></div> {/* Spacer for centering title */}
      </div>
      
      <div className="settings-body">
        <div className="settings-sidebar">
          <button 
            className={`sidebar-item ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'behavior' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavior')}
          >
            Behavior
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>
        
        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              
              <div className="settings-row">
                <div className="settings-label">
                  <h3>Accent Color</h3>
                  <p>Choose the primary color for the desktop interface</p>
                </div>
                <div className="settings-color-grid">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.key}
                      className={`settings-color-swatch ${selectedColor === c.key ? 'selected' : ''}`}
                      style={{ background: c.hex }}
                      title={c.label}
                      onClick={() => handleColorSelect(c.key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="settings-section">
              <h2>Behavior</h2>
              
              <div className="settings-row">
                <div className="settings-label">
                  <h3>Focus Mode on Startup</h3>
                  <p>Automatically suppress notifications when you log in</p>
                </div>
                <button
                  className={`toggle-switch ${focusOnStartup ? 'on' : ''}`}
                  onClick={handleFocusToggle}
                  aria-label="Toggle Focus Mode on Startup"
                />
              </div>

              <div className="settings-row">
                <div className="settings-label">
                  <h3>Auto-hide Dock</h3>
                  <p>Hide the dock when windows overlap with it</p>
                </div>
                <button
                  className={`toggle-switch ${dockAutohide ? 'on' : ''}`}
                  onClick={handleDockToggle}
                  aria-label="Toggle Auto-hide Dock"
                />
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="settings-section">
              <h2>About Axiora OS</h2>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Axiora OS</h3>
                <p style={{ color: '#999', margin: '0 0 24px 0' }}>Version 0.1.0 "Vega"</p>
                <p style={{ color: '#999', fontSize: '14px' }}>Built on Ubuntu 22.04 LTS</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
