import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence, PanInfo } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Briefcase, Plane, Star, Circle, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { TimelineEvent, categoryColors, categoryLabels, EventCategory } from '@/types/linea';

interface TimelineViewProps {
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

const CategoryIcon = ({ category, className }: { category: EventCategory; className?: string }) => {
  const icons = {
    famille: Heart,
    travail: Briefcase,
    voyage: Plane,
    personnel: Star,
    autre: Circle,
  };
  const Icon = icons[category];
  return <Icon className={className} />;
};

// Individual event card with scroll-triggered animation and swipe
const EventCard = ({ 
  event, 
  onClick, 
  index,
  onSwipeLeft,
  onSwipeRight,
  hasPrevious,
  hasNext
}: { 
  event: TimelineEvent; 
  onClick: () => void; 
  index: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = categoryColors[event.category];
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = 500;
    
    if (info.offset.x > threshold || info.velocity.x > velocity) {
      // Swipe right - go to previous
      if (hasPrevious && onSwipeRight) {
        onSwipeRight();
      }
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      // Swipe left - go to next
      if (hasNext && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    setDragDirection(null);
  }, [hasPrevious, hasNext, onSwipeLeft, onSwipeRight]);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 30) {
      setDragDirection('right');
    } else if (info.offset.x < -30) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="w-full text-left group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {/* Swipe indicators */}
      <AnimatePresence>
        {dragDirection === 'right' && hasPrevious && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-primary" />
            </div>
          </motion.div>
        )}
        {dragDirection === 'left' && hasNext && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        className="w-full text-left cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.995 }}
      >
        <div className="relative">
          {/* Connection line & dot */}
          <div className="absolute -left-[29px] top-6 w-6 h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
          <motion.div 
            className={`absolute -left-[35px] top-[18px] w-4 h-4 rounded-full ${colors.dot} shadow-md ring-4 ring-background`}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          />
          
          {/* Event card */}
          <div className={`relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm p-5 shadow-soft border ${colors.border} group-hover:shadow-card group-hover:border-primary/30 transition-all duration-300`}>
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 opacity-30 ${colors.bg}`} />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
            
            <div className="relative">
              {/* Header with category */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">
                      {format(new Date(event.startDate), 'd MMM yyyy', { locale: fr })}
                      {event.endDate && (
                        <span className="text-muted-foreground/60">
                          {' '}→ {format(new Date(event.endDate), 'd MMM yyyy', { locale: fr })}
                        </span>
                      )}
                    </p>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                </div>

                {/* Category badge */}
                <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                  <CategoryIcon category={event.category} className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {categoryLabels[event.category]}
                  </span>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {event.description}
                </p>
              )}

              {/* Media preview */}
              {event.media && event.media.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {event.media.slice(0, 4).map((media, i) => (
                    <motion.div
                      key={media.id}
                      className="w-14 h-14 rounded-xl bg-muted overflow-hidden ring-2 ring-background shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {media.type === 'photo' && (
                        <img
                          src={media.fileUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      {media.type === 'video' && (
                        <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                          <Plane className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {event.media.length > 4 && (
                    <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center ring-2 ring-background">
                      <span className="text-xs font-semibold text-muted-foreground">
                        +{event.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Swipe hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-50 transition-opacity">
                <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">swipe</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

// Year marker with scroll-triggered animation
const YearMarker = ({ year, index }: { year: number; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <motion.div 
        className="relative z-10"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-soft">
          <span className="font-display text-lg font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
            {year}
          </span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-lg -z-10" />
      </motion.div>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
    </motion.div>
  );
};

const TimelineView = ({ events, onEventClick }: TimelineViewProps) => {
  // Flatten all events for swipe navigation
  const allEvents = [...events].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.startDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  // Sort events within each year chronologically
  Object.keys(eventsByYear).forEach(year => {
    eventsByYear[Number(year)].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  });

  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => a - b);

  const handleSwipeToEvent = useCallback((eventId: string) => {
    // Find the element and scroll to it
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const getAdjacentEvents = useCallback((currentEvent: TimelineEvent) => {
    const currentIndex = allEvents.findIndex(e => e.id === currentEvent.id);
    return {
      previous: currentIndex > 0 ? allEvents[currentIndex - 1] : null,
      next: currentIndex < allEvents.length - 1 ? allEvents[currentIndex + 1] : null
    };
  }, [allEvents]);

  return (
    <div className="relative">
      {/* Timeline line with gradient - continuous */}
      <div className="absolute left-[23px] top-8 bottom-0 w-[2px]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent blur-sm" />
      </div>

      <div className="space-y-10">
        {years.map((year, yearIndex) => (
          <div key={year}>
            <YearMarker year={year} index={yearIndex} />

            {/* Events for this year */}
            <div className="ml-[52px] space-y-4">
              {eventsByYear[year].map((event, eventIndex) => {
                const { previous, next } = getAdjacentEvents(event);
                return (
                  <div key={event.id} id={`event-${event.id}`}>
                    <EventCard
                      event={event}
                      onClick={() => onEventClick(event)}
                      index={eventIndex}
                      hasPrevious={!!previous}
                      hasNext={!!next}
                      onSwipeRight={previous ? () => handleSwipeToEvent(previous.id) : undefined}
                      onSwipeLeft={next ? () => handleSwipeToEvent(next.id) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;