import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AppWindow } from '../WindowManagerProvider';
import { Folder, FileText, Image as ImageIcon, HardDrive, Download, Music, File } from 'lucide-react';

interface FileEntry {
  name: string;
  is_dir: boolean;
  size: number;
}

export const FilesApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [currentPath, setCurrentPath] = useState('C:/');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDir = async () => {
      try {
        setError('');
        const res: FileEntry[] = await invoke('list_directory', { path: currentPath });
        setFiles(res.sort((a, b) => (a.is_dir === b.is_dir ? a.name.localeCompare(b.name) : a.is_dir ? -1 : 1)));
      } catch (err: any) {
        setError(err.toString());
      }
    };
    loadDir();
  }, [currentPath]);

  const getIcon = (name: string, is_dir: boolean) => {
    if (is_dir) return <Folder size={48} color="#007AFF" strokeWidth={1} />;
    if (name.endsWith('.png') || name.endsWith('.jpg')) return <ImageIcon size={48} color="#FF9500" strokeWidth={1} />;
    if (name.endsWith('.iso')) return <Download size={48} color="#34C759" strokeWidth={1} />;
    if (name.endsWith('.mp3')) return <Music size={48} color="#FF3B30" strokeWidth={1} />;
    return <FileText size={48} color="#AF52DE" strokeWidth={1} />;
  };

  return (
    <div style={{ display: 'flex', height: '100%', color: 'white' }}>
      <div style={{ width: '200px', backgroundColor: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Locations</div>
        {['C:/', 'C:/Users', 'C:/Program Files', 'C:/Windows'].map(item => (
          <div key={item} onClick={() => setCurrentPath(item)} style={{ padding: '8px 24px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: currentPath === item ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
            <Folder size={16} color="#007AFF" /> {item}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          {currentPath !== 'C:/' && currentPath !== '/' && (
            <button onClick={() => {
              const parts = currentPath.split('/');
              if (parts.length <= 2) {
                setCurrentPath(parts[0] + '/');
              } else {
                setCurrentPath(parts.slice(0, -1).join('/'));
              }
            }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              Back
            </button>
          )}
          {currentPath}
        </div>
        
        {error ? (
          <div style={{ color: '#FF3B30' }}>Error: {error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '24px' }}>
            {files.map(f => (
              <div 
                key={f.name} 
                onDoubleClick={async () => {
                  if (f.is_dir) {
                    setCurrentPath(currentPath.endsWith('/') ? `${currentPath}${f.name}` : `${currentPath}/${f.name}`);
                  } else {
                    const filePath = currentPath.endsWith('/') ? `${currentPath}${f.name}` : `${currentPath}/${f.name}`;
                    try {
                      await invoke('open_file', { path: filePath });
                    } catch (e) {
                      console.error('Failed to open file:', e);
                    }
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
              >
                {getIcon(f.name, f.is_dir)}
                <span style={{ fontSize: '13px', wordBreak: 'break-all', textAlign: 'center' }}>{f.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
