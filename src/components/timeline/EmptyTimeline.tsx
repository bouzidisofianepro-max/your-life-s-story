import { motion } from 'framer-motion';
import { LineaButton } from '@/components/ui/linea-button';
import { Plus } from 'lucide-react';

interface EmptyTimelineProps {
  onAddEvent: () => void;
}

const EmptyTimeline = ({ onAddEvent }: EmptyTimelineProps) => {
  // Generate years for background
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Background years */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-8 top-0 bottom-0 flex flex-col justify-around">
          {years.map((year, index) => (
            <motion.span
              key={year}
              className="font-display text-6xl md:text-8xl font-bold text-primary/[0.03] select-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {year}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Timeline line */}
      <motion.div
        className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Empty state illustration */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-linea-lavender-soft flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <svg
            className="w-12 h-12 text-primary"
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
        </motion.div>

        <h2 className="font-display text-3xl font-medium text-foreground mb-3">
          Votre histoire commence ici.
        </h2>
        <p className="text-muted-foreground mb-8">
          Ajoutez votre premier souvenir et commencez à construire la frise de votre vie.
        </p>

        <LineaButton
          variant="hero"
          size="lg"
          onClick={onAddEvent}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un événement
        </LineaButton>
      </motion.div>
    </div>
  );
};

export default EmptyTimeline;
