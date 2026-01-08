import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { LineaButton } from '@/components/ui/linea-button';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const Premium = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    if (user) {
      setUser({ ...user, subscriptionStatus: 'premium' });
    }
    toast.success('Bienvenue en Premium ! 🎉');
    navigate('/timeline');
  };

  const features = [
    'Frise chronologique illimitée',
    'Photos et vidéos en haute qualité',
    'Export PDF de votre histoire',
    'Stockage étendu (5 Go)',
    'Partage sécurisé avec vos proches',
    'Support prioritaire',
  ];

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <LineaButton
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </LineaButton>
          <h1 className="font-display text-xl font-semibold text-foreground">
            Premium
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero */}
          <div className="text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary shadow-card flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </motion.div>
            <h2 className="font-display text-3xl font-medium text-foreground mb-3">
              Conservez et transmettez votre histoire.
            </h2>
            <p className="text-muted-foreground">
              Passez à Premium pour débloquer toutes les fonctionnalités.
            </p>
          </div>

          {/* Features */}
          <div className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="font-display text-lg font-medium text-foreground mb-4">
              Avantages Premium
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Pricing cards */}
          <div className="grid gap-4">
            {/* Monthly */}
            <motion.button
              className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary/40 transition-all text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSubscribe('monthly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Mensuel</p>
                  <p className="text-sm text-muted-foreground">Facturation mensuelle</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold text-foreground">4,99 €</p>
                  <p className="text-sm text-muted-foreground">/mois</p>
                </div>
              </div>
            </motion.button>

            {/* Yearly - Best value */}
            <motion.button
              className="w-full p-6 rounded-2xl border-2 border-primary bg-primary/5 relative text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSubscribe('yearly')}
            >
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Économisez 33%
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Annuel</p>
                  <p className="text-sm text-muted-foreground">Facturation annuelle</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold text-foreground">39,99 €</p>
                  <p className="text-sm text-muted-foreground">/an</p>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Later link */}
          <div className="text-center">
            <LineaButton
              variant="ghost"
              onClick={() => navigate('/timeline')}
            >
              Plus tard
            </LineaButton>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Premium;
