import React, { useState, useEffect } from 'react';
import type { AppWindow } from '../WindowManagerProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarApp: React.FC<{ appWindow: AppWindow }> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('axiora-calendar-events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleEventClick = (dateStr: string) => {
    const currentEvent = events[dateStr] || '';
    const newEvent = prompt(`Add an event for ${dateStr}:`, currentEvent);
    if (newEvent !== null) {
      const updated = { ...events, [dateStr]: newEvent };
      setEvents(updated);
      localStorage.setItem('axiora-calendar-events', JSON.stringify(updated));
    }
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const today = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
    const hasEvent = !!events[dateStr];

    days.push(
      <div 
        key={`day-${i}`} 
        onClick={() => handleEventClick(dateStr)}
        className={`calendar-day ${isToday ? 'today' : ''}`} 
        style={{
          padding: '10px',
          textAlign: 'center',
          borderRadius: '8px',
          background: isToday ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
          color: isToday ? 'white' : 'var(--text-primary)',
          fontWeight: isToday ? 600 : 400,
          cursor: 'pointer',
          border: hasEvent ? '1px solid var(--accent-primary)' : 'none',
          position: 'relative'
        }}
        title={events[dateStr]}
      >
        {i}
        {hasEvent && <div style={{width: 4, height: 4, borderRadius: 2, background: isToday ? 'white' : 'var(--accent-primary)', position: 'absolute', bottom: 4, left: 'calc(50% - 2px)'}} />}
      </div>
    );
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-primary)', color: 'var(--text-primary)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ChevronLeft /></button>
        <div style={{ fontSize: '28px', fontWeight: 600 }}>
          {monthName} {currentDate.getFullYear()}
        </div>
        <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ChevronRight /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1, gridAutoRows: '1fr' }}>
        {days}
      </div>
    </div>
  );
};
