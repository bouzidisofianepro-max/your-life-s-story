import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineaButton } from '@/components/ui/linea-button';

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-warm flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-linea-lavender/10 blur-3xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-linea-rose/10 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo / Brand */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-full gradient-primary shadow-card flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-10 h-10 text-primary-foreground"
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
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Linéa
          </h1>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          className="font-display text-4xl md:text-5xl font-medium text-foreground leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Votre vie, organisée comme une histoire.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Créez la frise chronologique de vos souvenirs les plus précieux.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col gap-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <LineaButton
            variant="hero"
            size="lg"
            onClick={() => navigate('/onboarding')}
            className="w-full"
          >
            Commencer
          </LineaButton>
          
          <LineaButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="text-muted-foreground"
          >
            J'ai déjà un compte
          </LineaButton>
        </motion.div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        className="absolute bottom-8 text-sm text-muted-foreground/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        Votre vie mérite mieux qu'un dossier photo.
      </motion.p>
    </div>
  );
};

export default Splash;
