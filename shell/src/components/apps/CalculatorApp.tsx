import React, { useState } from 'react';
import type { AppWindow } from '../WindowManagerProvider';

export const CalculatorApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [display, setDisplay] = useState('0');

  const handlePress = (val: string) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') {
      try {
        const calc = new Function('return ' + display.replace(/x/g, '*'));
        setDisplay(String(calc()));
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  const buttons = [
    'C', '(', ')', '/',
    '7', '8', '9', 'x',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#2C2C2C', color: 'white', padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: '48px', padding: '16px', fontWeight: 300, wordBreak: 'break-all' }}>
        {display}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {buttons.map((btn, i) => (
          <button 
            key={i}
            onClick={() => handlePress(btn)}
            style={{ 
              gridColumn: btn === '0' ? 'span 2' : 'span 1',
              padding: '16px', 
              fontSize: '24px', 
              borderRadius: '50px',
              backgroundColor: ['/', 'x', '-', '+', '='].includes(btn) ? '#FF9500' : '#505050',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
