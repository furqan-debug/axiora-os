import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onOpenSettings }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Listen on document to capture all clicks
    document.addEventListener('mousedown', handleClickOutside);
    // Also close on escape
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="context-menu" 
      style={{ left: x, top: y }}
    >
      <div className="context-menu-item">
        <span>📁</span> New Folder
      </div>
      <div className="context-menu-item">
        <span>📄</span> New Document
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item">
        <span>🖼️</span> Change Background
      </div>
      <div className="context-menu-item" onClick={() => { onClose(); onOpenSettings(); }}>
        <span>⚙️</span> Display Settings
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item">
        <span>💻</span> Open Terminal
      </div>
    </div>
  );
};
