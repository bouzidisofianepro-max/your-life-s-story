import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimelineEvent, User } from '@/types/linea';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  events: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (event: TimelineEvent) => void;
  deleteEvent: (id: string) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  timelineName: string;
  setTimelineName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [timelineName, setTimelineName] = useState('La famille');

  const addEvent = (event: TimelineEvent) => {
    setEvents((prev) => [...prev, event].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    ));
  };

  const updateEvent = (event: TimelineEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? event : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        isOnboarded,
        setIsOnboarded,
        timelineName,
        setTimelineName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
