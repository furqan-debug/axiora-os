import React, { useState, useRef, useEffect } from 'react';
import type { AppWindow } from '../WindowManagerProvider';

export const TerminalApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [history, setHistory] = useState<string[]>(['Axiora OS v0.1.0', 'Type "help" for available commands.']);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      let response = '';
      
      switch (cmd.toLowerCase()) {
        case 'help': response = 'Commands: help, clear, date, echo, ls, uname'; break;
        case 'clear': setHistory([]); setInput(''); return;
        case 'date': response = new Date().toString(); break;
        case 'ls': response = 'Desktop Documents Downloads Music Pictures Public Templates Videos'; break;
        case 'uname': response = 'Axiora-OS vega x86_64'; break;
        case '': break;
        default: 
          if (cmd.startsWith('echo ')) {
            response = cmd.slice(5);
          } else {
            response = `Command not found: ${cmd}`;
          }
      }
      
      setHistory(prev => [...prev, `axiora@host:~$ ${cmd}`, ...(response ? [response] : [])]);
      setInput('');
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
