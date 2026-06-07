import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './Welcome.css';

const ACCENT_COLORS = [
  { key: 'axiora-blue',   hex: '#007AFF', label: 'Axiora Blue' },
  { key: 'axiora-purple', hex: '#AF52DE', label: 'Axiora Purple' },
  { key: 'emerald-green', hex: '#34C759', label: 'Emerald Green' },
  { key: 'sunset-orange', hex: '#FF9500', label: 'Sunset Orange' },
  { key: 'crimson-red',   hex: '#FF3B30', label: 'Crimson Red' },
];

const TOTAL_STEPS = 3;

interface WelcomeProps {
  onComplete: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedColor, setSelectedColor] = useState('axiora-blue');
  const [privacy, setPrivacy] = useState({ crashReports: false, analytics: false });

  const handleColorSelect = (key: string) => {
    setSelectedColor(key);
    const found = ACCENT_COLORS.find(c => c.key === key);
    if (found) {
      document.documentElement.style.setProperty('--accent-color', found.hex);
    }
  };

  const handleFinish = async () => {
    try {
      await invoke('set_accent_color', { colorKey: selectedColor });
    } catch {
      // Falls back gracefully when not in Tauri env
    }
    localStorage.setItem('axiora-welcome-done', '1');
    localStorage.setItem('axiora-accent', selectedColor);
    onComplete();
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="welcome-overlay">
      <div className="wizard-card">

        {/* ── Step 0: Welcome ─────────────────────────────────── */}
        {step === 0 && (
          <>
            <div className="wizard-header">
              <div className="wizard-logo">✦</div>
              <h1>Welcome to Axiora OS</h1>
              <p>A modern, fast, and beautiful desktop experience.<br />Let's get you set up in under a minute.</p>
            </div>
            <div className="wizard-body" style={{ textAlign: 'center', paddingTop: '8px' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                Axiora OS 0.1.0 "Vega" · Built on Ubuntu 22.04 LTS
              </p>
            </div>
          </>
        )}

        {/* ── Step 1: Accent colour ────────────────────────────── */}
        {step === 1 && (
          <>
            <div className="wizard-header">
              <div className="wizard-logo">🎨</div>
              <h1>Choose your accent color</h1>
              <p>This color will be used across the dock, notifications, and quick settings.</p>
            </div>
            <div className="wizard-body">
              <div className="color-grid">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c.key}
                    className={`color-swatch ${selectedColor === c.key ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    title={c.label}
                    onClick={() => handleColorSelect(c.key)}
                  />
                ))}
              </div>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '8px' }}>
                {ACCENT_COLORS.find(c => c.key === selectedColor)?.label}
              </p>
            </div>
          </>
        )}

        {/* ── Step 2: Privacy ──────────────────────────────────── */}
        {step === 2 && (
          <>
            <div className="wizard-header">
              <div className="wizard-logo">🔒</div>
              <h1>Privacy settings</h1>
              <p>Axiora OS respects your privacy. Nothing is shared without your consent.</p>
            </div>
            <div className="wizard-body">
              {[
                {
                  key: 'crashReports',
                  title: 'Crash Reports',
                  desc: 'Automatically send anonymous crash logs to help improve stability.',
                },
                {
                  key: 'analytics',
                  title: 'Usage Analytics',
                  desc: 'Share anonymous feature usage data to guide future development.',
                },
              ].map(item => (
                <div className="toggle-row" key={item.key}>
                  <div className="toggle-label">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <button
                    className={`toggle-switch ${privacy[item.key as keyof typeof privacy] ? 'on' : ''}`}
                    onClick={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key as keyof typeof privacy] }))}
                    aria-label={`Toggle ${item.title}`}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className="wizard-footer">
          <div className="step-dots">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
            ))}
          </div>
          <div className="wizard-nav">
            {step > 0 && (
              <button className="btn-secondary" onClick={back}>Back</button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button className="btn-primary" onClick={next}>
                {step === 0 ? 'Get Started' : 'Next'}
              </button>
            ) : (
              <button className="btn-primary" onClick={handleFinish}>
                Start Exploring ✦
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
