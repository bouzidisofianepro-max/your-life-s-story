export type EventCategory = 'famille' | 'travail' | 'voyage' | 'personnel' | 'autre';

export interface TimelineEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  category: EventCategory;
  description?: string;
  createdAt: Date;
  media?: Media[];
}

export interface Media {
  id: string;
  eventId: string;
  type: 'photo' | 'video' | 'audio';
  fileUrl: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  subscriptionStatus: 'free' | 'premium';
}

export const categoryLabels: Record<EventCategory, string> = {
  famille: 'Famille',
  travail: 'Travail',
  voyage: 'Voyage',
  personnel: 'Personnel',
  autre: 'Autre',
};

export const categoryColors: Record<EventCategory, string> = {
  famille: 'bg-linea-rose',
  travail: 'bg-linea-sky',
  voyage: 'bg-linea-sage',
  personnel: 'bg-linea-lavender',
  autre: 'bg-linea-amber',
};
