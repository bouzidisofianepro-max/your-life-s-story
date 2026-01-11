import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash2, Plus, Calendar, MapPin, Heart, Briefcase, Plane, Star, Circle, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LineaButton } from '@/components/ui/linea-button';
import { categoryLabels, categoryColors, Media, EventCategory } from '@/types/linea';
import { AddSouvenirDialog } from '@/components/AddSouvenirDialog';
import { MediaViewer } from '@/components/MediaViewer';
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

const categoryIconMap: Record<EventCategory, React.ReactNode> = {
  famille: <Heart className="w-4 h-4" />,
  travail: <Briefcase className="w-4 h-4" />,
  voyage: <Plane className="w-4 h-4" />,
  personnel: <Star className="w-4 h-4" />,
  autre: <Circle className="w-4 h-4" />,
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, deleteEvent, addMediaToEvent } = useApp();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const event = events.find((e) => e.id === id);

  const openMediaViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  if (!event) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linea-lavender-soft flex items-center justify-center">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Événement introuvable
          </h2>
          <p className="text-muted-foreground mb-6">Ce souvenir semble avoir disparu</p>
          <LineaButton onClick={() => navigate('/timeline')}>
            Retour à la frise
          </LineaButton>
        </motion.div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success('Événement supprimé');
    navigate('/timeline');
  };

  const handleAddMedia = (media: Media) => {
    addMediaToEvent(event.id, media);
  };

  const hasMedia = event.media && event.media.length > 0;
  const heroImage = hasMedia ? event.media.find(m => m.type === 'photo')?.fileUrl : null;
  const colors = categoryColors[event.category];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image or Gradient Background */}
        <div className="h-72 sm:h-80 relative overflow-hidden">
          {heroImage ? (
            <>
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                src={heroImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </>
          ) : (
            <div className={`w-full h-full ${colors.bg}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/30 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
              </div>
            </div>
          )}
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/timeline')}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center shadow-soft hover:shadow-card transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <button className="w-10 h-10 rounded-full glass-strong flex items-center justify-center shadow-soft hover:shadow-card transition-shadow">
                <Edit className="w-4 h-4 text-foreground" />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-10 h-10 rounded-full glass-strong flex items-center justify-center shadow-soft hover:shadow-card transition-shadow">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-border/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-xl">Supprimer ce souvenir ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Cette action est irréversible. Cet événement et tous ses souvenirs associés seront définitivement supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
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
            </motion.div>
          </div>
        </header>

        {/* Category Badge - Floating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-6 left-4 right-4 max-w-2xl mx-auto"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} backdrop-blur-sm shadow-soft`}>
            {categoryIconMap[event.category]}
            {categoryLabels[event.category]}
          </span>
        </motion.div>
      </div>

      {/* Content Card */}
      <main className="relative z-10 -mt-6">
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden"
          >
            {/* Title Section */}
            <div className="p-6 pb-4">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight mb-3">
                {event.title}
              </h1>
              
              {/* Date */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {format(new Date(event.startDate), 'd MMMM yyyy', { locale: fr })}
                  {event.endDate && (
                    <span className="text-primary"> — {format(new Date(event.endDate), 'd MMMM yyyy', { locale: fr })}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-6 pb-6"
              >
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/30">
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="h-px bg-border/50 mx-6" />

            {/* Souvenirs Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Souvenirs
                </h3>
                <AddSouvenirDialog 
                  eventId={event.id} 
                  onAddMedia={handleAddMedia}
                  trigger={
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  }
                />
              </div>

              <AnimatePresence mode="wait">
                {hasMedia ? (
                  <motion.div
                    key="media-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {event.media!.map((media, index) => (
                      <motion.div
                        key={media.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openMediaViewer(index)}
                      >
                        {media.type === 'photo' ? (
                          <img
                            src={media.fileUrl}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <>
                            <video
                              src={media.fileUrl}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                              <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 text-primary ml-0.5" />
                              </div>
                            </div>
                          </>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linea-lavender-soft flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground mb-5 text-sm">
                      Immortalisez ce moment avec des photos ou vidéos
                    </p>
                    <AddSouvenirDialog
                      eventId={event.id}
                      onAddMedia={handleAddMedia}
                      trigger={
                        <LineaButton variant="soft" size="sm" className="rounded-full px-6">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter un souvenir
                        </LineaButton>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Media Viewer */}
      {hasMedia && (
        <MediaViewer
          media={event.media!}
          initialIndex={viewerIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
