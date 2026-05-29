import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from './CyberButton';
import { supabase } from '../supabaseClient';

export const DashboardPage = () => {
  const [username, setUsername] = useState('AGENT_UNKNOWN');
  const [sessionUser, setSessionUser] = useState(null);
  const [systemLogs, setSystemLogs] = useState([
    '⚡ [INIT] CORE CONSOLE SECURED.',
    '🟢 [SYS] WELCOME TO THE DUEL COMMAND DECK.'
  ]);

  // Load username from localStorage or Supabase session
  useEffect(() => {
    // 1. Check local storage (from mock login form)
    const savedUser = localStorage.getItem('algoclash_username');
    if (savedUser) {
      setUsername(savedUser.toUpperCase());
    }

    // 2. Check Supabase OAuth session
    const getSupabaseSession = async () => {
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setSessionUser(session.user);
          const emailPrefix = session.user.email ? session.user.email.split('@')[0] : 'AGENT';
          const fullName = session.user.user_metadata?.full_name || emailPrefix;
          setUsername(fullName.toUpperCase());
          setSystemLogs(prev => [
            ...prev,
            `🛡️ [AUTH] GOOGLE OAUTH VALIDATED FOR: ${session.user.email}`,
            '🔑 [SESSION] CREATED AUTHORIZED SESSION ID Token.'
          ]);
        }
      }
    };
    getSupabaseSession();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('algoclash_username');
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020203',
      color: '#f8fafc',
      padding: '60px 24px',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Background Coding Grid Layer */}
      <div className="grid-bg"></div>

      {/* scanlines */}
      <div className="scanlines"></div>

      {/* Cyber Glowing Backdrop Decals */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.05) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '500px', height: '500px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.035) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* HEADER SECTION */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="font-display" style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '0.2em' }}>
                ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span>
              </span>
              <span style={{ fontSize: '8px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-yellow)', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.1em' }}>
                COMMAND_CENTER
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
              LOC: STAGING_SYS // PORT_NODE_ACTIVE
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <CyberButton variant="ghost" size="sm" onClick={handleLogout}>
              TERMINATE SESSION (LOGOUT)
            </CyberButton>
          </div>
        </header>

        {/* HERO GREETING BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            backgroundColor: 'rgba(2, 2, 3, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            boxShadow: '0 0 24px rgba(0, 242, 254, 0.06)',
            padding: '36px 40px',
            clipPath: 'polygon(0% 0%, 97% 0%, 100% 24px, 100% 100%, 3% 100%, 0% calc(100% - 24px))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '50px', backgroundColor: 'var(--accent-cyan)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '50px', backgroundColor: 'var(--accent-crimson)' }}></div>
          
          <div>
            <span style={{ fontSize: '10px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.25em' }}>
              📡 INCOMING SECURE LINK ESTABLISHED
            </span>
            <h1 className="font-display glow-cyan" style={{ fontSize: '38px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginTop: '8px' }}>
              HELLO, <span style={{ color: 'var(--accent-cyan)' }}>{username}</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', lineHeight: '1.6' }}>
              Your authentication handshake succeeded. You are cleared for tactical live code clashing. Synchronize with the matchmaking grid or initiate compile simulations inside the combat deck.
            </p>
          </div>

          <div>
            <CyberButton variant="primary" size="lg" onClick={() => window.location.href = '/'}>
              ENTER BATTLEFIELD
            </CyberButton>
          </div>
        </motion.div>

        {/* METRICS & CONSOLE STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* STATS WIDGET */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              backgroundColor: 'rgba(2, 2, 3, 0.7)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px',
              borderRadius: '4px',
              position: 'relative'
            }}
          >
            <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>// COMBAT_STATS.DAT</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>RANK: SPECIALIST</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>CLASH RATING (ELO)</span>
                <span className="glow-cyan" style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '18px', color: 'var(--accent-cyan)' }}>1,540</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>WIN / LOSS RATIO</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>14 / 2 (87.5%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>ACCURACY RATING</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '14px', color: 'var(--accent-yellow)' }}>94.2%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)' }}>
                  <span>EXPERIENCE PROGRESSION</span>
                  <span>780 / 1000 XP</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TELEMETRY CONSOLE PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              backgroundColor: 'rgba(2, 2, 3, 0.7)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>// SYSTEM_TELEMETRY.LOG</span>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>LIVE_FEED</span>
              </div>

              <div style={{
                height: '110px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255,255,255,0.02)',
                padding: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                overflowY: 'auto'
              }}>
                {systemLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes('🚨') ? 'var(--accent-crimson)' : log.includes('🛡️') ? 'var(--accent-cyan)' : '#94a3b8' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
