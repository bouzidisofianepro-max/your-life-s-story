import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimelineEvent, categoryColors, categoryLabels } from '@/types/linea';

interface TimelineViewProps {
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

const TimelineView = ({ events, onEventClick }: TimelineViewProps) => {
  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.startDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => a - b);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />

      <div className="space-y-8">
        {years.map((year, yearIndex) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: yearIndex * 0.1 }}
          >
            {/* Year label */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10">
                <span className="font-display text-lg font-semibold text-primary">
                  {year}
                </span>
              </div>
            </div>

            {/* Events for this year */}
            <div className="ml-16 space-y-4">
              {eventsByYear[year].map((event, eventIndex) => (
                <motion.button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="w-full text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: yearIndex * 0.1 + eventIndex * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative group">
                    {/* Connection dot */}
                    <div className="absolute -left-[3.25rem] top-4 w-3 h-3 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    
                    {/* Event card */}
                    <div className="gradient-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-medium text-foreground mb-1 truncate">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format(new Date(event.startDate), 'd MMMM yyyy', { locale: fr })}
                            {event.endDate && (
                              <> — {format(new Date(event.endDate), 'd MMMM yyyy', { locale: fr })}</>
                            )}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Category badge */}
                        <span
                          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${categoryColors[event.category]}`}
                        >
                          {categoryLabels[event.category]}
                        </span>
                      </div>

                      {/* Media preview */}
                      {event.media && event.media.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {event.media.slice(0, 3).map((media) => (
                            <div
                              key={media.id}
                              className="w-16 h-16 rounded-xl bg-muted overflow-hidden"
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
                                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                          {event.media.length > 3 && (
                            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                +{event.media.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
