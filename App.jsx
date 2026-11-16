import React, { useState, useRef, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import CakeCanvas from './components/CakeCanvas';
import CustomizerPanel from './components/CustomizerPanel';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import {
  DEFAULT_CAKE_CONFIG,
  generateRandomCake,
  encodeConfigToUrl,
  decodeConfigFromUrl,
} from './utils/cakeConfig';

export default function App() {
  const [cakeConfig, setCakeConfig] = useState(
    () => decodeConfigFromUrl() || DEFAULT_CAKE_CONFIG
  );
  const [currency, setCurrency] = useState('INR');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(
    () => window.location.pathname === '/admin'
  );

  const canvasSnapshotRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path === '/admin');
  };

  const handleRandomize = () => {
    setCakeConfig(generateRandomCake());
  };

  const handleShare = async () => {
    const shareUrl = encodeConfigToUrl(cakeConfig);
    window.history.replaceState({}, '', shareUrl);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      prompt('Copy your custom 3D cake link:', shareUrl);
    }
  };

  const handleProceedToCheckout = () => {
    if (canvasSnapshotRef.current) {
      const dataUrl = canvasSnapshotRef.current.capture();
      setSnapshotUrl(dataUrl);
    }
    setIsCheckoutOpen(true);
  };

  if (isAdminRoute) {
    return (
      <AdminDashboard
        onBackToStudio={() => navigateTo('/')}
        onLoadIn3DViewer={(loadedConfig) => {
          setCakeConfig(loadedConfig);
          navigateTo('/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#FAF7F2]">
      <section className="sticky top-0 z-20 h-[45vh] lg:static lg:h-full w-full lg:w-[60%] shrink-0 shadow-sm lg:shadow-none">
        <CakeCanvas
          ref={canvasSnapshotRef}
          config={cakeConfig}
          onRandomize={handleRandomize}
          onShare={handleShare}
          shareCopied={shareCopied}
        />

        <button
          type="button"
          onClick={() => navigateTo('/admin')}
          className="hidden lg:flex items-center gap-1.5 absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-[#FAF7F2]/85 hover:bg-white text-[#2C1E16]/80 text-xs font-medium border border-[#2C1E16]/12 shadow-sm transition"
        >
          <ChefHat className="w-3.5 h-3.5 text-[#C59B43]" />
          <span>Baker Kitchen (/admin)</span>
        </button>
      </section>

      <main className="flex-1 lg:w-[40%] lg:h-full flex flex-col">
        <CustomizerPanel
          config={cakeConfig}
          onChange={setCakeConfig}
          currency={currency}
          setCurrency={setCurrency}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        config={cakeConfig}
        currency={currency}
        snapshotUrl={snapshotUrl}
      />
    </div>
  );
}
