import React, { useEffect, useRef } from 'react';
import { FolderPlus, FilePlus, Image as ImageIcon, Settings, TerminalSquare } from 'lucide-react';
import { useWindowManager } from './WindowManagerProvider';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onOpenSettings }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { openApp } = useWindowManager();

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

  // Ensure menu doesn't go off-screen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  return (
    <div 
      ref={menuRef}
      className="context-menu glass-surface" 
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="context-menu-item" onClick={() => { openApp('files', 'Files'); onClose(); }}>
        <FolderPlus size={16} strokeWidth={1.5} className="context-menu-icon" />
        <span>New Folder</span>
      </div>
      <div className="context-menu-item" onClick={() => { openApp('notes', 'Notes'); onClose(); }}>
        <FilePlus size={16} strokeWidth={1.5} className="context-menu-icon" />
        <span>New Document</span>
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item" onClick={() => { onOpenSettings(); onClose(); }}>
        <ImageIcon size={16} strokeWidth={1.5} className="context-menu-icon" />
        <span>Change Background</span>
      </div>
      <div className="context-menu-item" onClick={() => { onOpenSettings(); onClose(); }}>
        <Settings size={16} strokeWidth={1.5} className="context-menu-icon" />
        <span>Display Settings</span>
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item" onClick={() => { openApp('terminal', 'Terminal'); onClose(); }}>
        <TerminalSquare size={16} strokeWidth={1.5} className="context-menu-icon" />
        <span>Open Terminal</span>
      </div>
    </div>
  );
};
