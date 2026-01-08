import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Pencil, Check } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddEvent = () => {
    navigate('/add-event');
  };

  const handleEventClick = (event: TimelineEvent) => {
    navigate(`/event/${event.id}`);
  };

  // Show success message if just added first event
  const justAddedFirst = events.length === 1 && !showSuccessMessage;

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
    <div className="min-h-screen gradient-warm">
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

              {/* Add more events prompt */}
              <motion.div
                className="mt-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <LineaButton
                  variant="soft"
                  size="lg"
                  onClick={handleAddEvent}
                  className="gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un autre événement
                </LineaButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating add button (when there are events) */}
      {events.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6"
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
