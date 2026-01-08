import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LineaButton } from '@/components/ui/linea-button';
import { categoryLabels, categoryColors } from '@/types/linea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, deleteEvent } = useApp();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">
            Événement introuvable
          </h2>
          <LineaButton onClick={() => navigate('/timeline')}>
            Retour à la frise
          </LineaButton>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success('Événement supprimé');
    navigate('/timeline');
  };

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LineaButton
              variant="ghost"
              size="icon"
              onClick={() => navigate('/timeline')}
            >
              <ArrowLeft className="w-5 h-5" />
            </LineaButton>
            <h1 className="font-display text-xl font-semibold text-foreground truncate">
              {event.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LineaButton variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </LineaButton>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <LineaButton variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-5 h-5" />
                </LineaButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Supprimer cet événement ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cet événement et tous ses souvenirs associés seront définitivement supprimés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Category & Date */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-primary-foreground ${categoryColors[event.category]}`}
            >
              {categoryLabels[event.category]}
            </span>
            <span className="text-muted-foreground">
              {format(new Date(event.startDate), 'd MMMM yyyy', { locale: fr })}
              {event.endDate && (
                <> — {format(new Date(event.endDate), 'd MMMM yyyy', { locale: fr })}</>
              )}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-4xl font-medium text-foreground">
            {event.title}
          </h2>

          {/* Description */}
          {event.description && (
            <div className="py-4 border-y border-border/50">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Media section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-medium text-foreground">
                Souvenirs
              </h3>
              <LineaButton variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </LineaButton>
            </div>

            {event.media && event.media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {event.media.map((media) => (
                  <motion.div
                    key={media.id}
                    className="aspect-square rounded-xl overflow-hidden bg-muted"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                        <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border-2 border-dashed border-border text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-4">
                  Aucun souvenir ajouté à cet événement
                </p>
                <LineaButton variant="soft" size="sm">
                  Ajouter un souvenir
                </LineaButton>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EventDetail;
