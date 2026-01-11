import { useState, useRef } from 'react';
import { Plus, Image, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LineaButton } from '@/components/ui/linea-button';
import { Media } from '@/types/linea';
import { toast } from 'sonner';

interface AddSouvenirDialogProps {
  eventId: string;
  onAddMedia: (media: Media) => void;
  trigger?: React.ReactNode;
}

export function AddSouvenirDialog({ eventId, onAddMedia, trigger }: AddSouvenirDialogProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'photo' | 'video') => {
    setMediaType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local URL for preview
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleConfirm = () => {
    if (!preview || !mediaType) return;

    const newMedia: Media = {
      id: `media-${Date.now()}`,
      eventId,
      type: mediaType,
      fileUrl: preview,
      createdAt: new Date(),
    };

    onAddMedia(newMedia);
    toast.success('Souvenir ajouté !');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <LineaButton variant="ghost" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </LineaButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Ajouter un souvenir
          </DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 py-4"
            >
              <button
                onClick={() => handleFileSelect('photo')}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-linea-lavender-soft/30 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <Image className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-foreground">Photo</span>
              </button>

              <button
                onClick={() => handleFileSelect('video')}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-linea-lavender-soft/30 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-linea-sage/20 flex items-center justify-center">
                  <Video className="w-7 h-7 text-emerald-600" />
                </div>
                <span className="font-medium text-foreground">Vidéo</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4 py-4"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {mediaType === 'photo' ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <LineaButton
                  variant="ghost"
                  className="flex-1"
                  onClick={clearPreview}
                >
                  Changer
                </LineaButton>
                <LineaButton
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  Confirmer
                </LineaButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
