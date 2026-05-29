import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Play, RotateCcw, SlidersHorizontal, Terminal, 
  Award, Type, Copy, CheckCircle, Code, Sparkles, Palette
} from 'lucide-react';

export default function LogoStyle() {
  // Brand Animation State
  const [clashed, setClashed] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [statusText, setStatusText] = useState('STATUS: IDLE');
  
  // Customizer State
  const [cursorScale, setCursorScale] = useState(1.4); // Scale multiplier
  const [verticalRise, setVerticalRise] = useState(55); // Vertical arc travel height in px
  const [clashAngle, setClashAngle] = useState(25); // Slant angle in degrees

  // Physics Control State
  const [sparkCount, setSparkCount] = useState(180);
  const [velocity, setVelocity] = useState(0.32); // seconds
  const [gravity, setGravity] = useState(0.15); // gravity force
  const [friction, setFriction] = useState(0.96); // air resistance

  // Copy Feedback Toast State
  const [toast, setToast] = useState({ visible: false, title: '', desc: '' });
  const [activeCodeTab, setActiveCodeTab] = useState('clash-cursors');

  // Canvas Refs for Spark Physics
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shockwaveRef = useRef(null);
  const impactFlareRef = useRef(null);
  const animationFrameIdRef = useRef(null);

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

  // 12 columns x 17 rows programmatically mapped for the classic retro cursor (image_0aeeab.png)
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

  // Particle Class for ultra-realistic metal sparks
  class Spark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const speedMultiplier = isSlowMo ? 0.22 : 1.0;
      
      // Real physics: wider spread along horizontal clash plane
      const angle = (Math.random() - 0.5) * Math.PI * 1.6; // directional fan
      const force = Math.random() * 11 + 2;
      
      this.vx = Math.cos(angle) * force * speedMultiplier * (Math.random() > 0.5 ? 1 : -1);
      this.vy = Math.sin(angle) * force * speedMultiplier - (Math.random() * 3); // upward explosion bias
      this.size = Math.random() * 2.5 + 0.8;
      this.color = color;
      this.alpha = 1;
      
      // Embers cool down at varying rates
      this.decay = (Math.random() * 0.012 + 0.008) * (isSlowMo ? 0.35 : 1.0);
      this.drag = friction; // dynamic air friction
      this.sway = (Math.random() - 0.5) * 0.3; // thermal sway
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += gravity; // Gravity pull
      this.vx += this.sway; // Wind drift simulation
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      
      // Dynamic stretch based on velocity (makes sparks look fast!)
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 1.8, this.y - this.vy * 1.8);
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.stroke();
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Radial Impact Glow Flare
  class ImpactFlare {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.alpha = 1.0;
      this.decay = isSlowMo ? 0.02 : 0.06;
    }
    update() {
      this.alpha = Math.max(0, this.alpha - this.decay);
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      const gradient = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, 65);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.15, 'rgba(245, 158, 11, 0.9)'); // Gold center
      gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.4)'); // Crimson ring
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Shockwave expansion ring
  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.alpha = 1;
      this.maxRadius = 140;
      this.growth = isSlowMo ? 2.2 : 6.0;
    }

    update() {
      this.radius += this.growth;
      this.alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#F59E0B';
      ctx.stroke();
      ctx.restore();
    }
  }

  // Canvas Resize Handler
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Main Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Impact Glow Flare
      const flare = impactFlareRef.current;
      if (flare) {
        flare.update();
        flare.draw(ctx);
        if (flare.alpha <= 0) impactFlareRef.current = null;
      }

      // Render Active Sparks
      particlesRef.current.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });

      // Render Active Shockwave
      const sw = shockwaveRef.current;
      if (sw) {
        sw.update();
        sw.draw(ctx);
        if (sw.alpha <= 0) shockwaveRef.current = null;
      }

      animationFrameIdRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gravity, isSlowMo, friction]);

  // Trigger Clash Animation Sequence
  const triggerClash = () => {
    setClashed(false);
    particlesRef.current = [];
    shockwaveRef.current = null;
    impactFlareRef.current = null;
    setStatusText('STATUS: IN MOTION');

    setTimeout(() => {
      setClashed(true);
      const actualDuration = isSlowMo ? velocity * 3.5 : velocity;

      // Exact midpoint impact moment trigger
      setTimeout(() => {
        setStatusText('STATUS: COLLISION IMPACT');

        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // Impact Flash
          impactFlareRef.current = new ImpactFlare(centerX, centerY);

          // Realistic dual metal grinding sparks
          const sps = [];
          for (let i = 0; i < sparkCount; i++) {
            const isBlue = i % 2 === 0;
            const color = isBlue 
              ? (Math.random() > 0.35 ? '#22D3EE' : '#FFFFFF') // Cyan solver sparks
              : (Math.random() > 0.35 ? '#FB7185' : '#F59E0B'); // Red opponent sparks
            sps.push(new Spark(centerX, centerY, color));
          }
          particlesRef.current = sps;

          // Expand ring shockwave
          shockwaveRef.current = new Shockwave(centerX, centerY);
        }

        setTimeout(() => {
          setStatusText('STATUS: CLASH DONE');
        }, 600);

      }, actualDuration * 1000);

    }, 45);
  };

  const resetTimeline = () => {
    setClashed(false);
    particlesRef.current = [];
    shockwaveRef.current = null;
    impactFlareRef.current = null;
    setStatusText('STATUS: IDLE');
  };

  const triggerToast = (title, desc) => {
    setToast({ visible: true, title, desc });
    setTimeout(() => setToast({ visible: false, title: '', desc: '' }), 3000);
  };

  const handleCopyText = (text, typeLabel) => {
    navigator.clipboard.writeText(text);
    triggerToast('Copied Successfully', `${typeLabel} code copied to your clipboard.`);
  };

  // Render Programmatic 8-bit Gold Trophy from matrix array
  const render8BitTrophySVG = (sizeClass = "w-24 h-24 sm:w-28 sm:h-28") => {
    return (
      <svg 
        className={`${sizeClass} text-amber-500 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]`} 
        viewBox="0 0 14 13" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {retroTrophyGrid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            if (cell === 0) return null;
            let fill = "#F59E0B"; // Solar gold
            if (cell === 1) fill = "#D97706"; // Outline amber-600
            if (cell === 3) fill = "#FEF08A"; // Dynamic solar yellow highlight
            if (cell === 4) fill = "#92400E"; // Shaded darker gold
            if (cell === 5) fill = "#0F172A"; // Inside dark background offset
            return (
              <rect 
                key={`trophy-${rIdx}-${cIdx}`} 
                x={cIdx} 
                y={rIdx} 
                width="1" 
                height="1" 
                fill={fill} 
                stroke={fill}
                strokeWidth="0.05"
              />
            );
          })
        )}
      </svg>
    );
  };

  // Render Programmatic 8-bit Cursors modeled after image_0aeeab.png
  const render8BitCursorSVG = (type = 'cyan', mirrored = false) => {
    return (
      <svg 
        className="w-full h-full" 
        viewBox="0 0 12 17" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {classicCursorGrid.map((row, rIdx) => {
          // Mirror columns for Left Cursor to point up-right beautifully
          const currentRow = mirrored ? [...row].reverse() : row;
          return currentRow.map((cell, cIdx) => {
            if (cell === 0) return null;
            
            let fill = "#22D3EE"; // Default Cyan
            if (type === 'cyan') {
              if (cell === 1) fill = "#083344"; // Dark outline
              if (cell === 2) fill = "#22D3EE"; // Core fill
              if (cell === 3) fill = "#FFFFFF"; // Retro white specular highlight
            } else {
              // Red/Rose Theme
              if (cell === 1) fill = "#450a0a"; // Dark outline
              if (cell === 2) fill = "#F43F5E"; // Core fill
              if (cell === 3) fill = "#FFFFFF"; // Retro white specular highlight
            }

            return (
              <rect 
                key={`cursor-${type}-${rIdx}-${cIdx}`} 
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

  // High Fidelity clean copy codes for JSX integration
  const copyCodes = {
    'clash-cursors': `import React from 'react';

// Symmetrical 12x17 Classic Retro Cursors (image_0aeeab.png Matrix Map)
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

export const Retro8BitCursor = ({ type = 'cyan', mirrored = false, className = "w-12 h-16" }) => {
  return (
    <svg 
      className={\`\${className} filter drop-shadow-[0_0_12px_rgba(\${type === 'cyan' ? '34,211,238,0.8' : '244,63,94,0.8'})]\`}
      viewBox="0 0 12 17" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {classicCursorGrid.map((row, rIdx) => {
        const currentRow = mirrored ? [...row].reverse() : row;
        return currentRow.map((cell, cIdx) => {
          if (cell === 0) return null;
          let fill = "#22D3EE";
          if (type === 'cyan') {
            if (cell === 1) fill = "#083344";
            if (cell === 2) fill = "#22D3EE";
            if (cell === 3) fill = "#FFFFFF";
          } else {
            if (cell === 1) fill = "#450a0a";
            if (cell === 2) fill = "#F43F5E";
            if (cell === 3) fill = "#FFFFFF";
          }
          return (
            <rect 
              key={\`pixel-\${rIdx}-\${cIdx}\`} 
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
};`,
    'retro-trophy': `import React from 'react';

// 8-Bit Pixel Art Trophy (Golden Cup Matrix Map)
const trophyMatrix = [
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

export const Retro8BitTrophy = ({ className = "w-28 h-28" }) => {
  return (
    <svg 
      className={\`\${className} text-amber-500 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]\`} 
      viewBox="0 0 14 13" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {trophyMatrix.map((row, rIdx) => 
        row.map((cell, cIdx) => {
          if (cell === 0) return null;
          let fill = "#F59E0B"; 
          if (cell === 1) fill = "#D97706"; 
          if (cell === 3) fill = "#FEF08A"; 
          if (cell === 4) fill = "#92400E"; 
          if (cell === 5) fill = "#0F172A"; 
          return (
            <rect 
              key={\`trophy-px-\${rIdx}-\${cIdx}\`} 
              x={cIdx} 
              y={rIdx} 
              width="1" 
              height="1" 
              fill={fill} 
              stroke={fill}
              strokeWidth="0.05"
            />
          );
        })
      )}
    </svg>
  );
};`,
    'realistic-spark-physics': `// Dynamic Canvas spark generator block for React impact integration
class Spark {
  constructor(x, y, color, gravityForce, frictionFactor) {
    this.x = x;
    this.y = y;
    const angle = (Math.random() - 0.5) * Math.PI * 1.6;
    const force = Math.random() * 11 + 2;
    
    this.vx = Math.cos(angle) * force;
    this.vy = Math.sin(angle) * force - 2;
    this.size = Math.random() * 2.5 + 0.8;
    this.color = color;
    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;
    this.drag = frictionFactor; // Air friction (typically 0.96)
    this.gravity = gravityForce; // Gravity pull (typically 0.15)
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
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.5) {
      // Draw dynamic streak paths
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 1.8, this.y - this.vy * 1.8);
      ctx.lineWidth = this.size;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.restore();
  }
}`
  };

  const actualDuration = isSlowMo ? velocity * 3.5 : velocity;

  return (
    <div className="text-slate-100 bg-[#020617] min-h-screen flex flex-col bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,23,42,0.65),rgba(2,6,23,1))]">
      
      {/* Background patterns */}
      <style>{`
        .bg-grid-panel {
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .scanlines-frame::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          z-index: 10;
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .bounce-trophy {
          animation: subtle-bounce 2.5s infinite ease-in-out;
        }
        .cursor-neon-blue {
          filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.85));
        }
        .cursor-neon-red {
          filter: drop-shadow(0 0 16px rgba(244, 63, 94, 0.85));
        }
      `}</style>

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 via-violet-600 to-rose-500 p-[2px] shadow-lg">
              <div className="bg-slate-950 h-full w-full rounded-[6px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">
                A//C
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider text-white flex items-center gap-2">
                ALGOCLASH <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono tracking-normal">ANIMATION ENGINE v3</span>
              </h1>
              <p className="text-xs text-slate-400">Perfect Tip-to-Tip Contact Cursors &amp; Enhanced Spark Physics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#branding-spec" className="text-xs font-semibold px-4 py-2 text-slate-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-900 transition">
              View Code
            </a>
            <button 
              onClick={triggerClash} 
              className="text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-rose-500 hover:from-cyan-400 hover:to-rose-400 text-white rounded-lg shadow-lg hover:shadow-rose-500/20 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300 animate-pulse" /> TRIGGER CLASH
            </button>
          </div>
        </div>
      </header>

      {/* Clipboard Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300">
          <div className="bg-slate-900 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="p-1 rounded-full bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{toast.title}</p>
              <p className="text-xs text-slate-400">{toast.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* VIEWPORT PANEL (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visual Arena Frame */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden scanlines-frame bg-grid-panel shadow-2xl aspect-video w-full flex items-center justify-center p-8">
            
            {/* Real Physics Spark Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            {/* Radiant glow filters */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.25)_0%,transparent_75%)] pointer-events-none z-0" />

            {/* Arena Viewport Contents Wrapper */}
            <div className="relative w-full h-full flex flex-col items-center justify-between py-6 z-20 select-none">
              
              {/* TOP CROWN/TROPHY SLOT */}
              <div 
                className={`flex flex-col items-center transition-all duration-1000 ease-out ${
                  clashed && statusText === 'STATUS: CLASH DONE' 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 -translate-y-6 scale-90'
                }`}
              >
                <div className="relative flex items-center justify-center bounce-trophy">
                  <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full w-28 h-28" />
                  {render8BitTrophySVG()}
                </div>
              </div>

              {/* CORE CLASH ELEMENT (100% Symmetrical Geometry - image_0aeeab.png alignment) */}
              <div className="relative w-full h-24 flex items-center">
                
                {/* Visual horizontal guide path */}
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800/40 to-transparent pointer-events-none" />

                {/* Left Blue 8-Bit Solver Cursor (Facing up-right) */}
                <div 
                  style={{
                    left: clashed ? '50%' : '10%',
                    top: clashed ? '50%' : '58%',
                    transform: clashed 
                      ? `translate(-100%, -50%) translateY(-${verticalRise}px)` 
                      : 'translate(-100%, -50%)',
                    transition: `left ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}, top ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}, transform ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}`
                  }}
                  className="absolute z-30"
                >
                  <div 
                    style={{ 
                      transform: clashed ? `scale(${cursorScale}) rotate(${clashAngle}deg)` : `scale(${cursorScale}) rotate(12deg)`,
                      transformOrigin: 'right top',
                      transition: `transform ${actualDuration}s ease`,
                      width: '42px',
                      height: '59px'
                    }}
                    className="relative text-cyan-400 cursor-neon-blue flex-shrink-0"
                  >
                    {render8BitCursorSVG('cyan', true)}
                  </div>
                </div>

                {/* Right Red 8-Bit Opponent Cursor (Facing up-left) */}
                <div 
                  style={{
                    left: clashed ? '50%' : '90%',
                    top: clashed ? '50%' : '58%',
                    transform: clashed 
                      ? `translate(0%, -50%) translateY(-${verticalRise}px)` 
                      : 'translate(0%, -50%)',
                    transition: `left ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}, top ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}, transform ${actualDuration}s ${clashed ? 'cubic-bezier(0.19, 1, 0.22, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'}`
                  }}
                  className="absolute z-30"
                >
                  <div 
                    style={{ 
                      transform: clashed ? `scale(${cursorScale}) rotate(${-clashAngle}deg)` : `scale(${cursorScale}) rotate(-12deg)`,
                      transformOrigin: 'left top',
                      transition: `transform ${actualDuration}s ease`,
                      width: '42px',
                      height: '59px'
                    }}
                    className="relative text-rose-500 cursor-neon-red flex-shrink-0"
                  >
                    {render8BitCursorSVG('red', false)}
                  </div>
                </div>

              </div>

              {/* Pure visual tagline Motto at bottom */}
              <div className="flex flex-col items-center mt-4">
                <span className="text-[11px] sm:text-xs tracking-[0.6em] text-slate-400 font-extrabold uppercase italic">
                  CODE. CLASH. CONQUER.
                </span>
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-rose-500 to-transparent mt-2" />
              </div>

            </div>

            {/* Bottom active tag tracker */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 opacity-40">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] mono tracking-wider text-slate-300">SYSTEM_READY</span>
            </div>

            {/* Top right state readout */}
            <div className="absolute top-4 right-4 z-20 opacity-55">
              <span className="text-[9px] sm:text-xs font-semibold mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                {statusText}
              </span>
            </div>

          </div>

          {/* Interactive parameter modifiers */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" /> Motion &amp; Path Customizers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Slanting path configuration controls */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Vertical Rise (Slanting Arc Height)</span>
                  <span className="mono text-cyan-400 font-bold">{verticalRise}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="120" 
                  value={verticalRise} 
                  onChange={(e) => setVerticalRise(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
                <p className="text-[10px] text-slate-500">Determines how much the cursors travel vertically upwards during their clashing approach path.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Clash Slant Angle</span>
                  <span className="mono text-rose-400 font-bold">{clashAngle}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="65" 
                  value={clashAngle} 
                  onChange={(e) => setClashAngle(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
                <p className="text-[10px] text-slate-500">Adjusts the slant angle of the two cursors as their tips collide at the impact center point.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">8-Bit Cursor Scale</span>
                  <span className="mono text-cyan-400 font-bold">x{cursorScale.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="220" 
                  value={cursorScale * 100} 
                  onChange={(e) => setCursorScale(Number(e.target.value) / 100)} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
                <p className="text-[10px] text-slate-500">Scale dimensions of cursors inside the visual frame.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Collision Velocity</span>
                  <span className="mono text-rose-400 font-bold">{velocity.toFixed(2)}s</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="120" 
                  value={velocity * 100} 
                  onChange={(e) => setVelocity(Number(e.target.value) / 100)} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
                <p className="text-[10px] text-slate-500">Arrival duration from boundaries to center impact point.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Friction (Air Resistance)</span>
                  <span className="mono text-yellow-400 font-bold">{friction.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="900" 
                  max="995" 
                  value={friction * 1000} 
                  onChange={(e) => setFriction(Number(e.target.value) / 1000)} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                />
                <p className="text-[10px] text-slate-500">Air friction acting on sparks. Lower values result in explosive, fast-stopping sparks.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Downward Gravity Weight</span>
                  <span className="mono text-indigo-400 font-bold">{gravity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="45" 
                  value={gravity * 100} 
                  onChange={(e) => setGravity(Number(e.target.value) / 100)} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
                <p className="text-[10px] text-slate-500">Gravitational pull bringing the sparks downward over time.</p>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Total Particle Spark Density</span>
                  <span className="mono text-emerald-400 font-bold">{sparkCount} embers</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="350" 
                  value={sparkCount} 
                  onChange={(e) => setSparkCount(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>

            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-5">
              <button 
                onClick={triggerClash} 
                className="flex-1 min-w-[120px] py-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 shadow"
              >
                <Play className="w-4 h-4 text-cyan-400" /> RUN CLASH ANIMATION
              </button>
              <button 
                onClick={resetTimeline} 
                className="flex-1 min-w-[120px] py-3 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-xl border border-slate-800/60 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" /> RESET COORDS
              </button>
              <button 
                onClick={() => setIsSlowMo(!isSlowMo)} 
                className={`flex-1 min-w-[140px] py-3 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 ${
                  isSlowMo 
                    ? 'bg-rose-500 text-slate-950 font-bold shadow-lg' 
                    : 'bg-slate-950 hover:bg-rose-950/20 text-rose-500 border border-rose-950/30'
                }`}
              >
                <Sparkles className="w-4 h-4" /> SLOW MOTION: {isSlowMo ? 'ON' : 'OFF'}
              </button>
            </div>

          </div>

        </section>

        {/* BRADING INFO PANEL (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Concept Rationale */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-extrabold text-white text-base mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-500" /> The Clash Moat
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "Because I'm not submitting to a leaderboard. I'm watching my opponent's cursor jump to line 47 while my screen is turning red. That's not a test. That's combat."
            </p>
            <ul className="text-xs text-slate-400 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span><strong>Retro Symmetrical 8-Bit Cursors:</strong> Modeled explicitly after image_0aeeab.png with accurate outline and highlights.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span><strong>Impact Pivot Lock:</strong> Rotation origins are anchored on cursor tips so they stay perfectly joined during slanting angles.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>The Tagline Motto:</strong> Programmed directly with the official brand blueprint: <span className="mono text-rose-400 font-bold">Code. Clash. Conquer.</span></span>
              </li>
            </ul>
          </div>

          {/* Core branding Color tokens */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Core Brand Tokens
            </h3>
            <div className="grid grid-cols-1 gap-3">
              
              {/* Cyan */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#06B6D4] shadow-[0_0_15px_rgba(6,182,212,0.4)] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Logic Cyan</p>
                    <p className="text-[10px] mono text-slate-500">#06B6D4</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopyText('#06B6D4', 'Logic Cyan')} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Crimson */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#F43F5E] shadow-[0_0_15px_rgba(244,63,94,0.4)] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Combat Rose</p>
                    <p className="text-[10px] mono text-slate-500">#F43F5E</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopyText('#F43F5E', 'Combat Rose')} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Void Backing */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#020617] border border-slate-800 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Void Background</p>
                    <p className="text-[10px] mono text-slate-500">#020617</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopyText('#020617', 'Void Background')} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Typography Token Display */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" /> System Font Spec
            </h3>
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800/80 pb-3">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Motto Tagline</p>
                <p className="text-md font-black italic text-white tracking-widest">Plus Jakarta Sans (ExtraBold)</p>
                <p className="text-[11px] text-slate-400 mt-1">Code. Clash. Conquer.</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Diagnostics &amp; Parameters</p>
                <p className="text-xs font-bold mono text-cyan-400">JetBrains Mono (Bold)</p>
                <p className="text-[11px] text-slate-400 mt-1">Console logs, timers, status flags, and sliders.</p>
              </div>
            </div>
          </div>

        </aside>

      </main>

      {/* COMPONENT BLUEPRINTS EXPORTER SECTION */}
      <section id="branding-spec" className="max-w-7xl mx-auto px-4 py-8 w-full border-t border-slate-800/80 mt-8">
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 sm:p-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Code className="text-rose-500 w-7 h-7" /> Visual Vector Source Codes (JSX)
              </h2>
              <p className="text-xs text-slate-400 mt-1">Ready-to-use React codes for the 8-bit clashing cursors and pixel cup trophy.</p>
            </div>
            
            {/* Tab navigation */}
            <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-800 self-start lg:self-auto flex-wrap gap-1">
              <button 
                onClick={() => setActiveCodeTab('clash-cursors')} 
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeCodeTab === 'clash-cursors' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                8-Bit Cursors (JSX)
              </button>
              <button 
                onClick={() => setActiveCodeTab('retro-trophy')} 
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeCodeTab === 'retro-trophy' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                8-Bit Trophy (JSX)
              </button>
              <button 
                onClick={() => setActiveCodeTab('realistic-spark-physics')} 
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeCodeTab === 'realistic-spark-physics' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Realistic Spark Physics (JS)
              </button>
            </div>
          </div>

          {/* Active Tab rendering */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Visual Vector Preview Slot */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950 p-8 rounded-xl border border-slate-800/85">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-10 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-16 text-cyan-400 cursor-neon-blue">
                      {render8BitCursorSVG('cyan', true)}
                    </div>
                    <span className="text-[10px] text-cyan-400 mono font-bold tracking-widest">SOLVER_A</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-16 text-rose-500 cursor-neon-red">
                      {render8BitCursorSVG('red', false)}
                    </div>
                    <span className="text-[10px] text-rose-500 mono font-bold tracking-widest">OPPONENT_B</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold tracking-[0.2em] text-slate-500 mono">8BIT_OPPOSITE_CURSORS</span>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 mono tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> 
                  {activeCodeTab === 'clash-cursors' && 'Retro8BitCursors.jsx'}
                  {activeCodeTab === 'retro-trophy' && 'Retro8BitTrophy.jsx'}
                  {activeCodeTab === 'realistic-spark-physics' && 'SparkPhysics.js'}
                </span>
                <button 
                  onClick={() => handleCopyText(copyCodes[activeCodeTab], activeCodeTab)} 
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Component Code
                </button>
              </div>
              <textarea 
                readOnly 
                value={copyCodes[activeCodeTab]}
                className="w-full h-72 bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] mono text-slate-300 selection:bg-slate-800 resize-none outline-none focus:ring-1 focus:ring-rose-500/20"
              />
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="mono">ALGOCLASH BRAND SYSTEM // SECURED BUILD</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition cursor-pointer">Vite App Shell</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Canvas Engine</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition cursor-pointer">April 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
