import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, X, Loader2 } from 'lucide-react';
import { LineaButton } from '@/components/ui/linea-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { EventCategory, categoryLabels, Media } from '@/types/linea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AddEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useApp();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPeriod, setIsPeriod] = useState(false);
  const [category, setCategory] = useState<EventCategory>('personnel');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'details' | 'media'>('details');
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'photo' | 'video' | 'audio' }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories: EventCategory[] = ['famille', 'travail', 'voyage', 'personnel', 'autre'];

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error } = await supabase.storage
      .from('event-media')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors du téléversement');
      return null;
    }

    const { data } = supabase.storage
      .from('event-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) {
        const type = file.type.startsWith('video/') ? 'video' : 
                     file.type.startsWith('audio/') ? 'audio' : 'photo';
        setUploadedMedia(prev => [...prev, { url, type }]);
        toast.success('Photo ajoutée !');
      }
    }
    
    setIsUploading(false);
    e.target.value = '';
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (skipMedia: boolean = false) => {
    if (!title || !startDate) return;

    const eventId = crypto.randomUUID();
    const media: Media[] = uploadedMedia.map((m, index) => ({
      id: `${eventId}-media-${index}`,
      eventId,
      type: m.type,
      fileUrl: m.url,
      createdAt: new Date(),
    }));

    const newEvent = {
      id: eventId,
      title,
      startDate: new Date(startDate),
      endDate: isPeriod && endDate ? new Date(endDate) : undefined,
      category,
      description: description || undefined,
      createdAt: new Date(),
      media: skipMedia ? [] : media,
    };

    addEvent(newEvent);
    navigate('/timeline');
  };

  const handleNext = () => {
    if (!title || !startDate) return;
    setStep('media');
  };

  if (step === 'media') {
    return (
      <div className="min-h-screen gradient-warm">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <LineaButton
              variant="ghost"
              size="icon"
              onClick={() => setStep('details')}
            >
              <ArrowLeft className="w-5 h-5" />
            </LineaButton>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Ajouter des souvenirs
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-muted-foreground text-center mb-8">
              Ajoutez seulement ce qui compte pour vous.
            </p>

            {/* Uploaded photos preview */}
            {uploadedMedia.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {uploadedMedia.map((media, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img
                      src={media.url}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Media options */}
            <div className="grid gap-4">
              <motion.button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/30 transition-all flex flex-col items-center gap-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-foreground">Prendre une photo</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/30 transition-all flex flex-col items-center gap-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7 text-primary" />
                  )}
                </div>
                <span className="font-medium text-foreground">
                  {isUploading ? 'Téléversement...' : 'Téléverser une photo'}
                </span>
              </motion.button>

              <motion.button
                className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/30 transition-all flex flex-col items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Ajouter une vidéo</span>
                <span className="text-xs text-muted-foreground">Max 60 secondes</span>
              </motion.button>

              <motion.button
                className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/30 transition-all flex flex-col items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Ajouter un audio</span>
                <span className="text-xs text-muted-foreground">Message vocal, musique...</span>
              </motion.button>
            </div>

            {/* Action buttons */}
            <div className="pt-6 space-y-3">
              <LineaButton
                variant="hero"
                size="lg"
                onClick={() => handleSubmit(false)}
                className="w-full"
                disabled={isUploading}
              >
                {uploadedMedia.length > 0 
                  ? `Ajouter avec ${uploadedMedia.length} photo${uploadedMedia.length > 1 ? 's' : ''}`
                  : 'Ajouter à ma frise'
                }
              </LineaButton>
              
              <LineaButton
                variant="ghost"
                size="lg"
                onClick={() => handleSubmit(true)}
                className="w-full"
                disabled={isUploading}
              >
                Continuer sans média
              </LineaButton>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <LineaButton
            variant="ghost"
            size="icon"
            onClick={() => navigate('/timeline')}
          >
            <ArrowLeft className="w-5 h-5" />
          </LineaButton>
          <h1 className="font-display text-xl font-semibold text-foreground">
            Ajouter un événement
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.form
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Titre *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Ex : Mon premier appartement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
            />
          </div>

          {/* Date type toggle */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Date</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPeriod(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  !isPeriod
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Date unique
              </button>
              <button
                type="button"
                onClick={() => setIsPeriod(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isPeriod
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Période
              </button>
            </div>
          </div>

          {/* Date inputs */}
          <div className={`grid gap-4 ${isPeriod ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground font-medium">
                {isPeriod ? 'Début' : 'Date'} *
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {isPeriod && (
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-foreground font-medium">
                  Fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Catégorie</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              placeholder="Quelques mots sur ce moment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <LineaButton
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!title || !startDate}
            >
              Suivant
            </LineaButton>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default AddEvent;