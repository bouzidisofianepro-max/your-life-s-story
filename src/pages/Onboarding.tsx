import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineaButton } from '@/components/ui/linea-button';
import { useApp } from '@/context/AppContext';

const slides = [
  {
    id: 1,
    title: 'Créez une frise chronologique de votre vie',
    description: 'Organisez vos souvenirs dans le temps, de façon simple et visuelle.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Ajoutez des souvenirs importants',
    description: 'Photos, vidéos, mots... Conservez ce qui compte vraiment pour vous.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Tout est privé, sécurisé et transmissible',
    description: 'Vos souvenirs vous appartiennent. Partagez-les uniquement si vous le souhaitez.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { setIsOnboarded } = useApp();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setIsOnboarded(true);
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    setIsOnboarded(true);
    navigate('/signup');
  };

  return (
    <div className="min-h-screen gradient-warm flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-linea-lavender/5 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Skip button */}
      <div className="w-full flex justify-end relative z-10">
        <LineaButton
          variant="ghost"
          size="sm"
          onClick={handleSkip}
        >
          Passer
        </LineaButton>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-linea-lavender-soft flex items-center justify-center text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {slides[currentSlide].icon}
            </motion.div>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground leading-tight mb-4">
              {slides[currentSlide].title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="w-full max-w-md relative z-10">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-primary/20'
              }`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Button */}
        <LineaButton
          variant="hero"
          size="lg"
          onClick={handleNext}
          className="w-full"
        >
          {currentSlide === slides.length - 1 ? 'Créer ma frise' : 'Continuer'}
        </LineaButton>
      </div>
    </div>
  );
};

export default Onboarding;
