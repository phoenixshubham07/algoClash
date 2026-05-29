import React, { useState } from 'react';
import { ClashSplash } from './components/ClashSplash';
import { LandingPage } from './components/LandingPage';
import { ArenaPage } from './components/ArenaPage';
import { WordmarkTestPage } from './components/WordmarkTestPage';
import { LoginPage } from './components/LoginPage';
import { BrandIdentityPage } from './components/BrandIdentityPage';
import { CyberCursor } from './components/CyberCursor';

function App() {
  // Splash screen is disabled by default on the root route to prevent blocking, moved to /splash
  const [showSplash, setShowSplash] = useState(false);
  const [view, setView] = useState('landing'); // landing | arena
  const [initialOpponent, setInitialOpponent] = useState(null);

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

  const handleRouteToArena = (opponentData = null) => {
    setInitialOpponent(opponentData);
    setView('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRouteToHome = () => {
    setInitialOpponent(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      <CyberCursor />
      {showSplash ? (
        <ClashSplash onFinish={handleSplashFinish} />
      ) : view === 'landing' ? (
        <LandingPage 
          onNavigateToArena={handleRouteToArena} 
        />
      ) : (
        <ArenaPage 
          onReturnToHome={handleRouteToHome} 
          initialOpponent={initialOpponent}
        />
      )}
    </>
  );
}

export default App;
