import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Sparkles, Palette, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
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
      <div className="wizard-card glass-surface">

        {/* ── Step 0: Welcome ─────────────────────────────────── */}
        {step === 0 && (
          <div className="wizard-step-content animation-slide-up">
            <div className="wizard-header">
              <div className="wizard-icon-container">
                <Sparkles size={48} strokeWidth={1.5} color="var(--accent-color)" />
              </div>
              <h1>Welcome to Axiora OS</h1>
              <p>A modern, fast, and beautiful desktop experience.<br />Let's get you set up in under a minute.</p>
            </div>
            <div className="wizard-body center-content">
              <div className="system-info-badge">
                <span>Axiora OS 0.1.0 "Vega"</span>
                <span className="dot-separator">•</span>
                <span>Ubuntu 22.04 LTS Core</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Accent colour ────────────────────────────── */}
        {step === 1 && (
          <div className="wizard-step-content animation-slide-up">
            <div className="wizard-header">
              <div className="wizard-icon-container">
                <Palette size={48} strokeWidth={1.5} color="var(--accent-color)" />
              </div>
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
                  >
                    {selectedColor === c.key && <div className="color-swatch-inner" />}
                  </button>
                ))}
              </div>
              <p className="selected-color-label">
                {ACCENT_COLORS.find(c => c.key === selectedColor)?.label}
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Privacy ──────────────────────────────────── */}
        {step === 2 && (
          <div className="wizard-step-content animation-slide-up">
            <div className="wizard-header">
              <div className="wizard-icon-container">
                <ShieldCheck size={48} strokeWidth={1.5} color="var(--accent-color)" />
              </div>
              <h1>Privacy settings</h1>
              <p>Axiora OS respects your privacy. Nothing is shared without your consent.</p>
            </div>
            <div className="wizard-body privacy-body">
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
                <div className="privacy-toggle-row" key={item.key}>
                  <div className="privacy-label">
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
          </div>
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
              <button className="btn-secondary" onClick={back}>
                <ChevronLeft size={18} />
                Back
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button className="btn-primary" onClick={next}>
                {step === 0 ? 'Get Started' : 'Continue'}
                {step > 0 && <ChevronRight size={18} />}
              </button>
            ) : (
              <button className="btn-primary start-exploring" onClick={handleFinish}>
                Start Exploring
                <Sparkles size={16} style={{marginLeft: '8px'}} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
