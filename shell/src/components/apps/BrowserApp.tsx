import React, { useState, useRef } from 'react';
import type { AppWindow } from '../WindowManagerProvider';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export const BrowserApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [reloadKey, setReloadKey] = useState(0);

  const currentUrl = history[currentIndex] || '';

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    // Slice off future history if navigating from a past state
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setInputUrl(finalUrl);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setInputUrl(history[currentIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputUrl(history[currentIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleHome = () => {
    const homeUrl = 'https://www.google.com';
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(homeUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setInputUrl(homeUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: '#F0F0F0', borderBottom: '1px solid #CCC' }}>
        <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
          <ArrowLeft size={18} style={{ cursor: currentIndex > 0 ? 'pointer' : 'default', opacity: currentIndex > 0 ? 1 : 0.5 }} onClick={handleBack} />
          <ArrowRight size={18} style={{ cursor: currentIndex < history.length - 1 ? 'pointer' : 'default', opacity: currentIndex < history.length - 1 ? 1 : 0.5 }} onClick={handleForward} />
          <RotateCw size={18} style={{ cursor: 'pointer' }} onClick={handleRefresh} />
          <Home size={18} style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={handleHome} />
        </div>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', color: '#999' }} />
          <input 
            type="text" 
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            style={{ width: '100%', padding: '8px 16px 8px 36px', borderRadius: '16px', border: '1px solid #DDD', outline: 'none', fontSize: '14px', backgroundColor: '#FFF', color: '#333' }}
          />
        </form>
      </div>
      <div style={{ flex: 1, backgroundColor: '#FFF' }}>
        <iframe 
          key={reloadKey}
          src={currentUrl} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};
