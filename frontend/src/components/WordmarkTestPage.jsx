import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberButton } from './CyberButton';

export const WordmarkTestPage = () => {
  const [activeBackdrop, setActiveBackdrop] = useState('grid');
  const [showGuides, setShowGuides] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [triggerKey, setTriggerKey] = useState(0); // to re-trigger entrance animations on click

  const handleCopyCode = (id, codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefreshAnimations = () => {
    setTriggerKey(prev => prev + 1);
  };

  // 6 Premium Vector-Based Redesigns of the CLASH wordmark
  const wordmarks = [
    {
      id: 'sharp_official',
      name: '01 // Refined Sharp Vector (Official)',
      desc: 'Sleek white upright lowercase Space Grotesk algo, glowing crimson option separator with asymmetrical spacing, and bold skewed cyan custom vector CLASH.',
      renderClash: (letterVariants, pathVariants) => (
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          color: 'var(--accent-cyan)',
          filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
          transform: 'skewX(-18deg)',
          marginLeft: '0.04em'
        }}>
          <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
            <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
            <motion.path custom={2} variants={pathVariants} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
            <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
            <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
          </svg>
        </span>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  {/* Left Sleek Skewed Cyan Bracket */}
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo: lowercase upright Space Grotesk */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span 
        key={\`algo-\${idx}\`}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 + (3 - idx) * 0.05 }}
        style={{ display: 'inline-block' }}
      >
        {char}
      </motion.span>
    ))}
  </span>

  {/* Crimson Red Option Separator skewed at -18deg with corrected spacing */}
  <motion.span 
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
  >
    ⌥
  </motion.span>

  {/* CLASH: Custom Razor-Sharp Vector font - skewed at -18deg */}
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
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
    </svg>
  </motion.span>

  {/* Right Sleek Skewed Cyan Bracket */}
  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    },
    {
      id: 'sharp_hacker_at',
      name: '02 // Sharp Hacker @ (Crimson Red)',
      desc: 'Substituting the letter A with our custom-designed geometric crimson @ symbol inside the razor-sharp vector font.',
      renderClash: (letterVariants, pathVariants) => (
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          color: 'var(--accent-cyan)',
          filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
          transform: 'skewX(-18deg)',
          marginLeft: '0.04em'
        }}>
          <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
            <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
            
            {/* Crimson Red @ symbol */}
            <motion.path 
              custom={2} 
              variants={pathVariants} 
              d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" 
              fill="var(--accent-crimson)" 
              style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
            />
            <motion.rect 
              custom={2} 
              variants={pathVariants} 
              x="108" 
              y="16" 
              width="8" 
              height="12" 
              fill="var(--accent-crimson)" 
              style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
            />

            <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
            <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
          </svg>
        </span>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontFamily: "'Space Grotesk', sans-serif" }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span key={idx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (3 - idx) * 0.05 }} style={{ display: 'inline-block' }}>
        {char}
      </motion.span>
    ))}
  </span>

  {/* Option separator with corrected spacing */}
  <motion.span 
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
  >
    ⌥
  </motion.span>

  {/* CL@SH Hacker Vector */}
  <motion.span 
    initial={{ opacity: 0, x: -15 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))', transform: 'skewX(-18deg)', marginLeft: '0.04em' }}
  >
    <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
      
      {/* Red @ path */}
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />
      <motion.rect initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} x="108" y="16" width="8" height="12" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />

      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
      <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
    </svg>
  </motion.span>

  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    },
    {
      id: 'sharp_tokyo_katakana',
      name: '03 // Sharp Neo-Tokyo (Katakana Official)',
      desc: 'Perfect baseline centered Japanese Katakana subtitle (クラッシュ) positioned centered underneath the clean vector CLASH.',
      renderClash: (letterVariants, pathVariants) => (
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'var(--accent-cyan)',
            filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
            transform: 'skewX(-18deg)',
            marginLeft: '0.04em'
          }}>
            <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              <motion.path custom={2} variants={pathVariants} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
              <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ 
              fontSize: '11px', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </motion.span>
        </div>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontFamily: "'Space Grotesk', sans-serif" }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span key={idx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (3 - idx) * 0.05 }} style={{ display: 'inline-block' }}>
        {char}
      </motion.span>
    ))}
  </span>

  <motion.span 
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
  >
    ⌥
  </motion.span>

  {/* CLASH Vector + Japanese Subtitle absolutely centered underneath */}
  <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
    <motion.span 
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))', transform: 'skewX(-18deg)', marginLeft: '0.04em' }}
    >
      <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
      </svg>
    </motion.span>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      style={{ 
        fontSize: '11px', 
        fontWeight: 800,
        letterSpacing: '0.65em', 
        color: 'var(--accent-crimson)', 
        textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
        fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase',
        display: 'inline-block',
        transform: 'skewX(-18deg) translateX(-50%)',
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        whiteSpace: 'nowrap'
      }}
    >
      クラッシュ
    </motion.span>
  </div>

  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    },
    {
      id: 'sharp_hacker_katakana',
      name: '04 // Sharp Hacker @ + Katakana Combo',
      desc: 'Double hacker-tokyo synthesis: red @ substituted vector CL@SH and centered Japanese Katakana subtitle centered underneath.',
      renderClash: (letterVariants, pathVariants) => (
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'var(--accent-cyan)',
            filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
            transform: 'skewX(-18deg)',
            marginLeft: '0.04em'
          }}>
            <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              
              {/* Crimson Red @ */}
              <motion.path 
                custom={2} 
                variants={pathVariants} 
                d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />
              <motion.rect 
                custom={2} 
                variants={pathVariants} 
                x="108" 
                y="16" 
                width="8" 
                height="12" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />

              <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ 
              fontSize: '11px', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </motion.span>
        </div>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontFamily: "'Space Grotesk', sans-serif" }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span key={idx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (3 - idx) * 0.05 }} style={{ display: 'inline-block' }}>
        {char}
      </motion.span>
    ))}
  </span>

  <motion.span 
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
  >
    ⌥
  </motion.span>

  {/* CL@SH Hacker + Japanese Subtitle absolutely centered underneath */}
  <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
    <motion.span 
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))', transform: 'skewX(-18deg)', marginLeft: '0.04em' }}
    >
      <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
        
        {/* Red @ path */}
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />
        <motion.rect initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} x="108" y="16" width="8" height="12" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />

        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
      </svg>
    </motion.span>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      style={{ 
        fontSize: '11px', 
        fontWeight: 800,
        letterSpacing: '0.65em', 
        color: 'var(--accent-crimson)', 
        textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
        fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase',
        display: 'inline-block',
        transform: 'skewX(-18deg) translateX(-50%)',
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        whiteSpace: 'nowrap'
      }}
    >
      クラッシュ
    </motion.span>
  </div>

  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    },
    {
      id: 'sharp_vector_option',
      name: '05 // Custom Vector SVG Option Separator (Our Idea)',
      desc: 'Replaces the Unicode glyph with a mathematically perfect vector SVG Option symbol matching the stroke weight of our typeface.',
      customOptionSymbol: () => (
        <motion.span
          initial={{ opacity: 0, scale: 0, skewX: -18 }}
          animate={{ opacity: 1, scale: 1, skewX: -18 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
          style={{ 
            display: 'inline-block',
            marginLeft: '0.12em', 
            marginRight: '0.24em',
            verticalAlign: 'middle',
            lineHeight: 1
          }}
        >
          <svg 
            width="28" 
            height="46" 
            viewBox="0 0 28 46" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              display: 'block',
              color: 'var(--accent-crimson)',
              filter: 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.65))'
            }}
          >
            <path d="M 14 5 L 28 5" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
            <path d="M 0 41 L 10 41 L 20 5" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </motion.span>
      ),
      renderClash: (letterVariants, pathVariants) => (
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'var(--accent-cyan)',
            filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
            transform: 'skewX(-18deg)',
            marginLeft: '0.04em'
          }}>
            <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              
              {/* Crimson Red @ */}
              <motion.path 
                custom={2} 
                variants={pathVariants} 
                d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />
              <motion.rect 
                custom={2} 
                variants={pathVariants} 
                x="108" 
                y="16" 
                width="8" 
                height="12" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />

              <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ 
              fontSize: '11px', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </motion.span>
        </div>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontFamily: "'Space Grotesk', sans-serif" }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span key={idx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (3 - idx) * 0.05 }} style={{ display: 'inline-block' }}>
        {char}
      </motion.span>
    ))}
  </span>

  {/* Precise custom-designed inline SVG Option separator - eliminates unicode font spacing quirks */}
  <motion.span
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '0.12em', marginRight: '0.24em', verticalAlign: 'middle', lineHeight: 1 }}
  >
    <svg width="28" height="46" viewBox="0 0 28 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', color: 'var(--accent-crimson)', filter: 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.65))' }}>
      <path d="M 14 5 L 28 5" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
      <path d="M 0 41 L 10 41 L 20 5" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  </motion.span>

  {/* CL@SH Hacker with Japanese subtitle */}
  <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
    <motion.span 
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))', transform: 'skewX(-18deg)', marginLeft: '0.04em' }}
    >
      <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
      </svg>
    </motion.span>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      style={{ 
        fontSize: '11px', 
        fontWeight: 800,
        letterSpacing: '0.65em', 
        color: 'var(--accent-crimson)', 
        textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
        fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase',
        display: 'inline-block',
        transform: 'skewX(-18deg) translateX(-50%)',
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        whiteSpace: 'nowrap'
      }}
    >
      クラッシュ
    </motion.span>
  </div>

  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    },
    {
      id: 'sharp_laser_slice',
      name: '06 // Laser-Sliced Cyber-Rail (Permutation)',
      desc: 'Active horizontal crimson cyber-laser rail slicing cleanly through the custom red-@ vector CL@SH with Katakana subtitle.',
      renderClash: (letterVariants, pathVariants) => (
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'var(--accent-cyan)',
            filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.65))',
            transform: 'skewX(-18deg)',
            marginLeft: '0.04em',
            position: 'relative'
          }}>
            <svg width="224" height="46" viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <motion.path custom={0} variants={pathVariants} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <motion.path custom={1} variants={pathVariants} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              
              {/* Crimson Red @ */}
              <motion.path 
                custom={2} 
                variants={pathVariants} 
                d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />
              <motion.rect 
                custom={2} 
                variants={pathVariants} 
                x="108" 
                y="16" 
                width="8" 
                height="12" 
                fill="var(--accent-crimson)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))' }}
              />

              <motion.path custom={3} variants={pathVariants} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <motion.path custom={4} variants={pathVariants} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
            
            {/* Glowing Laser Rail slicing through the middle */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '-10px',
                right: '-10px',
                top: '23px',
                height: '2px',
                backgroundColor: 'var(--accent-crimson)',
                boxShadow: '0 0 8px var(--accent-crimson), 0 0 16px var(--accent-crimson)',
                transformOrigin: 'left center',
                zIndex: 5
              }}
            />
          </span>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ 
              fontSize: '11px', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </motion.span>
        </div>
      ),
      code: `<div 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontFamily: "'Space Grotesk', sans-serif", 
    fontSize: '64px', 
    fontWeight: 900, 
    color: '#fff', 
    userSelect: 'none', 
    position: 'relative',
    padding: '24px 0'
  }}
>
  <motion.span 
    initial={{ opacity: 0, x: 95, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &lt;
  </motion.span>

  {/* algo */}
  <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontFamily: "'Space Grotesk', sans-serif" }}>
    {'algo'.split('').map((char, idx) => (
      <motion.span key={idx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (3 - idx) * 0.05 }} style={{ display: 'inline-block' }}>
        {char}
      </motion.span>
    ))}
  </span>

  <motion.span 
    initial={{ opacity: 0, scale: 0, skewX: -18 }}
    animate={{ opacity: 1, scale: 1, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 120, delay: 0.05 }}
    style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
  >
    ⌥
  </motion.span>

  {/* CL@SH Hacker with Japanese subtitle and Glowing laser slice */}
  <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
    <motion.span 
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))', transform: 'skewX(-18deg)', marginLeft: '0.04em', position: 'relative' }}
    >
      <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
        
        {/* Red @ path */}
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 32 L 116 32 L 116 10 L 104 10 L 104 36 L 128 36 L 128 46 L 100 46 Z" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />
        <motion.rect initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} x="108" y="16" width="8" height="12" fill="var(--accent-crimson)" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }} />

        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
        <motion.path initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
      </svg>

      {/* Laser active slicing line */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ position: 'absolute', left: '-10px', right: '-10px', top: '23px', height: '2px', backgroundColor: 'var(--accent-crimson)', boxShadow: '0 0 8px var(--accent-crimson), 0 0 16px var(--accent-crimson)', transformOrigin: 'left center', zIndex: 5 }}
      />
    </motion.span>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      style={{ 
        fontSize: '11px', 
        fontWeight: 800,
        letterSpacing: '0.65em', 
        color: 'var(--accent-crimson)', 
        textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
        fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase',
        display: 'inline-block',
        transform: 'skewX(-18deg) translateX(-50%)',
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        whiteSpace: 'nowrap'
      }}
    >
      クラッシュ
    </motion.span>
  </div>

  <motion.span 
    initial={{ opacity: 0, x: -160, skewX: -18 }}
    animate={{ opacity: 1, x: 0, skewX: -18 }}
    transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
    style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
  >
    &gt;
  </motion.span>
</div>`
    }
  ];

  // Motion variants for letter-by-letter staggering reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
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
        delay: 0.2 + customIndex * 0.08
      }
    })
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.9, skewX: -18 },
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

  const algoVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.9, skewX: 0 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      skewX: 0,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 12
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#020203', color: '#f8fafc', overflow: 'hidden', padding: '40px 5%' }}>
      {/* Background Decal Layers */}
      {activeBackdrop === 'grid' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(3, 3, 4, 0.98) 40%, rgba(0, 0, 0, 1) 100%), linear-gradient(90deg, rgba(0, 242, 254, 0.007) 1px, transparent 1px), linear-gradient(rgba(244, 63, 94, 0.007) 1px, transparent 1px)', backgroundSize: '100% 100%, 48px 48px, 48px 48px', opacity: 0.95, pointerEvents: 'none' }}></div>
      )}
      {activeBackdrop === 'dots' && (
        <div className="bg-micro-dot" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.12, pointerEvents: 'none' }}></div>
      )}
      {activeBackdrop === 'scanlines' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%)', backgroundSize: '100% 4px', opacity: 0.45 }}></div>
      )}

      {/* Symmetrical Guides Overlays */}
      {showGuides && (
        <>
          <div style={{ position: 'fixed', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255, 63, 94, 0.18)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'fixed', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255, 63, 94, 0.18)', zIndex: 2, pointerEvents: 'none' }} />
        </>
      )}

      {/* TOP HEADER CONTROLS */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto 48px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span> LOGO variations
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            [ STAGING // UPRIGHT SIMPLE algo + 6 REDESIGNED CLASH VARIATIONS // SPACING FIXED ]
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Refresh entry animations */}
          <button 
            onClick={handleRefreshAnimations}
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔄 RE-PLAY INTROS
          </button>

          {/* Guides Toggle */}
          <button 
            onClick={() => setShowGuides(!showGuides)}
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              border: `1px solid ${showGuides ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.15)'}`,
              color: showGuides ? 'var(--accent-yellow)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {showGuides ? 'ALIGNMENT GUIDES: ON' : 'ALIGNMENT GUIDES: OFF'}
          </button>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

          {/* Backdrop switches */}
          <div style={{ display: 'flex', gap: '6px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
            <button onClick={() => setActiveBackdrop('grid')} style={{ padding: '4px 8px', backgroundColor: activeBackdrop === 'grid' ? 'var(--accent-cyan)' : 'transparent', color: activeBackdrop === 'grid' ? '#000' : '#fff', border: '1px solid var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>GRID</button>
            <button onClick={() => setActiveBackdrop('dots')} style={{ padding: '4px 8px', backgroundColor: activeBackdrop === 'dots' ? 'var(--accent-cyan)' : 'transparent', color: activeBackdrop === 'dots' ? '#000' : '#fff', border: '1px solid var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>DOTS</button>
            <button onClick={() => setActiveBackdrop('scanlines')} style={{ padding: '4px 8px', backgroundColor: activeBackdrop === 'scanlines' ? 'var(--accent-cyan)' : 'transparent', color: activeBackdrop === 'scanlines' ? '#000' : '#fff', border: '1px solid var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>SCANLINES</button>
            <button onClick={() => setActiveBackdrop('obsidian')} style={{ padding: '4px 8px', backgroundColor: activeBackdrop === 'obsidian' ? 'var(--accent-cyan)' : 'transparent', color: activeBackdrop === 'obsidian' ? '#000' : '#fff', border: '1px solid var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>OBSIDIAN</button>
          </div>

          <a href="/" style={{ textDecoration: 'none' }}>
            <CyberButton variant="ghost" size="sm">
              BACK TO LANDING
            </CyberButton>
          </a>
        </div>
      </div>

      {/* WORDMARKS SECTIONS */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={triggerKey}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}
        >
          {wordmarks.map((wm, index) => {
            const algoLetters = 'algo'.split('');
            const isFirst = index === 0;
            
            // Dynamic width offset values to ensure perfect collapsed meeting points per variation width
            let xLeftOffset = 95;
            let xRightOffset = -160;
            if (wm.id === 'clash_terminal') xRightOffset = -175;
            if (wm.id === 'clash_chassis') xRightOffset = -175;
            
            return (
              <div 
                key={wm.id}
                style={{ 
                  border: isFirst ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
                  boxShadow: isFirst ? '0 0 24px rgba(0, 242, 254, 0.08)' : 'none',
                  backgroundColor: 'rgba(2,2,3,0.75)', 
                  backdropFilter: 'blur(8px)', 
                  padding: '24px 32px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px', 
                  position: 'relative',
                  clipPath: 'polygon(0% 0%, 97% 0%, 100% 12px, 100% 100%, 3% 100%, 0% calc(100% - 12px))'
                }}
              >
                {/* Header decs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: isFirst ? 'var(--accent-yellow)' : 'var(--accent-cyan)', fontWeight: 'bold' }}>
                      {isFirst ? '👑 OFFICIAL LOGO DESIGN (SPACING FIXED)' : wm.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>{wm.desc}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleCopyCode(wm.id, wm.code)}
                    style={{ 
                      padding: '6px 16px', 
                      backgroundColor: 'transparent', 
                      border: isFirst ? '1px solid var(--accent-yellow)' : '1px solid rgba(255,255,255,0.15)', 
                      color: isFirst ? 'var(--accent-yellow)' : 'var(--text-primary)', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '9px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s' 
                    }}
                  >
                    {copiedId === wm.id ? 'CODE COPIED!' : 'COPY JSX WORDMARK'}
                  </button>
                </div>

                {/* Staggered Upright-algo Entry Wordmark Arena */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px' }}>
                  
                  <motion.div 
                    variants={containerVariants}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontFamily: "'Space Grotesk', sans-serif", 
                      fontSize: 'clamp(24px, 5vw, 64px)', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      color: '#fff', 
                      userSelect: 'none', 
                      position: 'relative', 
                      padding: '24px 48px',
                      letterSpacing: '0'
                    }}
                  >
                    {/* Left Sleek Skewed Cyan Bracket - slide left */}
                    <motion.span 
                      initial={{ opacity: 0, x: xLeftOffset, skewX: -18 }}
                      animate={{ opacity: 1, x: 0, skewX: -18 }}
                      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
                      style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
                    >
                      &lt;
                    </motion.span>

                    {/* algo: lowercase, upright, Space Grotesk font style */}
                    <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
                      {algoLetters.map((char, idx) => (
                        <motion.span 
                          key={`algo-${wm.id}-${idx}`}
                          variants={algoVariants}
                          transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 + (3 - idx) * 0.05 }}
                          style={{ display: 'inline-block' }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>

                    {/* Crimson Red Option Separator (Custom Vector inline SVG support & corrected spacing margins) */}
                    {wm.customOptionSymbol ? (
                      wm.customOptionSymbol()
                    ) : (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0, skewX: -18 }}
                        animate={{ opacity: 1, scale: 1, skewX: -18 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
                        style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
                      >
                        ⌥
                      </motion.span>
                    )}

                    {/* Redesigned CLASH Word block */}
                    {wm.renderClash(letterVariants, pathVariants)}

                    {/* Right Sleek Skewed Cyan Bracket - slide right */}
                    <motion.span 
                      initial={{ opacity: 0, x: xRightOffset, skewX: -18 }}
                      animate={{ opacity: 1, x: 0, skewX: -18 }}
                      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
                      style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
                    >
                      &gt;
                    </motion.span>
                  </motion.div>

                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
