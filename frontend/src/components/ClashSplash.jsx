import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from './CyberButton';

export const ClashSplash = ({ onFinish }) => {
  const [clashed, setClashed] = useState(false);
  const [frameTrophy, setFrameTrophy] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);
  
  const canvasRef = useRef(null);
  const cursorContainerRef = useRef(null);
  const particlesRef = useRef([]);
  const shockwaveRef = useRef(null);
  const flareRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // 18-degree slant parameters
  const clashAngle = 18;
  const cursorScale = 1.6;
  const verticalRise = 45; // px
  const velocity = 0.32; // approach duration in seconds

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

  // Timeout manager to prevent overlapping/stacked timers
  const timeoutsRef = useRef([]);
  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Spark particle physics (highly metallic, lingering, quick-decaying sparks)
  class Spark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = (Math.random() - 0.5) * Math.PI * 1.8;
      const force = Math.random() * 12 + 6; // high initial velocity
      
      this.vx = Math.cos(angle) * force * (Math.random() > 0.5 ? 1 : -1);
      this.vy = Math.sin(angle) * force - 2;
      this.size = Math.random() * 2.2 + 0.8;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.04 + 0.03; // burns out quickly
      this.drag = 0.86; // high drag makes them decelerate and linger at clash point
      this.gravity = 0.015; // very light gravity so they float/hover rather than falling like rain
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 1.4, this.y - this.vy * 1.4);
        ctx.lineWidth = this.size * 3.2;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.35;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 1.4, this.y - this.vy * 1.4);
        ctx.lineWidth = this.size;
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = this.alpha;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.35;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Shockwave ring
  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.alpha = 1;
      this.maxRadius = 140;
      this.growth = 5.2;
    }
    update() {
      this.radius += this.growth;
      this.alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.lineWidth = 5.0;
      ctx.strokeStyle = '#ffd700'; // Accent yellow glow
      ctx.globalAlpha = this.alpha * 0.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.globalAlpha = this.alpha;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Impact flare
  class Flare {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.alpha = 1.0;
      this.decay = 0.05;
    }
    update() {
      this.alpha = Math.max(0, this.alpha - this.decay);
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      const gradient = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, 75);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.95)');
      gradient.addColorStop(0.6, 'rgba(244, 63, 94, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Auto-run clashing intro on mount after brief initial buffer
  useEffect(() => {
    clearAllTimeouts();
    addTimeout(() => {
      triggerClash();
    }, 600);

    return () => clearAllTimeouts();
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (flareRef.current) {
        flareRef.current.update();
        flareRef.current.draw(ctx);
        if (flareRef.current.alpha <= 0) flareRef.current = null;
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.update();
        p.draw(ctx);
        return p.alpha > 0;
      });

      if (shockwaveRef.current) {
        shockwaveRef.current.update();
        shockwaveRef.current.draw(ctx);
        if (shockwaveRef.current.alpha <= 0) shockwaveRef.current = null;
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const triggerClash = () => {
    setClashed(false);
    setFrameTrophy(false);
    setShowTrophy(false);
    particlesRef.current = [];
    shockwaveRef.current = null;
    flareRef.current = null;

    addTimeout(() => {
      setClashed(true);

      // Symmetrical clash impact trigger after approach velocity completes (320ms)
      addTimeout(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        flareRef.current = new Flare(centerX, centerY);

        // Sparks
        const sps = [];
        for (let i = 0; i < 24; i++) {
          const isCyan = i % 2 === 0;
          const color = isCyan 
            ? (Math.random() > 0.35 ? '#00f2fe' : '#FFFFFF')
            : (Math.random() > 0.35 ? '#f43f5e' : '#ffd700');
          sps.push(new Spark(centerX, centerY, color));
        }
        particlesRef.current = sps;

        shockwaveRef.current = new Shockwave(centerX, centerY);

        // Frame the golden trophy in the center (50ms after clash impact)
        addTimeout(() => {
          setFrameTrophy(true);
        }, 50);

        // Morph cursors to hero and reveal stenciled wordmark after 1800ms of trophy focus
        addTimeout(() => {
          setShowTrophy(true);
        }, 1800);

      }, velocity * 1000);
    }, 45);
  };

  const handleReplay = () => {
    clearAllTimeouts();
    setClashed(false);
    setFrameTrophy(false);
    setShowTrophy(false);
    particlesRef.current = [];
    shockwaveRef.current = null;
    flareRef.current = null;

    addTimeout(() => {
      triggerClash();
    }, 600);
  };

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

  const renderCursor = (type = 'cyan', mirrored = false) => {
    return (
      <svg 
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 12 17" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {classicCursorGrid.map((row, rIdx) => {
          const currentRow = mirrored ? [...row].reverse() : row;
          return currentRow.map((cell, cIdx) => {
            if (cell === 0) return null;
            
            let fill = "#00f2fe"; 
            if (type === 'cyan') {
              if (cell === 1) fill = "#083344";
              if (cell === 2) fill = "#00f2fe";
              if (cell === 3) fill = "#FFFFFF";
            } else {
              if (cell === 1) fill = "#450a0a";
              if (cell === 2) fill = "#f43f5e";
              if (cell === 3) fill = "#FFFFFF";
            }

            return (
              <rect 
                key={`pixel-${type}-${rIdx}-${cIdx}`} 
                x={cIdx} 
                y={rIdx} 
                width="1" 
                height="1" 
                fill={fill} 
                stroke={fill}
                strokeWidth="0.05"
              />
            );
          });
        })}
      </svg>
    );
  };

  let leftLeft = '5%';
  let leftTop = '50%';
  let leftTransform = 'translate(-100%, -50%) scale(2.2)';

  if (clashed) {
    if (showTrophy) {
      leftLeft = 'calc(50% - 4px)';
      leftTop = 'calc(50% - 92px)';
      leftTransform = 'translate(-100%, -50%) scale(1.0)';
    } else if (frameTrophy) {
      leftLeft = 'calc(50% - 70px)';
      leftTop = '50%';
      leftTransform = 'translate(-100%, -50%) scale(2.2)';
    } else {
      leftLeft = '50%';
      leftTop = '50%';
      leftTransform = 'translate(-100%, -50%) scale(2.2)';
    }
  }

  const leftStyle = {
    position: 'absolute',
    zIndex: 20,
    left: leftLeft,
    top: leftTop,
    transform: leftTransform,
    transformOrigin: 'right top',
    transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    filter: 'drop-shadow(0 0 12px var(--accent-cyan))'
  };

  let rightLeft = '95%';
  let rightTop = '50%';
  let rightTransform = 'translate(0%, -50%) scale(2.2)';

  if (clashed) {
    if (showTrophy) {
      rightLeft = 'calc(50% + 4px)';
      rightTop = 'calc(50% - 92px)';
      rightTransform = 'translate(0%, -50%) scale(1.0)';
    } else if (frameTrophy) {
      rightLeft = 'calc(50% + 70px)';
      rightTop = '50%';
      rightTransform = 'translate(0%, -50%) scale(2.2)';
    } else {
      rightLeft = '50%';
      rightTop = '50%';
      rightTransform = 'translate(0%, -50%) scale(2.2)';
    }
  }

  const rightStyle = {
    position: 'absolute',
    zIndex: 20,
    left: rightLeft,
    top: rightTop,
    transform: rightTransform,
    transformOrigin: 'left top',
    transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    filter: 'drop-shadow(0 0 12px var(--accent-crimson))'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#000000', display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none', fontFamily: 'var(--font-mono)' }}>
      {/* BACKGROUND GRAPHICS & TEXTURES */}
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      {/* HEADER / NAVIGATION BAR REPLICA (Initially hidden, fades in with hero) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={showTrophy ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 5%',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: 'rgba(2,2,3,0.92)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Small 18-degree mini clashing icon */}
          <div style={{ display: 'flex', gap: '2px', height: '18px', width: '26px' }}>
            <div style={{ transform: 'rotate(18deg) scale(0.65)', transformOrigin: 'right top' }}>{renderCursor('cyan', true)}</div>
            <div style={{ transform: 'rotate(-18deg) scale(0.65)', transformOrigin: 'left top' }}>{renderCursor('crimson', false)}</div>
          </div>
          <span className="font-display" style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '0.2em', color: '#fff' }}>
            ALGO<span style={{ color: 'var(--accent-cyan)' }}>CLASH</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '10px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em', cursor: 'default' }}>01 // IDENTITY</span>
          <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em', cursor: 'default' }}>02 // ANTI_CHEAT</span>
          <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em', cursor: 'default' }}>03 // INGAME_HUD</span>
          <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em', cursor: 'default' }}>04 // COMBAT</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <CyberButton variant="ghost" size="sm">
            LOG IN
          </CyberButton>
          <CyberButton variant="primary" size="sm">
            LAUNCH SIMULATOR
          </CyberButton>
        </div>
      </motion.header>

      {/* Decorative Grid Coordinates Decals (Initially hidden, fade in with hero) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={showTrophy ? { opacity: 0.5, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ position: 'absolute', top: '100px', left: '20px', fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', zIndex: 10 }}
      >
        [SEC: PRIVATE_SANDBOX // MUM_NODE_03]
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={showTrophy ? { opacity: 0.5, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ position: 'absolute', top: '100px', right: '20px', fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', zIndex: 10 }}
      >
        [S/N: 4275EV17EN // MODEL: COMBAT_UNIT]
      </motion.div>

      {/* Canvas spark physics */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }} />

      {/* CENTER CLASH AREA / HERO SECTION REPLICA */}
      <section 
        id="logo-fold"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '60px 5%',
          textAlign: 'center',
          width: '100%',
          margin: '0 auto',
          flex: 1
        }}
      >
        {/* Left Cyan Cursor Container */}
        <div style={leftStyle}>
          <div style={{ animation: clashed ? 'none' : 'cursor-float-left 4s ease-in-out infinite' }}>
            <div 
              style={{
                transform: clashed ? `rotate(${clashAngle}deg)` : `rotate(12deg)`,
                transformOrigin: 'right top',
                transition: 'transform 0.32s ease',
                width: '36px', height: '51px'
              }}
            >
              <div style={{ width: '100%', height: '100%', animation: 'cursor-flicker 2s infinite' }}>
                {renderCursor('cyan', true)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Crimson Cursor Container */}
        <div style={rightStyle}>
          <div style={{ animation: clashed ? 'none' : 'cursor-float-right 4s ease-in-out infinite' }}>
            <div 
              style={{
                transform: clashed ? `rotate(${-clashAngle}deg)` : `rotate(-12deg)`,
                transformOrigin: 'left top',
                transition: 'transform 0.32s ease',
                width: '36px', height: '51px'
              }}
            >
              <div style={{ width: '100%', height: '100%', animation: 'cursor-flicker-crimson 2.2s infinite' }}>
                {renderCursor('red', false)}
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle 來未 (Initially hidden, fades in with hero above the wordmark) */}
        <div style={{ position: 'absolute', left: '50%', top: 'calc(50% - 64px)', transform: 'translateX(-50%)', zIndex: 14, whiteSpace: 'nowrap' }}>
          <motion.h2 
            initial={{ opacity: 0, y: -8 }}
            animate={showTrophy ? { opacity: 0.8, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-display" 
            style={{ 
              fontSize: '10px', 
              letterSpacing: '0.45em', 
              fontWeight: 'bold', 
              color: 'var(--accent-yellow)', 
              textTransform: 'uppercase', 
              textShadow: '0 0 8px rgba(255,215,0,0.25)',
              margin: 0
            }}
          >
            來未 // FUTURE DIGITAL DUELS
          </motion.h2>
        </div>

        {/* OFFICIAL STENCILED OPTION WORDMARK WITH EXPANSION ANIMATION */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, whiteSpace: 'nowrap' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={showTrophy ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontFamily: "'Space Grotesk', sans-serif", 
              fontSize: 'clamp(32px, 6.5vw, 68px)', 
              fontWeight: 900, 
              color: '#fff', 
              userSelect: 'none', 
              padding: '24px 0',
              filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.05))'
            }}
          >
            {/* Left Sleek Skewed Bracket */}
            <motion.span 
              initial={{ opacity: 0, x: 95, skewX: -18 }}
              animate={showTrophy ? { opacity: 1, x: 0, skewX: -18 } : { opacity: 0, x: 95, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginRight: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
            >
              &lt;
            </motion.span>

            {/* algo (lowercase) simple upright Space Grotesk */}
            <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
              {'algo'.split('').map((char, idx) => (
                <motion.span 
                  key={`algo-${idx}`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={showTrophy ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 + (3 - idx) * 0.05 }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>

            {/* Red Option Separator skewed at 18-deg */}
            <motion.span 
              initial={{ opacity: 0, scale: 0, skewX: -18 }}
              animate={showTrophy ? { opacity: 1, scale: 1, skewX: -18 } : { opacity: 0, scale: 0, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.05 }}
              style={{ display: 'inline-block', marginLeft: '-0.02em', marginRight: '0.12em', color: 'var(--accent-crimson)', textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' }}
            >
              ⌥
            </motion.span>

            {/* CLASH with Katakana subtitle */}
            <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
              <motion.span 
                initial={{ opacity: 0, x: -15 }}
                animate={showTrophy ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
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
                  <path d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
                  <path d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
                  <path d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
                  <path d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
                  <path d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
                </svg>
              </motion.span>
              
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={showTrophy ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
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

            {/* Right Sleek Skewed Bracket */}
            <motion.span 
              initial={{ opacity: 0, x: -160, skewX: -18 }}
              animate={showTrophy ? { opacity: 1, x: 0, skewX: -18 } : { opacity: 0, x: -160, skewX: -18 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
              style={{ display: 'inline-block', color: 'var(--accent-cyan)', marginLeft: '8px', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}
            >
              &gt;
            </motion.span>
          </motion.div>
        </div>

        {/* Tagline (Initially hidden, fades in below the wordmark) */}
        <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 72px)', transform: 'translateX(-50%)', zIndex: 10, whiteSpace: 'nowrap' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={showTrophy ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-cyan)' }}></span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: '900',
                letterSpacing: '0.4em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                fontStyle: 'italic'
              }}>
                code.clash.conquer.
              </span>
              <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-crimson)' }}></span>
            </div>
            
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.25em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginTop: '4px'
            }}>
              [ LOGS // CODING IS NOT AN EXAM. IT'S A 1V1 DUEL ]
            </span>
            
            <div style={{ height: '2px', width: '80px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', marginTop: '8px' }}></div>
          </motion.div>
        </div>

        {/* 8-Bit Gold Trophy (appears at center on impact, fades on morph) */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 18, pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={
              showTrophy 
                ? { opacity: 0, scale: 0 } 
                : (frameTrophy ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 })
            }
            transition={{ 
              type: 'spring', 
              stiffness: 140, 
              damping: 10,
              opacity: { duration: 0.2 }
            }}
            className={frameTrophy && !showTrophy ? 'bounce-trophy' : ''}
          >
            {renderTrophySVG(112)}
          </motion.div>
        </div>

        {/* Action Buttons (Initially hidden, fade in below tagline) */}
        <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 154px)', transform: 'translateX(-50%)', zIndex: 10 }}>
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={showTrophy ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ 
              display: 'flex', 
              gap: '16px'
            }}
          >
            <CyberButton variant="primary" size="lg" onClick={onFinish}>
              ENTER THE BATTLEFIELD
            </CyberButton>
            <CyberButton variant="warning" size="lg" onClick={handleReplay}>
              REPLAY INTRO
            </CyberButton>
          </motion.div>
        </div>

        {/* Mouse Indicator (Initially hidden, fades in at bottom) */}
        <div style={{ position: 'absolute', left: '50%', bottom: '40px', transform: 'translateX(-50%)', zIndex: 10 }}>
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={showTrophy ? { opacity: 0.65, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '12px'
            }}
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
        </div>
      </section>

      {/* Styling specific override inside component scope */}
      <style>{`
        :root {
          --accent-cyan: #00f2fe;
          --accent-crimson: #f43f5e;
          --accent-yellow: #ffd700;
        }
        @keyframes splash-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes splash-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes bounce-trophy {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        .bounce-trophy {
          animation: bounce-trophy 2.5s ease-in-out infinite;
        }
        @keyframes cursor-float-left {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cursor-float-right {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes cursor-flicker {
          0%, 100% { opacity: 1; transform: translate(0, 0); }
          5% { opacity: 0.85; transform: translate(-1px, 1px); }
          10% { opacity: 1; transform: translate(0, 0); }
          15% { opacity: 0.9; transform: translate(1px, -1px); }
          25% { opacity: 1; transform: translate(0, 0); }
          50% { opacity: 0.8; transform: translate(-2px, 0); }
          55% { opacity: 1; transform: translate(0, 0); }
          75% { opacity: 0.95; transform: translate(1px, 1px); }
          80% { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes cursor-flicker-crimson {
          0%, 100% { opacity: 1; transform: translate(0, 0); }
          8% { opacity: 0.8; transform: translate(1px, -1px); }
          12% { opacity: 1; transform: translate(0, 0); }
          20% { opacity: 0.9; transform: translate(-1px, 1px); }
          30% { opacity: 1; transform: translate(0, 0); }
          60% { opacity: 0.85; transform: translate(0, -2px); }
          65% { opacity: 1; transform: translate(0, 0); }
          70% { opacity: 0.9; transform: translate(-1px, -1px); }
          75% { opacity: 1; transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};