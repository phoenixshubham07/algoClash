import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { InteractiveBackground } from './InteractiveBackground';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null); // 'user' | 'pass' | null
  const [statusLogs, setStatusLogs] = useState([
    '⚡ [SYS_BOOT] STANDING BY FOR USER AUTHORIZATION...',
    '🔒 [SECURE] CRYPTOGRAPHIC SUITE PROTOCOL v2.9 ACTIVE.'
  ]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Background audio or visual micro-animation timers
  useEffect(() => {
    if (isAuthenticating) {
      const logs = [
        '⚡ [SYS] INITIALIZING SECURE HANDSHAKE...',
        '🔒 [KEY] DECRYPTING CYCLIC CREDENTIAL BLOCK...',
        '🔑 [RSA] TOKEN VALIDATION IN PROGRESS...',
        '🟢 [AUTH] CRITICAL CREDENTIALS ACCEPTED.'
      ];

      logs.forEach((logText, idx) => {
        setTimeout(() => {
          setStatusLogs(prev => [...prev, logText]);
        }, 600 * (idx + 1));
      });

      // Complete authentication
      setTimeout(() => {
        setAuthSuccess(true);
        setStatusLogs(prev => [...prev, '🚀 [CORE] REDIRECTING COMBATANT TO COMMAND CENTER...']);
      }, 3000);

      // Redirect to combatant command dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 4200);
    }
  }, [isAuthenticating]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setStatusLogs(prev => [...prev, '🚨 [ERROR] ACCESS DENIED: EMPTY FIELDS RECEIVED.']);
      return;
    }
    // Securely cache username for greeting display in dashboard
    localStorage.setItem('algoclash_username', username);
    setIsAuthenticating(true);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsAuthenticating(true);
      setStatusLogs(prev => [...prev, '⚡ [SYS] ROUTING TO GOOGLE OAUTH PROVIDER...']);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) {
        setStatusLogs(prev => [...prev, `🚨 [ERROR] OAUTH INITIATION FAILED: ${error.message}`]);
        setIsAuthenticating(false);
      }
    } catch (err) {
      setStatusLogs(prev => [...prev, `🚨 [ERROR] SYSTEM FAULT: ${err.message}`]);
      setIsAuthenticating(false);
    }
  };

  // Stagger path variants for the official Logo 3 animation
  const logoStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const pathVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (customIndex) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        delay: 0.15 + customIndex * 0.06
      }
    })
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020203',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <InteractiveBackground />
      {/* Background Coding Grid Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundImage: 'linear-gradient(rgba(3, 3, 4, 0.98) 50%, rgba(0, 0, 0, 1) 100%), linear-gradient(90deg, rgba(0, 242, 254, 0.007) 1px, transparent 1px), linear-gradient(rgba(244, 63, 94, 0.007) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        opacity: 0.95,
        pointerEvents: 'none'
      }}></div>

      {/* Cyber Scanline Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
        backgroundSize: '100% 4px',
        opacity: 0.35
      }}></div>

      {/* Glowing Backdrop Decals */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.04) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '500px', height: '500px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.035) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>

      {/* Outer Content Area */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* LOGO AREA (Official Logo 3 with Katakana Subtitle) */}
        <motion.div 
          variants={logoStagger}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#fff',
            userSelect: 'none',
            padding: '12px 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Left bracket */}
            <motion.span 
              initial={{ opacity: 0, x: 45, skewX: -18 }}
              animate={{ opacity: 1, x: 0, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '6px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
            >
              &lt;
            </motion.span>

            {/* algo simple upright */}
            <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
              {'algo'.split('').map((char, idx) => (
                <motion.span 
                  key={`algo-${idx}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.15 + (3 - idx) * 0.05 }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>

            {/* Asymmetrical Spacing Option separator */}
            <motion.span 
              initial={{ opacity: 0, scale: 0, skewX: -18 }}
              animate={{ opacity: 1, scale: 1, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
              style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
            >
              ⌥
            </motion.span>

            {/* CLASH with Katakana subtitle centered underneath */}
            <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 }}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  color: 'var(--accent-cyan)',
                  filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.5))',
                  transform: 'skewX(-18deg)',
                  marginLeft: '0.04em'
                }}
              >
                <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
                  <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
                  <motion.path custom={2} variants={pathVariants} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
                  <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
                  <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
                </svg>
              </motion.span>
              
              <motion.span 
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ 
                  fontSize: '8px', 
                  fontWeight: 800,
                  letterSpacing: '0.65em', 
                  color: 'var(--accent-crimson)', 
                  textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  transform: 'skewX(-18deg) translateX(-50%)',
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  whiteSpace: 'nowrap'
                }}
              >
                クラッシュ
              </motion.span>
            </div>

            {/* Right Bracket */}
            <motion.span 
              initial={{ opacity: 0, x: -45, skewX: -18 }}
              animate={{ opacity: 1, x: 0, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '6px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
            >
              &gt;
            </motion.span>
          </div>
        </motion.div>

        {/* LOGIN CONTAINER GLASS PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.3 }}
          style={{
            position: 'relative',
            backgroundColor: 'rgba(2, 2, 3, 0.82)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: authSuccess ? '0 0 40px rgba(0, 242, 254, 0.12)' : '0 0 30px rgba(0, 0, 0, 0.5)',
            padding: '40px 32px 32px 32px',
            clipPath: 'polygon(0% 0%, 94% 0%, 100% 24px, 100% 100%, 6% 100%, 0% calc(100% - 24px))',
            transition: 'border 0.5s, box-shadow 0.5s'
          }}
        >
          {/* Neon side accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '60px', backgroundColor: 'var(--accent-cyan)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '60px', backgroundColor: 'var(--accent-crimson)' }}></div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header tag */}
            <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.15em' }}>
                [ SYSTEM ACCESS PORTAL ]
              </span>
            </div>

            {/* Username block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                IDENT_COGNIZANCE (USERNAME)
              </label>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: focusedField === 'user' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-mono)', transition: 'color 0.3s' }}>&lt;</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('user')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isAuthenticating}
                  placeholder="enter agent alias"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: focusedField === 'user' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: focusedField === 'user' ? '0 0 10px rgba(0, 242, 254, 0.15)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', color: focusedField === 'user' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-mono)', transition: 'color 0.3s' }}>&gt;</span>
              </div>
            </div>

            {/* Cryptographic password block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                CRYPTOGRAPHIC_KEY (PASSKEY)
              </label>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: focusedField === 'pass' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-mono)', transition: 'color 0.3s' }}>&lt;</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('pass')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isAuthenticating}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: focusedField === 'pass' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: focusedField === 'pass' ? '0 0 10px rgba(0, 242, 254, 0.15)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', color: focusedField === 'pass' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: 'var(--font-mono)', transition: 'color 0.3s' }}>&gt;</span>
              </div>
            </div>

            {/* BUTTON / TRIGGER */}
            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                disabled={isAuthenticating}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '14px',
                  backgroundColor: authSuccess ? '#22d3ee' : isAuthenticating ? 'transparent' : 'transparent',
                  border: authSuccess ? '1px solid #22d3ee' : isAuthenticating ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--accent-cyan)',
                  color: authSuccess ? '#000' : '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '0.2em',
                  cursor: isAuthenticating ? 'not-allowed' : 'pointer',
                  clipPath: 'polygon(0% 0%, 95% 0%, 100% 10px, 100% 100%, 5% 100%, 0% calc(100% - 10px))',
                  boxShadow: authSuccess ? '0 0 20px rgba(34, 211, 238, 0.4)' : isAuthenticating ? 'none' : '0 0 12px rgba(0, 242, 254, 0.15)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {isAuthenticating && !authSuccess && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '30%',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 242, 254, 0.15), transparent)',
                    animation: 'splash-ping 1.5s infinite linear'
                  }} />
                )}

                {authSuccess ? (
                  '🔑 ACCESS GRANTED'
                ) : isAuthenticating ? (
                  '⚡ DECRYPTING PASSKEY...'
                ) : (
                  'ACCESS THE SYSTEM CORE'
                )}
              </button>
            </div>
          </form>

          {/* OAuth Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }}></div>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>OR EXTERNAL AUTHORIZATION</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }}></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            style={{
              position: 'relative',
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '0.15em',
              cursor: isAuthenticating ? 'not-allowed' : 'pointer',
              clipPath: 'polygon(0% 0%, 95% 0%, 100% 10px, 100% 100%, 5% 100%, 0% calc(100% - 10px))',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              if (!isAuthenticating) {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 242, 254, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 242, 254, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAuthenticating) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)';
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            ⚡ AUTH_PROVIDER: GOOGLE
          </button>
          
        </motion.div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <a href="/" style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            ← BACK TO SYSTEM HOME
          </a>
        </div>

      </div>
    </div>
  );
};
