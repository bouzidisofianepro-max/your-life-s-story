import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LineaButton } from '@/components/ui/linea-button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Timelines = () => {
  const navigate = useNavigate();
  const { timelines, addTimeline, deleteTimeline, setCurrentTimelineId } = useApp();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTimelineName, setNewTimelineName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timelineToDelete, setTimelineToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingNew]);

  const handleSelectTimeline = (timelineId: string) => {
    setCurrentTimelineId(timelineId);
    navigate('/timeline');
  };

  const handleAddTimeline = () => {
    const trimmedName = newTimelineName.trim();
    if (trimmedName) {
      addTimeline(trimmedName);
      setNewTimelineName('');
      setIsAddingNew(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTimeline();
    } else if (e.key === 'Escape') {
      setNewTimelineName('');
      setIsAddingNew(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, timelineId: string) => {
    e.stopPropagation();
    setTimelineToDelete(timelineId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (timelineToDelete) {
      deleteTimeline(timelineToDelete);
      setTimelineToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen gradient-premium texture-noise">
      {/* Premium background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/3 to-transparent" />
        <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-40 left-0 w-80 h-80 rounded-full bg-linea-rose/5 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary shadow-soft flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Mes frises
            </h1>
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
        <div className="space-y-4">
          {/* Timeline list */}
          <AnimatePresence mode="popLayout">
            {timelines.map((timeline, index) => (
              <motion.button
                key={timeline.id}
                onClick={() => handleSelectTimeline(timeline.id)}
                className="w-full text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="relative p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft group hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {timeline.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {timeline.events.length} événement{timeline.events.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {timelines.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteClick(e, timeline.id)}
                          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Add new timeline */}
          <AnimatePresence mode="wait">
            {isAddingNew ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/30 shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Input
                      ref={inputRef}
                      value={newTimelineName}
                      onChange={(e) => setNewTimelineName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={() => {
                        if (!newTimelineName.trim()) {
                          setIsAddingNew(false);
                        }
                      }}
                      placeholder="Nom de la frise..."
                      className="font-display text-lg"
                    />
                  </div>
                  <LineaButton
                    variant="default"
                    size="sm"
                    onClick={handleAddTimeline}
                    disabled={!newTimelineName.trim()}
                  >
                    Créer
                  </LineaButton>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="p-5 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Ajouter une frise</span>
                  </div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette frise ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les événements de cette frise seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Timelines;
