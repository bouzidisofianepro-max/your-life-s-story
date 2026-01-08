import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { LineaButton } from '@/components/ui/linea-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { EventCategory, categoryLabels } from '@/types/linea';

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

  const categories: EventCategory[] = ['famille', 'travail', 'voyage', 'personnel', 'autre'];

  const handleSubmit = (skipMedia: boolean = false) => {
    if (!title || !startDate) return;

    const newEvent = {
      id: crypto.randomUUID(),
      title,
      startDate: new Date(startDate),
      endDate: isPeriod && endDate ? new Date(endDate) : undefined,
      category,
      description: description || undefined,
      createdAt: new Date(),
      media: [],
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

            {/* Media options */}
            <div className="grid gap-4">
              <motion.button
                className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/30 transition-all flex flex-col items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-linea-lavender-soft flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Ajouter une photo</span>
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
              >
                Ajouter à ma frise
              </LineaButton>
              
              <LineaButton
                variant="ghost"
                size="lg"
                onClick={() => handleSubmit(true)}
                className="w-full"
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
