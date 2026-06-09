import React, { useState } from 'react';
import type { AppWindow } from '../WindowManagerProvider';

export const NotesApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [note, setNote] = useState('Welcome to Notes!\n\nThis project is developed under the guidence of Dr. Sir Rahil. It is a part of the curriculum for the course "Operating Systems Lab" at SSUET.\n\nFeel free to jot down your thoughts here!');

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#FFF5E1', color: '#333' }}>
      <div style={{ width: '200px', borderRight: '1px solid rgba(0,0,0,0.1)', padding: '16px' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>All Notes</div>
        <div style={{ padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
          Welcome Note
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px' }}>
        <textarea 
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', resize: 'none', outline: 'none', fontSize: '16px', lineHeight: 1.6, fontFamily: 'inherit', color: '#333' }}
        />
      </div>
    </div>
  );
};
