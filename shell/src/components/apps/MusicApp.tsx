import React, { useState, useRef, useEffect } from 'react';
import type { AppWindow } from '../WindowManagerProvider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const MusicApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(total);
      if (total > 0) setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = clickX / rect.width;
      audioRef.current.currentTime = newProgress * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '200px', height: '200px', borderRadius: '16px', background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', marginBottom: '32px' }}></div>
        <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Axiora OS Beats</div>
        <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>System Soundtrack</div>
        
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
          <div onClick={handleSeek} style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary)', pointerEvents: 'none' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <SkipBack size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} />
          <div onClick={() => setIsPlaying(!isPlaying)} style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'white', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </div>
          <SkipForward size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => { setIsPlaying(false); setProgress(0); if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }} />
        </div>
      </div>
    </div>
  );
};
