/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface AppWindow {
  id: string; // Unique ID for this instance (e.g. 'browser-1')
  appId: string; // The type of app (e.g. 'browser')
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
}

interface WindowManagerContextType {
  windows: AppWindow[];
  activeWindowId: string | null;
  openApp: (appId: string, title?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return context;
};

export const WindowManagerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const openApp = (appId: string, title?: string) => {
    // Prevent multiple instances of single-instance apps if necessary, 
    // but for now we'll allow multiple instances for simplicity
    const id = `${appId}-${Date.now()}`;
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    
    // Capitalize appId for default title
    const defaultTitle = appId.charAt(0).toUpperCase() + appId.slice(1);
    
    setWindows(prev => [
      ...prev,
      {
        id,
        appId,
        title: title || defaultTitle,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZ,
        x: Math.floor(Math.random() * 100) + 100,
        y: Math.floor(Math.random() * 100) + 100
      }
    ]);
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w));
    setActiveWindowId(id);
  };

  return (
    <WindowManagerContext.Provider value={{
      windows, activeWindowId, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
};
