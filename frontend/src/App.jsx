import React, { useState } from 'react';
import { ClashSplash } from './components/ClashSplash';
import { LandingPage } from './components/LandingPage';
import { ArenaPage } from './components/ArenaPage';
import { WordmarkTestPage } from './components/WordmarkTestPage';
import { LoginPage } from './components/LoginPage';
import { OnboardingPage } from './components/OnboardingPage';
import { DashboardPage } from './components/DashboardPage';
import { BrandIdentityPage } from './components/BrandIdentityPage';
import { CyberCursor } from './components/CyberCursor';
import { InteractiveBackgroundPage } from './components/InteractiveBackgroundPage';
import { RedesignPage } from './components/RedesignPage';

function App() {
  // Splash screen is enabled by default on the root route to show on refresh / startup
  const [showSplash, setShowSplash] = useState(
    window.location.pathname === '/' || 
    window.location.pathname === '' || 
    window.location.pathname === '/index.html'
  );
  const [view, setView] = useState('landing'); // landing | arena
  const [initialOpponent, setInitialOpponent] = useState(null);
  const [isSimulator, setIsSimulator] = useState(false);

  // Check for path-based routing for real connected arena page
  if (window.location.pathname === '/arena') {
    return (
      <>
        <CyberCursor />
        <ArenaPage 
          onReturnToHome={() => {
            window.location.href = '/dashboard';
          }} 
          isSimulator={false} 
        />
      </>
    );
  }

  // Check for path-based routing for different league scroll redesign page
  if (window.location.pathname === '/redesign') {
    return (
      <>
        <CyberCursor />
        <RedesignPage />
      </>
    );
  }

  // Check for path-based routing for wordmark testing staging page
  if (window.location.pathname === '/word') {
    return (
      <>
        <CyberCursor />
        <WordmarkTestPage />
      </>
    );
  }

  // Check for path-based routing for login page
  if (window.location.pathname === '/login') {
    return (
      <>
        <CyberCursor />
        <LoginPage />
      </>
    );
  }

  // Check for path-based routing for dashboard page
  if (window.location.pathname === '/dashboard') {
    return (
      <>
        <CyberCursor />
        <DashboardPage />
      </>
    );
  }

  // Check for path-based routing for profile setup onboarding page
  if (window.location.pathname === '/setup-profile') {
    return (
      <>
        <CyberCursor />
        <OnboardingPage />
      </>
    );
  }

  // Check for path-based routing for brand identity documentation page
  if (window.location.pathname === '/brand') {
    return (
      <>
        <CyberCursor />
        <BrandIdentityPage />
      </>
    );
  }

  // Check for path-based routing for splash screen staging page
  if (window.location.pathname === '/splash') {
    return (
      <>
        <CyberCursor />
        <ClashSplash onFinish={() => window.location.href = '/'} />
      </>
    );
  }

  // Check for path-based routing for interactive background staging page
  if (window.location.pathname === '/background' || window.location.pathname === '/backgrounds') {
    return (
      <>
        <CyberCursor />
        <InteractiveBackgroundPage />
      </>
    );
  }

  const handleRouteToArena = (opponentData = null) => {
    setInitialOpponent(opponentData);
    setIsSimulator(true); // Entering arena from public landing page triggers simulator
    setView('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRouteToHome = () => {
    setInitialOpponent(null);
    setIsSimulator(false);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      <CyberCursor />
      {view === 'landing' ? (
        <LandingPage 
          onNavigateToArena={handleRouteToArena} 
        />
      ) : (
        <ArenaPage 
          onReturnToHome={handleRouteToHome} 
          initialOpponent={initialOpponent}
          isSimulator={isSimulator}
        />
      )}
      {showSplash && (
        <ClashSplash onFinish={handleSplashFinish} />
      )}
    </>
  );
}

export default App;
