import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Shield, Trash2, LogOut } from 'lucide-react';
import { LineaButton } from '@/components/ui/linea-button';
import { useApp } from '@/context/AppContext';
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

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser, events } = useApp();

  const storageUsed = events.reduce((acc, event) => {
    const mediaSize = event.media?.length || 0;
    return acc + mediaSize * 2; // Simulated: 2MB per media
  }, 0);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  const handleDeleteAccount = () => {
    setUser(null);
    navigate('/');
    toast.success('Compte supprimé');
  };

  const handleExport = () => {
    toast.success('Export PDF en préparation...');
  };

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
            Réglages
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
          {/* Account section */}
          <section className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h2 className="font-display text-lg font-medium text-foreground mb-4">
              Compte
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{user?.email || 'Non connecté'}</p>
                  <p className="text-sm text-muted-foreground">
                    Plan {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Gratuit'}
                  </p>
                </div>
                {user?.subscriptionStatus !== 'premium' && (
                  <LineaButton variant="soft" size="sm" onClick={() => navigate('/premium')}>
                    Passer Premium
                  </LineaButton>
                )}
              </div>
            </div>
          </section>

          {/* Storage section */}
          <section className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h2 className="font-display text-lg font-medium text-foreground mb-4">
              Stockage
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Utilisé</span>
                <span className="font-medium text-foreground">{storageUsed} Mo</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((storageUsed / 500) * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {500 - storageUsed} Mo restants sur 500 Mo
              </p>
            </div>
          </section>

          {/* Export section */}
          <section className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h2 className="font-display text-lg font-medium text-foreground mb-4">
              Export
            </h2>
            <LineaButton
              variant="soft"
              size="lg"
              className="w-full gap-2"
              onClick={handleExport}
            >
              <Download className="w-5 h-5" />
              Exporter en PDF
            </LineaButton>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Téléchargez votre frise complète au format PDF
            </p>
          </section>

          {/* Security section */}
          <section className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h2 className="font-display text-lg font-medium text-foreground mb-4">
              Sécurité & confidentialité
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-linea-lavender-soft flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Vos données sont privées</p>
                  <p className="text-sm text-muted-foreground">
                    Tout est chiffré et stocké de manière sécurisée. Seul vous pouvez accéder à votre frise.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Danger zone */}
          <section className="space-y-3">
            <LineaButton
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </LineaButton>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <LineaButton
                  variant="ghost"
                  size="lg"
                  className="w-full text-destructive hover:text-destructive gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer mon compte
                </LineaButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Supprimer votre compte ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes vos données, souvenirs et médias seront définitivement supprimés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
