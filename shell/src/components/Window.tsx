import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowManager } from './WindowManagerProvider';
import type { AppWindow } from './WindowManagerProvider';
import './Window.css';

interface WindowProps {
  appWindow: AppWindow;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const Window: React.FC<WindowProps> = ({ 
  appWindow, 
  children,
  defaultWidth = 800,
  defaultHeight = 600
}) => {
  const { activeWindowId, focusWindow, closeWindow, minimizeWindow, maximizeWindow } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  
  if (appWindow.isMinimized) return null;

  const isActive = activeWindowId === appWindow.id;

  return (
    <Rnd
      default={{
        x: appWindow.x,
        y: appWindow.y,
        width: defaultWidth,
        height: defaultHeight,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      onDragStart={() => {
        setIsDragging(true);
        if (!isActive) focusWindow(appWindow.id);
      }}
      onDragStop={() => {
        setIsDragging(false);
      }}
      onResizeStart={() => {
        setIsDragging(true);
        if (!isActive) focusWindow(appWindow.id);
      }}
      onResizeStop={() => {
        setIsDragging(false);
      }}
      style={{ zIndex: appWindow.zIndex }}
      disableDragging={appWindow.isMaximized}
      enableResizing={!appWindow.isMaximized}
      className={`app-window ${isActive ? 'active' : ''} ${appWindow.isMaximized ? 'maximized' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div 
        className="window-content-wrapper" 
        data-window-id={appWindow.id}
        onMouseDownCapture={() => {
          if (!isActive) focusWindow(appWindow.id);
        }}
      >
        <div className="window-titlebar" onDoubleClick={() => maximizeWindow(appWindow.id)}>
          <div className="window-controls">
            <button className="control-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(appWindow.id); }} />
            <button className="control-btn minimize" onClick={(e) => { e.stopPropagation(); minimizeWindow(appWindow.id); }} />
            <button className="control-btn maximize" onClick={(e) => { e.stopPropagation(); maximizeWindow(appWindow.id); }} />
          </div>
          <div className="window-title">{appWindow.title}</div>
        </div>
        
        <div className="window-body">
          {children}
        </div>
      </div>
    </Rnd>
  );
};
