/**
 * PWA Install Prompt
 * Encourage users to install the app
 */

import React, { useEffect, useState } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { getPWAService, PWAInstallState } from '../../lib/services/pwa';

export function InstallPrompt() {
  const [state, setState] = useState<PWAInstallState | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const service = getPWAService();

    // Subscribe to PWA state changes
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('pwa_install_dismissed') === 'true';
    setDismissed(wasDismissed);

    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    if (!state) return;

    const result = await getPWAService().promptInstall();

    if (result === 'accepted') {
      setDismissed(true);
    } else if (result === 'dismissed') {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  // Don't show if:
  // - State not loaded
  // - User dismissed
  // - Already installed
  // - Already in standalone mode
  // - Can't install
  if (
    !state ||
    dismissed ||
    state.isInstalled ||
    state.isStandalone ||
    !state.canInstall
  ) {
    return null;
  }

  // Show different UI for iOS (which doesn't support beforeinstallprompt)
  if (state.platform === 'ios') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-4 shadow-2xl">
            <div className="flex gap-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Install Local Scout</h3>
                <p className="text-sm text-white/90 mb-3">
                  Get the full app experience
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-white/70">1.</span>
                    <p className="text-white/90">
                      Tap <Share className="w-4 h-4 inline mx-1" /> in Safari
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white/70">2.</span>
                    <p className="text-white/90">
                      Tap "Add to Home Screen"
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white/70">3.</span>
                    <p className="text-white/90">Tap "Add"</p>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-8 w-8 self-start"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Standard install prompt for Android/Desktop
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-4 shadow-2xl">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Download className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1">Install Local Scout</h3>
              <p className="text-sm text-white/90 mb-3">
                Access your trips offline and get a faster experience
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-white text-violet-600 hover:bg-white/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20"
                >
                  Not Now
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 h-8 w-8 self-start"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Install Button (for settings/menu)
 */
export function InstallButton() {
  const [state, setState] = useState<PWAInstallState | null>(null);

  useEffect(() => {
    const unsubscribe = getPWAService().subscribe(setState);
    return unsubscribe;
  }, []);

  if (!state || !state.canInstall || state.isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    await getPWAService().promptInstall();
  };

  return (
    <Button onClick={handleInstall} variant="outline" size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Install App
    </Button>
  );
}

export default InstallPrompt;
