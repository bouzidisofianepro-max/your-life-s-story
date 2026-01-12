import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineaButton } from '@/components/ui/linea-button';
const Splash = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen gradient-premium texture-noise flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Premium decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" animate={{
        y: [0, -30, 0],
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-linea-rose/10 blur-[120px]" animate={{
        y: [0, 30, 0],
        scale: [1.1, 1, 1.1]
      }} transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-linea-ivory blur-[150px] opacity-50" />
      </div>

      {/* Content */}
      <motion.div className="relative z-10 flex flex-col items-center text-center max-w-md" initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8,
      ease: "easeOut"
    }}>
        {/* Logo / Brand */}
        <motion.div className="mb-10" initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl gradient-primary shadow-elevated flex items-center justify-center mb-5 mx-auto relative">
              <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl" />
              <svg className="w-12 h-12 text-primary-foreground relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Linea</h1>
        </motion.div>

        {/* Main headline */}
        <motion.h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          Votre vie, organisée comme une histoire.
        </motion.h2>

        {/* Subtitle */}
        <motion.p className="text-muted-foreground text-lg mb-12 max-w-sm" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }}>
          Créez la frise chronologique de vos souvenirs les plus précieux.
        </motion.p>

        {/* CTA */}
        <motion.div className="flex flex-col gap-4 w-full" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }}>
          <LineaButton variant="hero" size="lg" onClick={() => navigate('/onboarding')} className="w-full shadow-elevated">
            Commencer
          </LineaButton>
          
          <LineaButton variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-muted-foreground hover:text-foreground">
            J'ai déjà un compte
          </LineaButton>
        </motion.div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p className="absolute bottom-8 text-sm text-muted-foreground/70 text-center font-medium" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 1.2
    }}>
        Votre vie mérite mieux qu'un dossier photo.
      </motion.p>
    </div>;
};
export default Splash;