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
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'Notre mariage',
      startDate: new Date('2015-06-20'),
      category: 'famille',
      description: 'Le plus beau jour de notre vie. Cérémonie intime dans le jardin de mes parents, entourés de nos proches.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Voyage de noces en Italie',
      startDate: new Date('2015-07-01'),
      endDate: new Date('2015-07-15'),
      category: 'voyage',
      description: 'Deux semaines magiques entre Rome, Florence et la côte amalfitaine.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Naissance de Léa',
      startDate: new Date('2017-03-12'),
      category: 'famille',
      description: 'Notre petite princesse est arrivée à 6h42 du matin. 3,2 kg de bonheur pur.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '4',
      title: 'Premier appartement',
      startDate: new Date('2017-09-01'),
      category: 'personnel',
      description: 'Enfin chez nous ! Un 3 pièces lumineux avec vue sur le parc.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '5',
      title: 'Vacances en Bretagne',
      startDate: new Date('2018-08-10'),
      endDate: new Date('2018-08-24'),
      category: 'voyage',
      description: 'Deux semaines de plage, crêpes et balades sur les sentiers côtiers avec Léa.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '6',
      title: 'Naissance de Lucas',
      startDate: new Date('2019-11-28'),
      category: 'famille',
      description: 'Notre petit bonhomme complète la famille. Léa est tellement fière d\'être grande sœur.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '7',
      title: 'Achat de la maison',
      startDate: new Date('2020-06-15'),
      category: 'personnel',
      description: 'Notre rêve se réalise : une maison avec jardin pour voir grandir les enfants.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '8',
      title: 'Noël en famille',
      startDate: new Date('2020-12-25'),
      category: 'famille',
      description: 'Premier Noël dans notre nouvelle maison avec les grands-parents.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '9',
      title: 'Road trip en Espagne',
      startDate: new Date('2022-07-15'),
      endDate: new Date('2022-07-30'),
      category: 'voyage',
      description: 'Barcelone, Valence, Séville... Les enfants ont adoré la sangria (sans alcool !).',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '10',
      title: 'Rentrée à l\'école de Léa',
      startDate: new Date('2023-09-04'),
      category: 'famille',
      description: 'Grande étape : Léa entre au CP. Tellement de fierté et un peu de larmes.',
      media: [],
      createdAt: new Date(),
    },
    {
      id: '11',
      title: 'Anniversaire de mariage - 10 ans',
      startDate: new Date('2025-06-20'),
      category: 'famille',
      description: 'Dix ans d\'amour célébrés avec un dîner romantique et une surprise des enfants.',
      media: [],
      createdAt: new Date(),
    },
  ]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [timelineName, setTimelineName] = useState('La famille');

  const addEvent = (event: TimelineEvent) => {
    setEvents((prev) => [...prev, event].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
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
