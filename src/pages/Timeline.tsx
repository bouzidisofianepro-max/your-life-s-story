import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Pencil, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LineaButton } from '@/components/ui/linea-button';
import TimelineView from '@/components/timeline/TimelineView';
import EmptyTimeline from '@/components/timeline/EmptyTimeline';
import { TimelineEvent } from '@/types/linea';
import { Input } from '@/components/ui/input';

const Timeline = () => {
  const navigate = useNavigate();
  const { events, timelineName, setTimelineName } = useApp();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(timelineName);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const handleAddEvent = () => {
    navigate('/add-event');
  };

  const handleEventClick = (event: TimelineEvent) => {
    navigate(`/event/${event.id}`);
  };

  // Show success message if just added first event
  const justAddedFirst = events.length === 1 && !showSuccessMessage;

  // Scroll to today (bottom) on initial load
  useEffect(() => {
    if (events.length > 0 && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }, 100);
    }
  }, []);

  // Hide scroll hint after first scroll or after delay
  useEffect(() => {
    const hideHint = () => {
      setShowScrollHint(false);
    };
    
    const timer = setTimeout(hideHint, 5000);
    window.addEventListener('scroll', hideHint, { once: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', hideHint);
    };
  }, []);

  // Show/hide return to today button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (todayRef.current) {
        const rect = todayRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowReturnButton(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleStartEditing = () => {
    setTempName(timelineName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    const trimmedName = tempName.trim();
    if (trimmedName) {
      setTimelineName(trimmedName);
    } else {
      setTempName(timelineName);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setTempName(timelineName);
      setIsEditingName(false);
    }
  };

  return (
    <div className="min-h-screen gradient-warm" ref={mainRef}>
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {isEditingName ? (
              <Input
                ref={inputRef}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveName}
                className="font-display text-xl font-semibold h-10 w-48"
                placeholder="Nom de la frise"
              />
            ) : (
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-2 group"
              >
                <h1 className="font-display text-xl font-semibold text-foreground">
                  {timelineName}
                </h1>
                <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LineaButton
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </LineaButton>
          </div>
        </div>
      </motion.header>

      {/* Scroll hint - first time only */}
      <AnimatePresence>
        {showScrollHint && events.length > 0 && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-4 py-2 rounded-full bg-foreground/80 backdrop-blur-sm text-background text-sm font-medium shadow-elevated">
              ↑ Remontez pour explorer le passé
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {events.length === 0 ? (
            <EmptyTimeline onAddEvent={handleAddEvent} />
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Success message for first event */}
              {justAddedFirst && (
                <motion.div
                  className="mb-6 p-4 rounded-2xl bg-linea-lavender-soft border border-primary/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-sm text-accent-foreground text-center">
                    ✨ Votre premier souvenir est en place.
                  </p>
                </motion.div>
              )}

              <TimelineView events={events} onEventClick={handleEventClick} />

              {/* Today marker / Future space */}
              <div ref={todayRef} className="pt-8 pb-32">
                <div className="flex flex-col items-center gap-4">
                  {/* Future space visual */}
                  <div className="w-[2px] h-16 bg-gradient-to-b from-primary/20 to-transparent" />
                  
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      L'histoire continue...
                    </p>
                    <LineaButton
                      variant="soft"
                      size="lg"
                      onClick={handleAddEvent}
                      className="gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter un événement
                    </LineaButton>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Return to today button */}
      <AnimatePresence>
        {showReturnButton && events.length > 0 && (
          <motion.button
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground/90 backdrop-blur-sm text-background text-sm font-medium shadow-elevated hover:bg-foreground transition-colors"
            onClick={scrollToToday}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronDown className="w-4 h-4" />
            Retour au présent
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating add button */}
      {events.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <LineaButton
            variant="hero"
            size="icon"
            onClick={handleAddEvent}
            className="w-14 h-14 shadow-elevated"
          >
            <Plus className="w-6 h-6" />
          </LineaButton>
        </motion.div>
      )}
    </div>
  );
};

export default Timeline;