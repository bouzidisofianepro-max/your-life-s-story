import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineaButton } from '@/components/ui/linea-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: crypto.randomUUID(),
      email,
      createdAt: new Date(),
      subscriptionStatus: 'free',
    });
    
    toast.success('Bienvenue sur Linéa !');
    navigate('/timeline');
    setIsLoading(false);
  };

  const handleOAuthSignup = async (provider: 'apple' | 'google') => {
    setIsLoading(true);
    
    // Simulate OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: crypto.randomUUID(),
      email: `user@${provider}.com`,
      createdAt: new Date(),
      subscriptionStatus: 'free',
    });
    
    toast.success('Bienvenue sur Linéa !');
    navigate('/timeline');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-premium texture-noise flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Premium decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-linea-rose/10 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-linea-cream blur-[120px] opacity-60" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary shadow-elevated flex items-center justify-center relative"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          >
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl" />
            <svg
              className="w-10 h-10 text-primary-foreground relative z-10"
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
          <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
            Créer votre compte
          </h1>
          <p className="text-muted-foreground text-lg">
            Commencez à construire votre histoire
          </p>
        </div>

        {/* Premium card container */}
        <div className="glass-strong rounded-3xl p-8 shadow-elevated">
          {/* OAuth buttons */}
          <div className="space-y-3 mb-8">
            <LineaButton
              variant="apple"
              size="lg"
              className="w-full shadow-soft"
              onClick={() => handleOAuthSignup('apple')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuer avec Apple
            </LineaButton>

            <LineaButton
              variant="google"
              size="lg"
              className="w-full shadow-soft"
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </LineaButton>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-muted-foreground backdrop-blur-sm">
                ou avec email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-13 rounded-2xl border-border/40 bg-background/60 backdrop-blur-sm focus:ring-primary focus:border-primary/40 shadow-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-13 rounded-2xl border-border/40 bg-background/60 backdrop-blur-sm focus:ring-primary focus:border-primary/40 shadow-soft"
              />
            </div>

            <LineaButton
              type="submit"
              variant="hero"
              size="lg"
              className="w-full mt-6 shadow-elevated"
              disabled={isLoading}
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </LineaButton>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-8 text-muted-foreground">
          Déjà un compte ?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline font-medium"
          >
            Se connecter
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
