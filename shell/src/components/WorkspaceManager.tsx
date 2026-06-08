import React, { useState } from 'react';
import { Monitor, Plus } from 'lucide-react';
import './WorkspaceManager.css';

interface WorkspaceManagerProps {
  onClose: () => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onClose }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  // In a real implementation, this state would come from the compositor
  const workspaces = [
    { id: 1, name: 'Main', windows: ['w1', 'w2'] },
    { id: 2, name: 'Development', windows: ['w3'] },
    { id: 3, name: 'Browser', windows: [] },
  ];

  const handleSelect = (id: number) => {
    setActiveWorkspace(id);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250); // Matches the slideOut/fadeOut animation
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <div 
      className={`workspace-manager-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
    >
      <div className={`workspace-header ${isClosing ? 'fade-out' : 'fade-in-down'}`}>
        Workspaces Overview
      </div>
      
      <div 
        className={`workspace-grid ${isClosing ? 'fade-out-down' : 'fade-in-up'}`} 
        onClick={e => e.stopPropagation()}
      >
        {workspaces.map(ws => (
          <div 
            key={ws.id}
            className={`workspace-card ${activeWorkspace === ws.id ? 'active' : ''}`}
            onClick={() => handleSelect(ws.id)}
          >
            <div className="workspace-card-inner">
              {ws.windows.length === 0 ? (
                <div className="empty-workspace">
                  <Monitor size={48} strokeWidth={1} />
                  <span className="workspace-label">{ws.name}</span>
                </div>
              ) : (
                <>
                  <span className="workspace-label-top">{ws.name}</span>
                  {ws.windows.map(w => (
                    <div key={w} className={`mock-win ${w}`} />
                  ))}
                </>
              )}
            </div>
            {activeWorkspace === ws.id && (
              <div className="workspace-indicator" />
            )}
          </div>
        ))}
        
        {/* Add New Workspace Button */}
        <div className="workspace-card add-new">
          <div className="workspace-card-inner center-content">
            <Plus size={40} strokeWidth={1.5} color="var(--text-disabled)" />
          </div>
        </div>
      </div>
    </div>
  );
};
