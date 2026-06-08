import React, { useState } from 'react';
import type { AppWindow } from '../WindowManagerProvider';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export const BrowserApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: '#F0F0F0', borderBottom: '1px solid #CCC' }}>
        <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
          <ArrowLeft size={18} style={{ cursor: 'pointer' }} />
          <ArrowRight size={18} style={{ cursor: 'pointer', opacity: 0.5 }} />
          <RotateCw size={18} style={{ cursor: 'pointer' }} />
          <Home size={18} style={{ cursor: 'pointer', marginLeft: '8px' }} />
        </div>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', color: '#999' }} />
          <input 
            type="text" 
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            style={{ width: '100%', padding: '8px 16px 8px 36px', borderRadius: '16px', border: '1px solid #DDD', outline: 'none', fontSize: '14px', backgroundColor: '#FFF' }}
          />
        </form>
      </div>
      <div style={{ flex: 1, backgroundColor: '#FFF' }}>
        <iframe 
          src={url} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Browser"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};
