import React, { useState } from 'react';
import './WorkspaceManager.css';

interface WorkspaceManagerProps {
  onClose: () => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onClose }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(1);

  const workspaces = [
    { id: 1, name: 'Workspace 1', windows: ['w1', 'w2'] },
    { id: 2, name: 'Workspace 2', windows: ['w3'] },
    { id: 3, name: 'Workspace 3', windows: [] },
  ];

  const handleSelect = (id: number) => {
    setActiveWorkspace(id);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div className="workspace-manager-overlay" onClick={onClose}>
      <div className="workspace-header">Workspaces</div>
      
      <div className="workspace-grid" onClick={e => e.stopPropagation()}>
        {workspaces.map(ws => (
          <div 
            key={ws.id}
            className={`workspace-card ${activeWorkspace === ws.id ? 'active' : ''}`}
            onClick={() => handleSelect(ws.id)}
          >
            {ws.windows.length === 0 && <span className="workspace-label">{ws.name}</span>}
            
            {ws.windows.map(w => (
              <div key={w} className={`mock-win ${w}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
