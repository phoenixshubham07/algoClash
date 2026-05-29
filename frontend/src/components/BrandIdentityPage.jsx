import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const BrandIdentityPage = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [customScale, setCustomScale] = useState(64); // px

  const handleCopy = (name, text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(name);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const colors = [
    { name: 'Accent Cyan', hex: '#00f2fe', css: 'var(--accent-cyan)', desc: 'Primary brand glow. Used for interactive brackets, combat triggers, and skewed vector letters.' },
    { name: 'Accent Crimson', hex: '#f43f5e', css: 'var(--accent-crimson)', desc: 'Secondary brand accent. Used for the Option separator key ⌥, Katakana subtitles, and laser slicers.' },
    { name: 'Accent Yellow', hex: '#ffd700', css: 'var(--accent-yellow)', desc: 'Tertiary system status. Used for system chassis tags, active code parameters, and console highlights.' },
    { name: 'Obsidian Black', hex: '#020203', css: '#020203', desc: 'Core background void. Solid dark space allowing the cybernetic glows to pop with rich contrast.' }
  ];

  // SVG Coordinates for documentation
  const pathsDoc = {
    c: 'M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z',
    l: 'M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z',
    a: 'M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z',
    s: 'M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z',
    h: 'M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z',
    opt: 'M 14 5 L 28 5 \nAlternative path: M 0 41 L 10 41 L 20 5 (strokeWidth="10")'
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
        delay: 0.1 + customIndex * 0.05
      }
    })
  };

  // Reusable official Logo 3 renderer with absolute Katakana subtitle
  const renderOfficialLogo = (fontSizePx, animate = true) => {
    return (
      <motion.div 
        variants={animate ? logoStagger : {}}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${fontSizePx}px`,
          fontWeight: 900,
          textTransform: 'uppercase',
          color: '#fff',
          userSelect: 'none',
          position: 'relative',
          padding: '24px 0'
        }}
      >
        {/* Left bracket */}
        <motion.span 
          initial={animate ? { opacity: 0, x: 45, skewX: -18 } : {}}
          animate={{ opacity: 1, x: 0, skewX: -18 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
          style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '0.12em', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
        >
          &lt;
        </motion.span>

        {/* algo simple upright Space Grotesk */}
        <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
          {'algo'.split('').map((char, idx) => (
            <motion.span 
              key={`algo-${idx}`}
              initial={animate ? { opacity: 0, x: 10 } : {}}
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
          initial={animate ? { opacity: 0, scale: 0, skewX: -18 } : {}}
          animate={{ opacity: 1, scale: 1, skewX: -18 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
          style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
        >
          ⌥
        </motion.span>

        {/* CLASH with Katakana subtitle centered underneath */}
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <motion.span 
            initial={animate ? { opacity: 0, x: -10 } : {}}
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
              <motion.path custom={0} variants={animate ? pathVariants : {}} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <motion.path custom={1} variants={animate ? pathVariants : {}} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              <motion.path custom={2} variants={animate ? pathVariants : {}} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
              <motion.path custom={3} variants={animate ? pathVariants : {}} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <motion.path custom={4} variants={animate ? pathVariants : {}} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </motion.span>
          
          <motion.span 
            initial={animate ? { opacity: 0, y: 6 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ 
              fontSize: '0.14em', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-0.3em',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </motion.span>
        </div>

        {/* Right Bracket */}
        <motion.span 
          initial={animate ? { opacity: 0, x: -45, skewX: -18 } : {}}
          animate={{ opacity: 1, x: 0, skewX: -18 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
          style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '0.12em', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
        >
          &gt;
        </motion.span>
      </motion.div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020203',
      color: '#f8fafc',
      padding: '60px 5%',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Background Decal Layers */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(3, 3, 4, 0.98) 40%, rgba(0, 0, 0, 1) 100%), linear-gradient(90deg, rgba(0, 242, 254, 0.007) 1px, transparent 1px), linear-gradient(rgba(244, 63, 94, 0.007) 1px, transparent 1px)', backgroundSize: '100% 100%, 48px 48px, 48px 48px', opacity: 0.95, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255, 63, 94, 0.1)', zIndex: 2, pointerEvents: 'none' }} />

      {/* HEADER SECTION */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto 60px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.25em' }}>[ SYSTEM SPECIFICATION ]</span>
          <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>
            ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span> BRAND GUIDELINES
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/splash" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--accent-crimson)', color: 'var(--accent-crimson)', fontWeight: 'bold', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.3s' }}>
              ⚡ VIEW SPLASH STAGE
            </button>
          </a>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 'bold', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.3s' }}>
              BACK TO HOME
            </button>
          </a>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '40px' }}>
        
        {/* LEFT COLUMN: BRAND SYMBOLS & SCALING SPEC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          
          {/* CARD 1: THE CRADLE OF THE OFFICIAL IDENTITY */}
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.8)', padding: '36px', position: 'relative', clipPath: 'polygon(0% 0%, 96% 0%, 100% 16px, 100% 100%, 4% 100%, 0% calc(100% - 16px))' }}>
            <span style={{ position: 'absolute', top: '12px', right: '20px', fontSize: '8px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>SPEC // ID_03_OFFICIAL</span>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.15em', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              01 // THE MASTER WORDMARK LAYOUT
            </h3>
            
            {/* Main presentation display */}
            <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,242,254,0.1)', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,242,254,0.15)' }} />
              {renderOfficialLogo(52)}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '16px' }}>
              The **AlgoClash Katakana Wordmark** represents elite, geometric combat. It features simple upright lowercase <strong>Space Grotesk</strong> letterforms for <code>algo</code>, parallel 18-degree skews on the brackets and <code>CLASH</code> vector paths, and the Japanese Katakana subtitle <code>クラッシュ</code> centered absolutely underneath to eliminate vertical drift and baseline variance.
            </p>
          </div>

          {/* CARD 2: MULTI-CONTEXT SCALING SIMULATOR */}
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.8)', padding: '36px', clipPath: 'polygon(0% 0%, 96% 0%, 100% 16px, 100% 100%, 4% 100%, 0% calc(100% - 16px))' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.15em', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              02 // RESPONSIVE SCALING DEMO
            </h3>

            {/* Slider control */}
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '20px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>ADJUST WORDMARK SCALE:</span>
                <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'var(--font-mono)', marginLeft: '12px', fontWeight: 'bold' }}>{customScale}px</span>
                <input 
                  type="range" 
                  min="24" 
                  max="80" 
                  value={customScale}
                  onChange={(e) => setCustomScale(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', marginTop: '8px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Scale renderer */}
            <div style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', boxSizing: 'border-box' }}>
              {renderOfficialLogo(customScale, false)}
            </div>
          </div>

          {/* CARD 3: APPLICATION IN OTHER SPECIFIC PLACES */}
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.8)', padding: '36px', clipPath: 'polygon(0% 0%, 96% 0%, 100% 16px, 100% 100%, 4% 100%, 0% calc(100% - 16px))' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.15em', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              03 // WORDMARK LAYOUT IN DIFFERENT SCENARIOS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Context 1: Landing Page Nav Header */}
              <div>
                <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)' }}>[ SCENARIO A ] HERO NAVIGATION HEADER</span>
                <div style={{ marginTop: '8px', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ transform: 'scale(0.5)', transformOrigin: 'left center', width: '220px', height: '36px', display: 'flex', alignItems: 'center' }}>
                    {renderOfficialLogo(32, false)}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', transform: 'scale(0.8)', transformOrigin: 'right center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IDENTITY</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMBAT</span>
                  </div>
                </div>
              </div>

              {/* Context 2: Compact Mobile Card Header */}
              <div>
                <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)' }}>[ SCENARIO B ] TOURNAMENT BRACKET HUD CARD</span>
                <div style={{ marginTop: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '8px' }}>
                    <div style={{ transform: 'scale(0.4)', transformOrigin: 'left center', width: '130px', height: '24px', display: 'flex', alignItems: 'center' }}>
                      {renderOfficialLogo(28, false)}
                    </div>
                    <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)' }}>ROUND_01</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Agent_Xerox</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>99.8% ACC</span>
                    </div>
                    <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Agent_Void</span>
                      <span style={{ color: 'var(--accent-crimson)' }}>84.2% ACC</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RAW SPEC SHEET & COLOR PALETTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          
          {/* COLORS */}
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.8)', padding: '36px', clipPath: 'polygon(0% 0%, 96% 0%, 100% 16px, 100% 100%, 4% 100%, 0% calc(100% - 16px))' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.15em', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              04 // BRAND COLORS
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {colors.map((color) => (
                <div key={color.name} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: color.hex, border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 0 12px ${color.hex}30` }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{color.name}</span>
                      <span 
                        onClick={() => handleCopy(color.name, color.hex)}
                        style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                      >
                        {copiedText === color.name ? 'COPIED!' : color.hex}
                      </span>
                    </div>
                    <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>{color.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SVG GEOMETRY DOCUMENTATION */}
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(2,2,3,0.8)', padding: '36px', clipPath: 'polygon(0% 0%, 96% 0%, 100% 16px, 100% 100%, 4% 100%, 0% calc(100% - 16px))' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.15em', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              05 // CUSTOM SVG COORDINATES
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
              
              {Object.entries(pathsDoc).map(([char, pathText]) => (
                <div key={char} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-yellow)', marginBottom: '4px', fontWeight: 'bold' }}>
                    <span>PATH: CHARACTER_{char.toUpperCase()}</span>
                    <span 
                      onClick={() => handleCopy(char, pathText)}
                      style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}
                    >
                      {copiedText === char ? 'COPIED' : 'COPY'}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {pathText}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
