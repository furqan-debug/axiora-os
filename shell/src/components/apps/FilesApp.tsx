import React from 'react';
import type { AppWindow } from '../WindowManagerProvider';
import { Folder, FileText, Image, HardDrive, Download, Music } from 'lucide-react';

export const FilesApp: React.FC<{ appWindow: AppWindow }> = () => {
  return (
    <div style={{ display: 'flex', height: '100%', color: 'white' }}>
      <div style={{ width: '200px', backgroundColor: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Locations</div>
        {['Home', 'Documents', 'Downloads', 'Music', 'Pictures'].map(item => (
          <div key={item} style={{ padding: '8px 24px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Folder size={16} color="#007AFF" /> {item}
          </div>
        ))}
        <div style={{ padding: '16px 16px 8px', fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Drives</div>
        <div style={{ padding: '8px 24px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HardDrive size={16} color="#888" /> OS Disk (C:)
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Home</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Folder size={48} color="#007AFF" strokeWidth={1} />
            <span style={{ fontSize: '13px' }}>Projects</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <FileText size={48} color="#AF52DE" strokeWidth={1} />
            <span style={{ fontSize: '13px' }}>notes.txt</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Image size={48} color="#FF9500" strokeWidth={1} />
            <span style={{ fontSize: '13px' }}>wallpaper.png</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download size={48} color="#34C759" strokeWidth={1} />
            <span style={{ fontSize: '13px' }}>installer.iso</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Music size={48} color="#FF3B30" strokeWidth={1} />
            <span style={{ fontSize: '13px' }}>audio.mp3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
