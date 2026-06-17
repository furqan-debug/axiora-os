import React, { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AppWindow } from '../WindowManagerProvider';

export const TerminalApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [history, setHistory] = useState<string[]>(['Axiora OS v0.1.0', 'Type commands to run them on your system.']);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      if (cmd.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      setHistory(prev => [...prev, `axiora@host:~$ ${cmd}`]);
      setInput('');

      try {
        const response: string = await invoke('execute_command', { cmd });
        setHistory(prev => [...prev, response]);
      } catch (err: any) {
        setHistory(prev => [...prev, `Error: ${err}`]);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#1E1E1E', color: '#34C759', padding: '16px', height: '100%', fontFamily: 'monospace', fontSize: '14px', overflowY: 'auto' }}>
      {history.map((line, i) => <div key={i}>{line}</div>)}
      <div style={{ display: 'flex', marginTop: '4px' }}>
        <span style={{ marginRight: '8px' }}>axiora@host:~$</span>
        <input 
          autoFocus
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{ background: 'transparent', border: 'none', color: '#34C759', outline: 'none', flex: 1, fontFamily: 'monospace', fontSize: '14px' }}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};
