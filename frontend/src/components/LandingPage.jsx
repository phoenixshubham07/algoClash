import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from './CyberButton';
import { CyberCard } from './CyberCard';
import { TournamentBracket } from './TournamentBracket';
import { InteractiveBackground } from './InteractiveBackground';

export const LandingPage = ({ onNavigateToArena }) => {
  const [activeCompareTab, setActiveCompareTab] = useState('leetcode');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const comparisonData = {
    leetcode: {
      title: "VS. LEETCODE // THE SOLITARY GRID",
      systemCode: "COMP.LC_01",
      statusText: "DECRYPTED",
      color: "cyan",
      accent: "var(--accent-cyan)",
      deficit: {
        title: "LEETCODE DEFICITS",
        metrics: [
          { name: "REAL-TIME INTERACTION", value: 15 },
          { name: "ANTI-CHEAT PROCTORING", value: 10 },
          { name: "COMBAT TENSION", value: 0 }
        ],
        logs: [
          "Blind compiling against silent databases",
          "Encourages static template copy-pasting",
          "Zero opponent cursor or code telemetry"
        ]
      },
      advantage: {
        title: "ALGOCLASH SYSTEMS",
        metrics: [
          { name: "CLASH SYMMETRIC ENGAGEMENT", value: 100 },
          { name: "POSTGRES KEYSTROKE PROCTOR", value: 99 },
          { name: "COMPILER PRESSURE WAVE", value: 95 }
        ],
        logs: [
          "Live opponent ghost cursor offset tracking",
          "2-submit hard cap prevents template guessing",
          "Sensation sways & red warnings at 80% accuracy"
        ]
      }
    },
    codeforces: {
      title: "VS. CODEFORCES // COLD LEADERBOARDS",
      systemCode: "COMP.CF_02",
      statusText: "DECRYPTED",
      color: "crimson",
      accent: "var(--accent-crimson)",
      deficit: {
        title: "CODEFORCES DEFICITS",
        metrics: [
          { name: "VISUAL TELEMETRY", value: 5 },
          { name: "SPECTATOR ACCESS", value: 12 },
          { name: "HUD ENGAGEMENT", value: 8 }
        ],
        logs: [
          "Cold, static table-based scoreboard systems",
          "Delayed test run scoring calculations",
          "Zero dynamic feedback during the duel"
        ]
      },
      advantage: {
        title: "ALGOCLASH SYSTEMS",
        metrics: [
          { name: "LIVE TOURNAMENT BRACKETS", value: 100 },
          { name: "SPECTATOR HUDS & RADAR", value: 98 },
          { name: "IMPACT SHOCKWAVE SFX", value: 92 }
        ],
        logs: [
          "Sleek visual tournament double-elim brackets",
          "Auto redirect to sibling duels on finish",
          "Dynamic visual overlays and score sweeps"
        ]
      }
    },
    generic: {
      title: "VS. GENERIC PLATFORMS // EXAM HOLES",
      systemCode: "COMP.GEN_03",
      statusText: "DECRYPTED",
      color: "yellow",
      accent: "var(--accent-yellow)",
      deficit: {
        title: "GENERIC EXAM DEFICITS",
        metrics: [
          { name: "TAMPER SHIELD PROTECTION", value: 5 },
          { name: "MECHANICAL CODE SWAY", value: 20 },
          { name: "LOG TELEMETRY DENSITY", value: 15 }
        ],
        logs: [
          "Vulnerable to copy-paste ChatGPT injection",
          "Easy tab-switching bypassing basic proctors",
          "Zero active coding rhythm analysis"
        ]
      },
      advantage: {
        title: "ALGOCLASH SYSTEMS",
        metrics: [
          { name: "INTELLIGENT TAB-LOCK SHIELD", value: 100 },
          { name: "KEYSTROKE RHYTHM METRIC", value: 98 },
          { name: "SECURE POSTGRES SANDBOX", value: 99 }
        ],
        logs: [
          "Mandated browser focus proctor lock system",
          "Keystroke time-delta analysis blocks copy-pastes",
          "Immutable security logs prevent bypasses"
        ]
      }
    }
  };
  // Programmatic 12x17 Classic Retro Cursors (image_0aeeab.png Matrix Map)
  const classicCursorGrid = [
    [1,1,0,0,0,0,0,0,0,0,0,0],
    [1,3,1,0,0,0,0,0,0,0,0,0],
    [1,2,3,1,0,0,0,0,0,0,0,0],
    [1,2,2,3,1,0,0,0,0,0,0,0],
    [1,2,2,2,3,1,0,0,0,0,0,0],
    [1,2,2,2,2,3,1,0,0,0,0,0],
    [1,2,2,2,2,2,3,1,0,0,0,0],
    [1,2,2,2,2,2,2,3,1,0,0,0],
    [1,2,2,2,2,2,2,2,3,1,0,0],
    [1,2,2,2,2,2,2,2,2,3,1,0],
    [1,2,2,2,2,2,1,1,1,1,1,1],
    [1,2,2,1,2,2,1,0,0,0,0,0],
    [1,2,1,0,1,2,2,1,0,0,0,0],
    [1,1,0,0,1,2,2,1,0,0,0,0],
    [0,0,0,0,0,1,2,2,1,0,0,0],
    [0,0,0,0,0,1,2,2,1,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0]
  ];

  const renderCursor = (type = 'cyan', mirrored = false) => {
    return (
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 12 17" fill="none">
        {classicCursorGrid.map((row, rIdx) => {
          const currentRow = mirrored ? [...row].reverse() : row;
          return currentRow.map((cell, cIdx) => {
            if (cell === 0) return null;
            let fill = 'var(--accent-cyan)';
            if (type === 'cyan') {
              if (cell === 1) fill = '#051d26';
              if (cell === 2) fill = 'var(--accent-cyan)';
              if (cell === 3) fill = '#FFFFFF';
            } else {
              if (cell === 1) fill = '#300812';
              if (cell === 2) fill = 'var(--accent-crimson)';
              if (cell === 3) fill = '#FFFFFF';
            }
            return (
              <rect 
                key={`${type}-${rIdx}-${cIdx}`}
                x={cIdx} y={rIdx} width="1" height="1" 
                fill={fill} stroke={fill} strokeWidth="0.05"
              />
            );
          });
        })}
      </svg>
    );
  };

  // 14 columns x 13 rows programmatically mapped for the 8-bit trophy
  const retroTrophyGrid = [
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0], 
    [1,0,1,5,2,2,2,2,2,2,5,1,0,1], 
    [1,0,1,2,3,2,2,2,2,2,2,1,0,1], 
    [1,1,1,2,3,2,2,2,2,4,2,1,1,1], 
    [0,0,1,2,3,2,2,2,2,4,4,1,0,0], 
    [0,0,0,1,2,2,2,2,4,4,1,0,0,0], 
    [0,0,0,0,1,1,1,1,1,1,0,0,0,0], 
    [0,0,0,0,0,1,2,4,1,0,0,0,0,0], 
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0], 
    [0,0,0,0,0,1,2,4,1,0,0,0,0,0], 
    [0,0,0,0,1,2,2,4,4,1,0,0,0,0], 
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0], 
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0], 
  ];

  const renderTrophySVG = (size = 112) => {
    return (
      <svg 
        style={{ width: `${size}px`, height: `${size * (13/14)}px` }} 
        viewBox="0 0 14 13" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
      >
        {retroTrophyGrid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            if (cell === 0) return null;
            let fill = "#000000";
            if (cell === 1) fill = "#B45309"; // Dark gold outline
            if (cell === 2) fill = "#F59E0B"; // Base gold
            if (cell === 3) fill = "#FEF3C7"; // Highlight
            if (cell === 4) fill = "#D97706"; // Shadow
            if (cell === 5) fill = "#FFFFFF"; // Sparkle
            return <rect key={`t-${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width="1.05" height="1.05" fill={fill} />;
          })
        )}
      </svg>
    );
  };

  // Motion variants for letter-by-letter staggering reveal skewed at exactly 18-degrees!
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9, skewX: -18 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      skewX: -18,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 12
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-black)', overflow: 'hidden' }}>
      {/* BACKGROUND GRAPHICS & TEXTURES */}
      <InteractiveBackground />
      <div className="scanlines"></div>

      {/* HEADER / NAVIGATION BAR */}
      <header style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 40px',
        width: '90%',
        maxWidth: '1300px',
        backgroundColor: 'rgba(10, 10, 12, 0.42)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 242, 254, 0.22)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 254, 0.12), inset 0 0 12px rgba(0, 242, 254, 0.06)',
        clipPath: 'polygon(0% 0%, 98% 0%, 100% 12px, 100% 100%, 2% 100%, 0% calc(100% - 12px))',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* HUD Frame Decorative Corner Points */}
        <div style={{ position: 'absolute', top: 0, left: '20px', width: '40px', height: '2px', backgroundColor: 'var(--accent-cyan)' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: '20px', width: '40px', height: '2px', backgroundColor: 'var(--accent-crimson)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Small 18-degree mini clashing icon */}
          <div style={{ display: 'flex', gap: '2px', height: '18px', width: '26px' }}>
            <div style={{ transform: 'rotate(18deg) scale(0.65)', transformOrigin: 'right top' }}>{renderCursor('cyan', true)}</div>
            <div style={{ transform: 'rotate(-18deg) scale(0.65)', transformOrigin: 'left top' }}>{renderCursor('crimson', false)}</div>
          </div>
          <span className="font-display" style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '0.2em', color: '#fff' }}>
            ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span>
          </span>
          <span style={{ fontSize: '8px', color: 'rgba(0, 242, 254, 0.6)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.1em' }}>
            SYS_LOC: DUEL_STAGING
          </span>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '10px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
          <a href="#logo-fold" style={{ color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '4px' }} className="cyber-glitch-text">
            <span style={{ color: 'var(--accent-cyan)' }}>//</span> IDENTITY
          </a>
          <a href="#tech-moat" style={{ color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '4px' }} className="cyber-glitch-text">
            <span style={{ color: 'var(--accent-cyan)' }}>//</span> ANTI-CHEAT
          </a>
          <a href="#ui-preview" style={{ color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '4px' }} className="cyber-glitch-text">
            <span style={{ color: 'var(--accent-cyan)' }}>//</span> IN-GAME HUD
          </a>
          <a href="#combat-contrast" style={{ color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '4px' }} className="cyber-glitch-text">
            <span style={{ color: 'var(--accent-cyan)' }}>//</span> COMBAT
          </a>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/login" style={{ textDecoration: 'none' }}>
            <CyberButton variant="ghost" size="sm">
              LOG IN
            </CyberButton>
          </a>
          <CyberButton variant="primary" size="sm" onClick={() => onNavigateToArena(null)}>
            LAUNCH SIMULATOR
          </CyberButton>
        </div>
      </header>

      {/* SECTION 1: LOGO / HERO SECTION */}
      <section 
        id="logo-fold"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '88vh',
          padding: '140px 5% 60px 5%', // offset the fixed floating navbar height
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >


        {/* Trophy and Clashing Cursors in Hero Section */}
        <motion.div 
          animate={{
            opacity: scrolled ? 0 : 1,
            y: scrolled ? -25 : 0,
            scale: scrolled ? 0.8 : 1
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginBottom: '32px',
            pointerEvents: scrolled ? 'none' : 'auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px', position: 'relative' }}>
            
            {/* Trophy on top of the 2 cursors */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
              style={{ width: '64px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="bounce-trophy-landing"
            >
              {renderTrophySVG(64)}
            </motion.div>

            {/* Symmetrical clashing cursors */}
            <div style={{ display: 'flex', gap: '8px', height: '72px', width: '104px', position: 'relative' }}>
              {/* Left Cyan Cursor */}
              <motion.div 
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
                style={{ transform: 'rotate(18deg)', transformOrigin: 'right top', filter: 'drop-shadow(0 0 20px var(--accent-cyan))', width: '48px', height: '68px' }}
                className="cursor-float-left"
              >
                <div className="cursor-flicker" style={{ width: '100%', height: '100%' }}>
                  {renderCursor('cyan', true)}
                </div>
              </motion.div>

              {/* Right Crimson Cursor */}
              <motion.div 
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
                style={{ transform: 'rotate(-18deg)', transformOrigin: 'left top', filter: 'drop-shadow(0 0 20px var(--accent-crimson))', width: '48px', height: '68px' }}
                className="cursor-float-right"
              >
                <div className="cursor-flicker-crimson" style={{ width: '100%', height: '100%' }}>
                  {renderCursor('crimson', false)}
                </div>
              </motion.div>
            </div>
            
          </div>
        </motion.div>

        {/* OFFICIAL STENCILED OPTION WORDMARK WITH EXPANSION ANIMATION */}
        <div style={{ position: 'relative', whiteSpace: 'nowrap', marginBottom: '28px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontFamily: "'Space Grotesk', sans-serif", 
              fontSize: 'clamp(38px, 7.8vw, 82px)', 
              fontWeight: 900, 
              color: '#fff', 
              userSelect: 'none', 
              padding: '24px 0',
              filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.05))'
            }}
          >
          {/* Left Sleek Skewed Cyan Bracket - slide left */}
          <motion.span 
            initial={{ opacity: 0, x: 95, skewX: -18 }}
            animate={{ opacity: 1, x: 0, skewX: -18 }}
            transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
            style={{ display: 'inline-block', color: 'var(--accent-crimson)', marginRight: '8px', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
          >
            &lt;
          </motion.span>

          {/* algo (lowercase) simple upright Space Grotesk font style */}
          <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
            {'algo'.split('').map((char, idx) => (
              <motion.span 
                key={`algo-${idx}`}
                initial={{ opacity: 0, x: 15, skewX: 0 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 + (3 - idx) * 0.05 }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* Crimson Red Option Separator skewed at 18-deg with asymmetrical spacing to resolve skew collision */}
          <motion.span 
            initial={{ opacity: 0, scale: 0, skewX: -18 }}
            animate={{ opacity: 1, scale: 1, skewX: -18 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
            style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
          >
            ⌥
          </motion.span>

          {/* CLASH: Razor-Sharp Vector font - skewed at -18deg with centered Katakana subtitle absolutely underneath */}
          <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
            <motion.span 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 }}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                color: 'var(--accent-cyan)',
                filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))',
                transform: 'skewX(-18deg)',
                marginLeft: '0.04em'
              }}
            >
              <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* C */}
                <motion.path 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 }}
                  d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" 
                  fill="currentColor" 
                />
                {/* L */}
                <motion.path 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.28 }}
                  d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" 
                  fill="currentColor" 
                />
                {/* A */}
                <motion.path 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.36 }}
                  d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" 
                  fill="currentColor" 
                />
                {/* S */}
                <motion.path 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.44 }}
                  d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" 
                  fill="currentColor" 
                />
                {/* H */}
                <motion.path 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.52 }}
                  d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" 
                  fill="currentColor" 
                />
              </svg>
            </motion.span>
            
            {/* Absolute Centered Katakana Subtitle */}
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              style={{ 
                fontSize: '18px', 
                fontWeight: 800,
                letterSpacing: '0.65em', 
                color: 'var(--accent-crimson)', 
                textShadow: '0 0 12px rgba(244, 63, 94, 0.8)',
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'uppercase',
                display: 'inline-block',
                transform: 'skewX(-18deg) translateX(-50%)',
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                whiteSpace: 'nowrap'
              }}
            >
              クラッシュ
            </motion.span>
          </div>

          {/* Right Sleek Skewed Cyan Bracket - slide right */}
          <motion.span 
            initial={{ opacity: 0, x: -160, skewX: -18 }}
            animate={{ opacity: 1, x: 0, skewX: -18 }}
            transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
            style={{ display: 'inline-block', color: 'var(--accent-crimson)', marginLeft: '8px', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
          >
            &gt;
          </motion.span>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '28px' }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '26px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            marginTop: '8px'
          }}>
            <span style={{ 
              color: 'var(--accent-cyan)', 
              textShadow: '0 0 10px rgba(0, 242, 254, 0.5)'
            }}>
              CODE
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>//</span>
            <span style={{ 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 10px rgba(244, 63, 94, 0.5)'
            }}>
              CLASH
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>//</span>
            <span style={{ 
              color: 'var(--accent-yellow)', 
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}>
              CONQUER
            </span>
          </div>
          
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            letterSpacing: '0.15em',
            color: 'var(--text-secondary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginTop: '4px'
          }}>
            [ CODING IS NOT AN EXAM. IT'S A 1V1 DUEL ]
          </span>
          
          <div style={{ height: '2px', width: '80px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', marginTop: '8px' }}></div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          style={{ display: 'flex', gap: '16px', zIndex: 10 }}
        >
          <CyberButton variant="primary" size="md" onClick={() => onNavigateToArena(null)}>
            ENTER THE BATTLEFIELD
          </CyberButton>
          <a href="#tech-moat" style={{ textDecoration: 'none' }}>
            <CyberButton variant="ghost" size="md">
              VIEW TELEMETRY SPECS
            </CyberButton>
          </a>
        </motion.div>

        {/* Sleek CSS-animated Mouse Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ marginTop: '54px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
        >
          <svg width="22" height="36" viewBox="0 0 24 40" fill="none">
            <rect x="2" y="2" width="20" height="36" rx="10" stroke="var(--accent-cyan)" strokeWidth="1.5" />
            <motion.circle 
              cx="12" 
              cy="12" 
              r="2" 
              fill="var(--accent-yellow)"
              animate={{
                y: [0, 16, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            SCROLL TO DECRYPT
          </span>
        </motion.div>
      </section>

      {/* SECTION 2: WHY WE ARE A DIFFERENT LEAGUE */}
      <section 
        id="tech-moat"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '120px 5%',
          backgroundColor: 'rgba(3, 3, 4, 0.45)',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.3em', fontWeight: 'bold' }}>THE NEW STANDARD</span>
            <h2 className="font-display font-bold glow-cyan" style={{ fontSize: 'clamp(32px, 5vw, 44px)', color: '#fff', textTransform: 'uppercase', marginTop: '6px' }}>
              A DIFFERENT LEAGUE
            </h2>
            <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--accent-cyan)', margin: '12px auto 0 auto' }}></div>
          </div>

          {/* Tactical Selector Tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            marginBottom: '40px', 
            flexWrap: 'wrap', 
            width: '100%',
            position: 'relative',
            zIndex: 20
          }}>
            {Object.keys(comparisonData).map((key) => {
              const item = comparisonData[key];
              const isActive = activeCompareTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCompareTab(key)}
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.4)',
                    border: '1px solid',
                    borderColor: isActive ? item.accent : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    padding: '16px 24px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    clipPath: 'polygon(0% 0%, 90% 0%, 100% 10px, 100% 100%, 10% 100%, 0% calc(100% - 10px))',
                    boxShadow: isActive ? `0 0 20px ${item.accent}33` : 'none',
                    minWidth: '260px',
                    outline: 'none'
                  }}
                  className="cyber-glitch-text"
                >
                  {/* Scanner Sweep Line when active */}
                  {isActive && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: `linear-gradient(to right, transparent, ${item.accent}22, transparent)`,
                        animation: 'slice-sweep 2s infinite',
                        pointerEvents: 'none'
                      }} 
                    />
                  )}
                  {/* Corner indicator box */}
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '8px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: isActive ? item.accent : 'rgba(255,255,255,0.2)',
                    transition: 'background-color 0.3s ease'
                  }}></div>
                  
                  {key === 'leetcode' && `[01 // VS_LEETCODE]`}
                  {key === 'codeforces' && `[02 // VS_CODEFORCES]`}
                  {key === 'generic' && `[03 // VS_GENERIC]`}
                </button>
              );
            })}
          </div>

          {/* Main Comparative Console Chassis */}
          <div 
            style={{
              position: 'relative',
              backgroundColor: '#020203',
              border: '1px solid',
              borderColor: comparisonData[activeCompareTab].accent,
              boxShadow: `0 12px 40px rgba(0,0,0,0.9), 0 0 30px ${comparisonData[activeCompareTab].accent}1a`,
              clipPath: 'polygon(0% 0%, 97% 0%, 100% 24px, 100% 100%, 3% 100%, 0% calc(100% - 24px))',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              boxSizing: 'border-box'
            }}
            className="grid grid-cols-1 md:grid-cols-2"
          >
            {/* Top design header bar */}
            <div style={{ 
              gridColumn: '1 / -1', 
              borderBottom: '1px solid rgba(255,255,255,0.08)', 
              padding: '12px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.01)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em'
            }}>
              <span>DECISION_MATRIX // COGNITIVE_ANALYSIS</span>
              <span style={{ color: comparisonData[activeCompareTab].accent, fontWeight: 'bold' }}>
                STATUS: {comparisonData[activeCompareTab].statusText}
              </span>
            </div>

            {/* Left Column: Target Deficits (Red themed) */}
            <div style={{
              padding: '40px',
              backgroundColor: 'rgba(244, 63, 94, 0.01)',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Scanline sweep */}
              <div className="scanner-beam-red" style={{ opacity: 0.05 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '18px', backgroundColor: 'var(--accent-crimson)' }}></div>
                <h3 className="font-display font-bold glow-crimson" style={{ fontSize: '16px', color: 'var(--accent-crimson)', letterSpacing: '0.1em' }}>
                  {comparisonData[activeCompareTab].deficit.title}
                </h3>
              </div>

              {/* Deficit metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comparisonData[activeCompareTab].deficit.metrics.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                      <span>{m.name}</span>
                      <span style={{ color: 'var(--accent-crimson)' }}>{m.value}%</span>
                    </div>
                    {/* Progress track */}
                    <div style={{ height: '4px', backgroundColor: '#100a0b', position: 'relative' }}>
                      <div 
                        style={{ 
                          width: `${m.value}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--accent-crimson)',
                          boxShadow: '0 0 8px rgba(244, 63, 94, 0.5)'
                        }}
                        className="metric-bar-fill"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Deficit Logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(244,63,94,0.1)', paddingTop: '20px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>DETECTOR_LOGS // STAGNANT</span>
                {comparisonData[activeCompareTab].deficit.logs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <span style={{ color: 'var(--accent-crimson)' }}>✗</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: AlgoClash Advantage (Selected color themed) */}
            <div style={{
              padding: '40px',
              backgroundColor: `${comparisonData[activeCompareTab].accent}03`,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Scanline sweep */}
              <div className={activeCompareTab === 'leetcode' ? 'scanner-beam' : activeCompareTab === 'codeforces' ? 'scanner-beam-red' : 'scanner-beam'} style={{ opacity: 0.05 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '18px', backgroundColor: comparisonData[activeCompareTab].accent }}></div>
                <h3 className="font-display font-bold" style={{ fontSize: '16px', color: comparisonData[activeCompareTab].accent, letterSpacing: '0.1em', textShadow: `0 0 10px ${comparisonData[activeCompareTab].accent}80` }}>
                  {comparisonData[activeCompareTab].advantage.title}
                </h3>
              </div>

              {/* Advantage metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comparisonData[activeCompareTab].advantage.metrics.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#fff', letterSpacing: '0.1em' }}>
                      <span>{m.name}</span>
                      <span style={{ color: comparisonData[activeCompareTab].accent, fontWeight: 'bold' }}>{m.value === 95 || m.value === 92 ? 'MAX' : `${m.value}%`}</span>
                    </div>
                    {/* Progress track */}
                    <div style={{ height: '4px', backgroundColor: '#071518', position: 'relative' }}>
                      <div 
                        style={{ 
                          width: `${m.value}%`, 
                          height: '100%', 
                          backgroundColor: comparisonData[activeCompareTab].accent,
                          boxShadow: `0 0 8px ${comparisonData[activeCompareTab].accent}`
                        }}
                        className="metric-bar-fill"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Advantage Logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', borderTop: `1px solid ${comparisonData[activeCompareTab].accent}22`, paddingTop: '20px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>ACTIVE_MATRIX // COMBAT_INTELLIGENCE</span>
                {comparisonData[activeCompareTab].advantage.logs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    <span style={{ color: comparisonData[activeCompareTab].accent }}>✓</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom traces decoration */}
            <div style={{ 
              gridColumn: '1 / -1', 
              borderTop: '1px solid rgba(255,255,255,0.05)', 
              padding: '12px 24px', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)'
            }}>
              <span>PARADIGM_SWAP: SUCCESS</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ width: '4px', height: '6px', backgroundColor: comparisonData[activeCompareTab].accent, transform: 'skewX(-20deg)', opacity: 0.6 }} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: IN-GAME UI DISPLAY (4 CARDS) */}
      <section 
        id="ui-preview"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '100px 5%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', letterSpacing: '0.3em', fontWeight: 'bold' }}>HUD TELEMETRY PREVIEW</span>
            <h2 className="font-display font-bold glow-yellow" style={{ fontSize: 'clamp(32px, 5vw, 44px)', color: '#fff', textTransform: 'uppercase', marginTop: '6px' }}>
              BATTLEGROUND HUD
            </h2>
            <div className="hazard-stripes-sm" style={{ width: '80px', height: '4px', margin: '12px auto 0 auto' }}></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}
          >
            
            {/* Card 1: Ghost Cursors */}
            <div style={{ position: 'relative' }}>
              <div className="hazard-stripes-cyan" style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 20 }}></div>
              <CyberCard variant="primary" title="LIVE GHOST CURSORS" systemCode="FEAT.CURS_01" statusText="SYNC">
                Watch your opponent's active editing line jump across files in real time. Absolute mechanical pressure.
                <div style={{ display: 'flex', gap: '4px', height: '14px', width: '20px', marginTop: '16px', opacity: 0.8 }}>
                  <div style={{ transform: 'rotate(18deg) scale(0.5)', transformOrigin: 'right top' }}>{renderCursor('cyan', true)}</div>
                  <div style={{ transform: 'rotate(-18deg) scale(0.5)', transformOrigin: 'left top' }}>{renderCursor('crimson', false)}</div>
                </div>
              </CyberCard>
            </div>

            {/* Card 2: Red Screen warnings */}
            <div style={{ position: 'relative' }}>
              <div className="hazard-stripes-crimson" style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 20 }}></div>
              <CyberCard variant="danger" title="PULSING RED ALERTS" systemCode="FEAT.WARN_02" statusText="PULSE">
                Workspace sways and pulses crimson when the opponent crosses $\ge 80\%$ test cases accuracy. Fight through the alarms.
              </CyberCard>
            </div>

            {/* Card 3: 2-Submit Hard Cap */}
            <div style={{ position: 'relative' }}>
              <div className="hazard-stripes-sm" style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 20 }}></div>
              <CyberCard variant="warning" title="2-SUBMIT HARD CAP" systemCode="FEAT.LIMIT_03" statusText="CAP">
                Two attempts max. Evaluate sample tests infinitely, but submit locks only when you are absolutely locked and loaded.
              </CyberCard>
            </div>

            {/* Card 4: Spectator Stagger */}
            <div style={{ position: 'relative' }}>
              <div style={{ height: '4px', width: '100%', backgroundColor: '#333', position: 'absolute', top: 0, left: 0, zIndex: 20 }}></div>
              <CyberCard variant="default" title="SPECTATOR ROUTING" systemCode="FEAT.SPEC_04" statusText="LIVE">
                Zero competitive downtime. Instant automatic redirection to spectator slots on bracket sibling duels on finish.
              </CyberCard>
            </div>

          </motion.div>

          {/* Floating Kanji Decal Overlay */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px', 
            marginTop: '40px', 
            fontSize: '10px', 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--text-muted)',
            letterSpacing: '0.15em'
          }}>
            <span>未来 [FUTURE]</span>
            <span>対決 [DUEL]</span>
            <span>戦闘 [COMBAT]</span>
            <span>極限 [LIMIT]</span>
          </div>

        </div>
      </section>

      {/* SECTION 4: HOW WE WILL CONVERT AND KILL TRADITIONAL CODING */}
      <section 
        id="combat-contrast"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '80px 5%',
          backgroundColor: 'rgba(3, 3, 4, 0.45)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-crimson)', letterSpacing: '0.3em', fontWeight: 'bold' }}>PLATFORM REVOLUTION</span>
            <h2 className="font-display font-bold glow-crimson" style={{ fontSize: 'clamp(32px, 5vw, 44px)', color: '#fff', textTransform: 'uppercase', marginTop: '6px' }}>
              THE EVOLUTION
            </h2>
            <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--accent-crimson)', margin: '12px auto 0 auto' }}></div>
          </div>

          {/* Contrast Dashboard Table Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            
            {/* The Old LeetCode Style */}
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              style={{
                border: '1px solid #200d11',
                backgroundColor: 'rgba(8,4,5,0.7)',
                padding: '24px',
                position: 'relative',
                boxSizing: 'border-box',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), 94% 100%, 0% 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(244,63,94,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--accent-crimson)', fontWeight: 'bold', fontSize: '14px' }}>✗</span>
                <span className="font-display" style={{ fontWeight: 'bold', color: 'var(--accent-crimson)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px' }}>
                  TRADITIONAL CODING EXAMS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div style={{ textDecoration: 'line-through', opacity: 0.55 }}>• Solitary submission grids into a blind, cold database</div>
                <div style={{ textDecoration: 'line-through', opacity: 0.55 }}>• Brute-force template testing using infinite tries</div>
                <div style={{ textDecoration: 'line-through', opacity: 0.55 }}>• Zero psychological alerts or in-game tracking indicators</div>
                <div style={{ textDecoration: 'line-through', opacity: 0.55 }}>• Passive leaderboards calculated hours after completion</div>
              </div>
            </motion.div>

            {/* The AlgoClash Combat Style */}
            <motion.div 
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              style={{
                border: '1px solid #052a30',
                backgroundColor: 'rgba(3,8,10,0.85)',
                padding: '24px',
                position: 'relative',
                boxSizing: 'border-box',
                boxShadow: '0 0 30px rgba(0,242,254,0.05)',
                clipPath: 'polygon(0% 0%, 94% 0%, 100% 16px, 100% 100%, 0% 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(0,242,254,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                <span className="font-display" style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px' }}>
                  THE ALGOCLASH FLOW
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                <div style={{ textShadow: '0 0 4px var(--accent-cyan)' }}>• Symmetrical 1v1 digital combat in compiler sandboxes</div>
                <div style={{ textShadow: '0 0 4px var(--accent-cyan)' }}>• High-stakes 2-submission limits block generic templates</div>
                <div style={{ textShadow: '0 0 4px var(--accent-cyan)' }}>• Sensation sways, alarms, and real-time cursor offsets</div>
                <div style={{ textShadow: '0 0 4px var(--accent-cyan)' }}>• Sibling spectate routing and microsecond-accurate updates</div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 5: JOIN THE CLASH */}
      <section 
        id="brackets"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '80px 5%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', letterSpacing: '0.3em', fontWeight: 'bold' }}>LIVE STAGING AREA</span>
            <h2 className="font-display font-bold glow-yellow" style={{ fontSize: 'clamp(32px, 5vw, 44px)', color: '#fff', textTransform: 'uppercase', marginTop: '6px' }}>
              TOURNAMENT #01
            </h2>
            <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--accent-yellow)', margin: '12px auto 0 auto' }}></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TournamentBracket onSelectLiveMatch={(match) => {
              onNavigateToArena({
                username: match.p2,
                elo: match.elo2 || 1412,
                avatar: match.p2[0].toUpperCase(),
                tag: 'LIVE_BRACKET_SPECTATE',
                lang: 'cpp'
              });
            }} />
          </motion.div>

          {/* Ticket Purchase Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              border: '1px solid var(--accent-yellow)', 
              backgroundColor: 'rgba(3, 3, 4, 0.95)', 
              padding: '24px 32px', 
              marginTop: '40px', 
              flexWrap: 'wrap', 
              gap: '24px', 
              boxShadow: '0 0 30px rgba(255,215,0,0.08)',
              clipPath: 'polygon(0% 0%, 95% 0%, 100% 16px, 100% 100%, 5% 100%, 0% calc(100% - 16px))'
            }}
          >
            <div style={{ flex: '1', minWidth: '280px' }}>
              <span className="glow-yellow" style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontWeight: 'bold', letterSpacing: '0.25em' }}>REGISTRATION OPEN</span>
              <h3 className="font-display font-bold glow-yellow" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', color: '#fff', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ₹50,000 COMBAT MATRIX
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
                64 slots • Double elimination • ₹149 entry buy-in. Tokyo/Seoul/Mumbai staging. Prove your rating.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
              <CyberButton variant="warning" size="md" onClick={() => onNavigateToArena(null)}>
                SECURE ENTRY // ₹149
              </CyberButton>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>SLOTS: 18/64</span>
                <span style={{ color: 'var(--accent-crimson)' }}>LIMIT: 36H</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '64px 5% 40px 5%',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(2, 2, 3, 0.6)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '2px', height: '14px', width: '20px' }}>
            <div style={{ transform: 'rotate(18deg) scale(0.5)', transformOrigin: 'right top' }}>{renderCursor('cyan', true)}</div>
            <div style={{ transform: 'rotate(-18deg) scale(0.5)', transformOrigin: 'left top' }}>{renderCursor('crimson', false)}</div>
          </div>
          <span className="font-display" style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '0.15em', color: '#fff' }}>
            ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span>
          </span>
        </div>
        
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
          High-fidelity competitive coding. Prove your ELO in 1v1 digital combat.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px', fontFamily: 'var(--font-mono)' }}>
          <span>STATUS: <b style={{ color: 'var(--accent-cyan)' }}>ACTIVE_SANDBOX_V1</b></span>
          <span>BUILD: 2026.05.28_V1.4</span>
          <span>PING: 12MS</span>
        </div>

        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          © 2026 ALGOCLASH. NO COPYRIGHTS RESERVED. TACTICAL COMBAT ZONE.
        </div>
      </footer>

      {/* FLOATING LOGO (BOTTOM RIGHT) WHEN SCROLLED */}
      <motion.div
        animate={{
          opacity: scrolled ? 1 : 0,
          scale: scrolled ? 0.65 : 0.2,
          y: scrolled ? 0 : 50,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 90,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(10, 10, 12, 0.72)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          padding: '16px 20px',
          clipPath: 'polygon(0% 0%, 90% 0%, 100% 10px, 100% 100%, 10% 100%, 0% calc(100% - 10px))',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.1)',
          pointerEvents: scrolled ? 'auto' : 'none'
        }}
        whileHover={{
          scale: 0.7,
          borderColor: 'var(--accent-cyan)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 242, 254, 0.2)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '38px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bounce-trophy-landing">
            {renderTrophySVG(38)}
          </div>
          <div style={{ display: 'flex', gap: '4px', height: '42px', width: '60px', position: 'relative' }}>
            <div style={{ transform: 'rotate(18deg)', transformOrigin: 'right top', filter: 'drop-shadow(0 0 12px var(--accent-cyan))', width: '28px', height: '40px' }} className="cursor-float-left">
              {renderCursor('cyan', true)}
            </div>
            <div style={{ transform: 'rotate(-18deg)', transformOrigin: 'left top', filter: 'drop-shadow(0 0 12px var(--accent-crimson))', width: '28px', height: '40px' }} className="cursor-float-right">
              {renderCursor('crimson', false)}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '8px', letterSpacing: '0.15em', fontWeight: 'bold' }}>
          ASCEND // TO_TOP
        </span>
      </motion.div>

    </div>
  );
};
