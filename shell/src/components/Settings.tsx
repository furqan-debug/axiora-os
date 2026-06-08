import React, { useState } from 'react';
import './Settings.css';
import { invoke } from '@tauri-apps/api/core';
import { Palette, Settings2, Info, Aperture } from 'lucide-react';

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
  const [selectedColor, setSelectedColor] = useState(() => localStorage.getItem('axiora-accent') || 'axiora-blue');
  const [focusOnStartup, setFocusOnStartup] = useState(() => localStorage.getItem('axiora-focus-startup') === 'true');
  const [dockAutohide, setDockAutohide] = useState(() => localStorage.getItem('axiora-dock-autohide') === 'true');

  const handleColorSelect = async (key: string) => {
    setSelectedColor(key);
    const found = ACCENT_COLORS.find(c => c.key === key);
    if (found) {
      document.documentElement.style.setProperty('--accent-color', found.hex);
      localStorage.setItem('axiora-accent', key);
      try {
        await invoke('set_accent_color', { colorKey: key });
      } catch {
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
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-window glass-surface" onClick={e => e.stopPropagation()}>
        <div className="window-header">
          <div className="window-controls">
            <button className="control-btn close" onClick={onClose} aria-label="Close" />
            <button className="control-btn minimize" aria-label="Minimize" />
            <button className="control-btn maximize" aria-label="Maximize" />
          </div>
          <div className="window-title">System Settings</div>
          <div style={{width: '44px'}}></div>
        </div>
        
        <div className="settings-body">
          <div className="settings-sidebar">
            <button 
              className={`sidebar-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={18} strokeWidth={2} />
              <span>Appearance</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'behavior' ? 'active' : ''}`}
              onClick={() => setActiveTab('behavior')}
            >
              <Settings2 size={18} strokeWidth={2} />
              <span>Behavior</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Info size={18} strokeWidth={2} />
              <span>About</span>
            </button>
          </div>
          
          <div className="settings-content">
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h2>Appearance</h2>
                <p className="section-desc">Customize the look and feel of your workspace.</p>
                
                <div className="settings-card">
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
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="settings-section">
                <h2>Behavior</h2>
                <p className="section-desc">Manage system behaviors and interactions.</p>
                
                <div className="settings-card">
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
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-section">
                <h2>About Axiora OS</h2>
                <div className="about-card">
                  <Aperture size={64} className="about-logo" strokeWidth={1.5} color="var(--accent-color)" />
                  <h3 className="about-title">Axiora OS</h3>
                  <p className="about-version">Version 0.1.0 "Vega"</p>
                  <p className="about-kernel">Built on Ubuntu 22.04 LTS</p>
                  <div className="about-divider" />
                  <p className="about-copyright">© 2026 Axiora Systems. All rights reserved.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
