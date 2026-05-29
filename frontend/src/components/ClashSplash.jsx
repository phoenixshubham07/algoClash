import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from './CyberButton';

export const ClashSplash = ({ onFinish }) => {
  const [phase, setPhase] = useState('initial'); // 'initial' | 'gloves_approach' | 'gloves_impact' | 'gloves_retreat' | 'cursors_approach' | 'cursors_impact' | 'hero_morph'
  
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

  // Spark particle physics (highly metallic, lingering welding sparks with ballistic arcs)
  class Spark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      
      const angle = (Math.random() - 0.5) * Math.PI * 1.8;
      const speed = Math.random() * 16 + 8; // high speed
      
      this.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
      this.vy = Math.sin(angle) * speed - 4; // initial upward velocity
      this.size = Math.random() * 2.5 + 1.2;
      
      // Welding spark colors: yellow, gold, orange, red-orange, white
      const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF4500', '#FFFFFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      this.alpha = 1;
      this.decay = Math.random() * 0.035 + 0.02; // quick decay
      this.drag = 0.96; // allow them to fly far
      this.gravity = 0.28; // high gravity for beautiful arc
      
      this.history = [{ x: this.x, y: this.y }];
      this.maxHistory = 6;
    }

    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.history.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.lineTo(this.x, this.y);
      
      ctx.lineWidth = this.size;
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.stroke();
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

  // Lock scrolling and hide mouse cursor on body initially
  useEffect(() => {
    const isHero = phase === 'hero_morph';
    if (!isHero) {
      document.body.classList.add('hide-custom-cursor');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('hide-custom-cursor');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.classList.remove('hide-custom-cursor');
      document.body.style.overflow = 'unset';
    };
  }, [phase]);

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

  const triggerSparks = (x, y) => {
    const sps = [];
    for (let i = 0; i < 40; i++) {
      sps.push(new Spark(x, y));
    }
    particlesRef.current = sps;
  };

  const triggerClash = () => {
    setPhase('initial');
    particlesRef.current = [];
    shockwaveRef.current = null;
    flareRef.current = null;

    // 1. Gloves start approaching at 600ms
    addTimeout(() => {
      setPhase('gloves_approach');

      // 2. Gloves clash at 920ms (600ms + 320ms velocity)
      addTimeout(() => {
        setPhase('gloves_impact');
        
        // Spawn sparks and shockwave
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        flareRef.current = new Flare(centerX, centerY);
        shockwaveRef.current = new Shockwave(centerX, centerY);
        triggerSparks(centerX, centerY);

        // 3. Gloves retreat and fade out at 1320ms
        addTimeout(() => {
          setPhase('gloves_retreat');

          // 4. Cursors start approaching at 1820ms
          addTimeout(() => {
            setPhase('cursors_approach');

            // 5. Cursors clash at 2220ms
            addTimeout(() => {
              setPhase('cursors_impact');
              
              // Spawn sparks and shockwave again!
              flareRef.current = new Flare(centerX, centerY);
              shockwaveRef.current = new Shockwave(centerX, centerY);
              triggerSparks(centerX, centerY);

              // 6. Morph to hero and unlock viewport at 2720ms
              addTimeout(() => {
                setPhase('hero_morph');
              }, 500);

            }, 400);
          }, 500);
        }, 400);
      }, 320);
    }, 600);
  };

  const handleReplay = () => {
    clearAllTimeouts();
    triggerClash();
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

  const renderGlove = (type = 'cyan', mirrored = false) => {
    // 12 columns x 14 rows retro boxing glove
    const gloveGrid = [
      [0,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,1,2,2,2,2,2,1,0,0,0],
      [0,1,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,3,2,2,2,2,2,1,0,0],
      [1,2,2,3,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,1,1,1,1,0],
      [1,2,2,2,2,2,1,2,2,2,1,0],
      [0,1,2,2,2,1,2,3,2,1,0,0],
      [0,0,1,2,2,1,2,2,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,4,4,4,1,0,0,0],
      [0,0,0,0,1,4,4,4,1,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,0]
    ];

    return (
      <svg 
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 12 14" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {gloveGrid.map((row, rIdx) => {
          const currentRow = mirrored ? [...row].reverse() : row;
          return currentRow.map((cell, cIdx) => {
            if (cell === 0) return null;
            
            let fill = "#00f2fe"; 
            if (type === 'cyan') {
              if (cell === 1) fill = "#083344"; // Dark outline
              if (cell === 2) fill = "#00f2fe"; // Cyan body
              if (cell === 3) fill = "#FFFFFF"; // White highlight
              if (cell === 4) fill = "#38bdf8"; // Cuff cyan
            } else {
              if (cell === 1) fill = "#450a0a"; // Dark outline
              if (cell === 2) fill = "#f43f5e"; // Crimson body
              if (cell === 3) fill = "#FFFFFF"; // White highlight
              if (cell === 4) fill = "#fb7185"; // Cuff crimson
            }

            return (
              <rect 
                key={`pixel-glove-${type}-${rIdx}-${cIdx}`} 
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

  // Glove coordinates and styles based on phase
  let leftGloveLeft = '5%';
  let leftGloveOpacity = 0;
  if (phase === 'gloves_approach' || phase === 'gloves_impact') {
    leftGloveLeft = '50%';
    leftGloveOpacity = 1;
  } else if (phase === 'gloves_retreat') {
    leftGloveLeft = '5%';
    leftGloveOpacity = 0;
  }

  const leftGloveStyle = {
    position: 'absolute',
    zIndex: 20,
    left: leftGloveLeft,
    top: '50%',
    transform: 'translate(-100%, -50%) scale(2.2)',
    transformOrigin: 'right top',
    opacity: leftGloveOpacity,
    transition: 'left 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.32s ease',
    filter: 'drop-shadow(0 0 12px var(--accent-cyan))',
    pointerEvents: 'none'
  };

  let rightGloveLeft = '95%';
  let rightGloveOpacity = 0;
  if (phase === 'gloves_approach' || phase === 'gloves_impact') {
    rightGloveLeft = '50%';
    rightGloveOpacity = 1;
  } else if (phase === 'gloves_retreat') {
    rightGloveLeft = '95%';
    rightGloveOpacity = 0;
  }

  const rightGloveStyle = {
    position: 'absolute',
    zIndex: 20,
    left: rightGloveLeft,
    top: '50%',
    transform: 'translate(0%, -50%) scale(2.2)',
    transformOrigin: 'left top',
    opacity: rightGloveOpacity,
    transition: 'left 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.32s ease',
    filter: 'drop-shadow(0 0 12px var(--accent-crimson))',
    pointerEvents: 'none'
  };

  // Cursor coordinates and styles based on phase
  let leftCursorLeft = '5%';
  let leftCursorTop = '50%';
  let leftCursorTransform = 'translate(-100%, -50%) scale(2.2)';
  let leftCursorOpacity = 0;

  if (phase === 'cursors_approach') {
    leftCursorLeft = '50%';
    leftCursorOpacity = 1;
  } else if (phase === 'cursors_impact') {
    leftCursorLeft = '50%';
    leftCursorOpacity = 1;
  } else if (phase === 'hero_morph') {
    leftCursorLeft = 'calc(50% - 4px)';
    leftCursorTop = 'calc(50% - 92px)';
    leftCursorTransform = 'translate(-100%, -50%) scale(1.0)';
    leftCursorOpacity = 1;
  }

  const leftCursorStyle = {
    position: 'absolute',
    zIndex: 20,
    left: leftCursorLeft,
    top: leftCursorTop,
    transform: leftCursorTransform,
    transformOrigin: 'right top',
    opacity: leftCursorOpacity,
    transition: 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), top 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease',
    filter: 'drop-shadow(0 0 12px var(--accent-cyan))'
  };

  let rightCursorLeft = '95%';
  let rightCursorTop = '50%';
  let rightCursorTransform = 'translate(0%, -50%) scale(2.2)';
  let rightCursorOpacity = 0;

  if (phase === 'cursors_approach') {
    rightCursorLeft = '50%';
    rightCursorOpacity = 1;
  } else if (phase === 'cursors_impact') {
    rightCursorLeft = '50%';
    rightCursorOpacity = 1;
  } else if (phase === 'hero_morph') {
    rightCursorLeft = 'calc(50% + 4px)';
    rightCursorTop = 'calc(50% - 92px)';
    rightCursorTransform = 'translate(0%, -50%) scale(1.0)';
    rightCursorOpacity = 1;
  }

  const rightCursorStyle = {
    position: 'absolute',
    zIndex: 20,
    left: rightCursorLeft,
    top: rightCursorTop,
    transform: rightCursorTransform,
    transformOrigin: 'left top',
    opacity: rightCursorOpacity,
    transition: 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), top 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease',
    filter: 'drop-shadow(0 0 12px var(--accent-crimson))'
  };

  const showTrophy = phase === 'hero_morph';

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
        {/* Left Cyan Glove Container */}
        <div style={leftGloveStyle}>
          <div style={{ animation: phase === 'gloves_approach' ? 'cursor-float-left 4s ease-in-out infinite' : 'none' }}>
            <div style={{ width: '51px', height: '59px' }}>
              {renderGlove('cyan', true)}
            </div>
          </div>
        </div>

        {/* Right Crimson Glove Container */}
        <div style={rightGloveStyle}>
          <div style={{ animation: phase === 'gloves_approach' ? 'cursor-float-right 4s ease-in-out infinite' : 'none' }}>
            <div style={{ width: '51px', height: '59px' }}>
              {renderGlove('red', false)}
            </div>
          </div>
        </div>

        {/* Left Cyan Cursor Container */}
        <div style={leftCursorStyle}>
          <div style={{ animation: phase === 'cursors_approach' ? 'cursor-float-left 4s ease-in-out infinite' : 'none' }}>
            <div 
              style={{
                transform: `rotate(${clashAngle}deg)`,
                transformOrigin: 'right top',
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
        <div style={rightCursorStyle}>
          <div style={{ animation: phase === 'cursors_approach' ? 'cursor-float-right 4s ease-in-out infinite' : 'none' }}>
            <div 
              style={{
                transform: `rotate(${-clashAngle}deg)`,
                transformOrigin: 'left top',
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
        body.hide-custom-cursor {
          cursor: none !important;
        }
        body.hide-custom-cursor * {
          cursor: none !important;
        }
        body.hide-custom-cursor [style*="z-index: 100000"] {
          display: none !important;
        }
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