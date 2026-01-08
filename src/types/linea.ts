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

export const categoryColors: Record<EventCategory, { bg: string; text: string; border: string; dot: string }> = {
  famille: { bg: 'bg-linea-rose/20', text: 'text-rose-700', border: 'border-linea-rose/40', dot: 'bg-linea-rose' },
  travail: { bg: 'bg-linea-sky/20', text: 'text-sky-700', border: 'border-linea-sky/40', dot: 'bg-linea-sky' },
  voyage: { bg: 'bg-linea-sage/20', text: 'text-emerald-700', border: 'border-linea-sage/40', dot: 'bg-linea-sage' },
  personnel: { bg: 'bg-linea-lavender/20', text: 'text-violet-700', border: 'border-linea-lavender/40', dot: 'bg-linea-lavender' },
  autre: { bg: 'bg-linea-amber/20', text: 'text-amber-700', border: 'border-linea-amber/40', dot: 'bg-linea-amber' },
};

export const categoryIcons: Record<EventCategory, string> = {
  famille: 'Heart',
  travail: 'Briefcase',
  voyage: 'Plane',
  personnel: 'Star',
  autre: 'Circle',
};
