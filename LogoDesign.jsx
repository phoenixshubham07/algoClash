import React, { useState, useEffect, useRef } from 'react';
import { 
  SlidersHorizontal, Terminal, Award, Type, Copy, 
  CheckCircle, Code, Palette, ChevronRight, Eye, Square, Layout,
  Zap, Play, RotateCcw
} from 'lucide-react';

export default function App() {
  // Brand Animation State
  const [clashed, setClashed] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [statusText, setStatusText] = useState('STATUS: IDLE');

  // Physics Control State
  const [sparkCount, setSparkCount] = useState(180);
  const [velocity, setVelocity] = useState(0.32); // seconds
  const [gravity, setGravity] = useState(0.15); // gravity force
  const [friction, setFriction] = useState(0.96); // air resistance

  // Canvas Refs for Spark Physics
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shockwaveRef = useRef(null);
  const impactFlareRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Brand Configuration States
  const [markType, setMarkType] = useState('cursors'); // 'cursors' | 'trophy' | 'none'
  const [layoutStyle, setLayoutStyle] = useState('stacked'); // 'stacked' | 'inline'
  const [clashCase, setClashCase] = useState('uppercase'); // 'lowercase' | 'uppercase'
  const [algoWeight, setAlgoWeight] = useState('400'); // 300 | 400 | 500 | 700
  const [clashWeight, setClashWeight] = useState('700'); // 300 | 400 | 500 | 700
  
  // Custom "Clash Box" Containment States
  const [clashBoxStyle, setClashBoxStyle] = useState('cyber-outline'); // 'solid' | 'cyber-outline' | 'brackets' | 'none'
  const [boxPaddingX, setBoxPaddingX] = useState(16); // px
  const [boxPaddingY, setBoxPaddingY] = useState(6); // px
  const [boxRadius, setBoxRadius] = useState(8); // px
  const [boxBorderWidth, setBoxBorderWidth] = useState(1.5); // px
  const [boxOpacity, setBoxOpacity] = useState(10); // % opacity for background fills

  // Sizing & Metric States
  const [brandSize, setBrandSize] = useState(48); // px
  const [letterSpacingBrand, setLetterSpacingBrand] = useState(-3); // % of em
  const [cursorScale, setCursorScale] = useState(1.4); // scale factor
  const [cursorAngle, setCursorAngle] = useState(15); // slanting rotation degrees
  const [cursorGap, setCursorGap] = useState(0); // offset spacing between cursor tips
  const [taglineSize, setTaglineSize] = useState(11); // px
  const [letterSpacingTagline, setLetterSpacingTagline] = useState(8); // px
  const [taglineSeparator, setTaglineSeparator] = useState(' ▪ '); // separator block

  // Color Tokens
  const [algoColor, setAlgoColor] = useState('#F8FAFC'); // Slate 50
  const [clashColor, setClashColor] = useState('#F43F5E'); // Rose 500
  const [boxColor, setBoxColor] = useState('#F43F5E'); // Box borders/fills
  const [taglineColor, setTaglineColor] = useState('#94A3B8'); // Slate 400
  const [glowIntensity, setGlowIntensity] = useState(15); // blur px

  // UI Control States
  const [showGrid, setShowGrid] = useState(true);
  const [activeCodeTab, setActiveCodeTab] = useState('react-component');
  const [toast, setToast] = useState({ visible: false, title: '', desc: '' });

  // Particle Class for ultra-realistic metal sparks
  class Spark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const speedMultiplier = isSlowMo ? 0.22 : 1.0;
      
      const angle = (Math.random() - 0.5) * Math.PI * 1.6;
      const force = Math.random() * 11 + 2;
      
      this.vx = Math.cos(angle) * force * speedMultiplier * (Math.random() > 0.5 ? 1 : -1);
      this.vy = Math.sin(angle) * force * speedMultiplier - (Math.random() * 3);
      this.size = Math.random() * 2.5 + 0.8;
      this.color = color;
      this.alpha = 1;
      
      this.decay = (Math.random() * 0.012 + 0.008) * (isSlowMo ? 0.35 : 1.0);
      this.drag = friction;
      this.sway = (Math.random() - 0.5) * 0.3;
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += gravity;
      this.vx += this.sway;
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
      gradient.addColorStop(0.15, 'rgba(245, 158, 11, 0.9)');
      gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.4)');
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

      const flare = impactFlareRef.current;
      if (flare) {
        flare.update();
        flare.draw(ctx);
        if (flare.alpha <= 0) impactFlareRef.current = null;
      }

      particlesRef.current.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });

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

      setTimeout(() => {
        setStatusText('STATUS: COLLISION IMPACT');

        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          impactFlareRef.current = new ImpactFlare(centerX, centerY);

          const sps = [];
          for (let i = 0; i < sparkCount; i++) {
            const isBlue = i % 2 === 0;
            const color = isBlue 
              ? (Math.random() > 0.35 ? '#22D3EE' : '#FFFFFF')
              : (Math.random() > 0.35 ? '#FB7185' : '#F59E0B');
            sps.push(new Spark(centerX, centerY, color));
          }
          particlesRef.current = sps;

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

  // 12 columns x 17 rows classic retro cursor matrix (image_0aeeab.png)
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

  // Apply visual preset themes
  const applyPreset = (presetName) => {
    switch (presetName) {
      case 'cyber-boxed-rose':
        setLayoutStyle('stacked');
        setClashBoxStyle('cyber-outline');
        setClashCase('uppercase');
        setAlgoWeight('400');
        setClashWeight('700');
        setBoxPaddingX(20);
        setBoxPaddingY(6);
        setBoxRadius(8);
        setBoxBorderWidth(1.5);
        setCursorScale(1.5);
        setCursorAngle(15);
        setCursorGap(0);
        setLetterSpacingBrand(-3);
        setGlowIntensity(15);
        setAlgoColor('#F8FAFC');
        setClashColor('#F43F5E');
        setBoxColor('#F43F5E');
        break;
      case 'terminal-bracket':
        setLayoutStyle('stacked');
        setClashBoxStyle('brackets');
        setClashCase('uppercase');
        setAlgoWeight('300');
        setClashWeight('700');
        setCursorScale(1.3);
        setCursorAngle(12);
        setCursorGap(2);
        setLetterSpacingBrand(-2);
        setGlowIntensity(10);
        setAlgoColor('#FFFFFF');
        setClashColor('#22D3EE');
        setBoxColor('#22D3EE');
        break;
      case 'solid-brutalist':
        setLayoutStyle('inline');
        setClashBoxStyle('solid');
        setClashCase('uppercase');
        setAlgoWeight('700');
        setClashWeight('700');
        setBoxPaddingX(18);
        setBoxPaddingY(8);
        setBoxRadius(4);
        setBoxOpacity(100);
        setCursorScale(1.0);
        setCursorAngle(0);
        setCursorGap(4);
        setLetterSpacingBrand(1);
        setGlowIntensity(0);
        setAlgoColor('#FFFFFF');
        setClashColor('#020617'); // Dark text inside solid box
        setBoxColor('#F43F5E');
        break;
      default:
        break;
    }
    triggerToast("Preset Applied", `Loaded the "${presetName}" design parameters.`);
  };

  const triggerToast = (title, desc) => {
    setToast({ visible: true, title, desc });
    setTimeout(() => setToast({ visible: false, title: '', desc: '' }), 3000);
  };

  const handleCopyText = (text, typeLabel) => {
    navigator.clipboard.writeText(text);
    triggerToast('Copied Successfully', `${typeLabel} code copied to your clipboard.`);
  };

  const getClashText = () => {
    if (clashCase === 'uppercase') return 'CLASH';
    return 'clash';
  };

  const getTaglineText = () => {
    return ['code', 'clash', 'conquer'].join(taglineSeparator);
  };

  // Programmatic cursor compiler
  const renderPixelCursor = (type = 'cyan', mirrored = false, inlineStyles = {}) => {
    return (
      <svg 
        style={inlineStyles}
        className="w-full h-full" 
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
              if (cell === 1) fill = "#083344"; // Outline
              if (cell === 2) fill = "#22D3EE"; // Core
              if (cell === 3) fill = "#FFFFFF"; // Highlight
            } else {
              if (cell === 1) fill = "#450a0a";
              if (cell === 2) fill = "#F43F5E";
              if (cell === 3) fill = "#FFFFFF";
            }
            return (
              <rect 
                key={`px-${type}-${rIdx}-${cIdx}`}
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

  const renderTrophySVG = (inlineStyles = {}) => {
    return (
      <svg style={inlineStyles} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
        {retroTrophyGrid.map((row, rIdx) => (
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
        ))}
      </svg>
    );
  };

  const getReactCode = () => {
    return `import React from 'react';

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

const PixelCursor = ({ type = 'cyan', mirrored = false, scale = 1.0, angle = 0, origin = 'center' }) => {
  return (
    <svg 
      style={{
        transform: \`scale(\${scale}) rotate(\${angle}deg)\`,
        transformOrigin: origin,
        width: '12px',
        height: '17px',
        filter: \`drop-shadow(0 0 8px \${type === 'cyan' ? 'rgba(34,211,238,0.45)' : 'rgba(244,63,94,0.45)'})\`
      }}
      viewBox="0 0 12 17" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {classicCursorGrid.map((row, rIdx) => {
        const currentRow = mirrored ? [...row].reverse() : row;
        return currentRow.map((cell, cIdx) => {
          if (cell === 0) return null;
          let fill = type === 'cyan' ? "#22D3EE" : "#F43F5E";
          if (cell === 1) fill = type === 'cyan' ? "#083344" : "#450a0a";
          if (cell === 3) fill = "#FFFFFF";
          return (
            <rect 
              key={\`px-\${rIdx}-\${cIdx}\`}
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

export function AlgoClashLogo() {
  const getClashText = () => "${clashCase === 'uppercase' ? 'CLASH' : 'clash'}";
  
  // Custom clash box wrapper styles
  const getClashBoxStyles = () => {
    switch ('${clashBoxStyle}') {
      case 'solid':
        return {
          backgroundColor: '${boxColor}',
          padding: '${boxPaddingY}px ${boxPaddingX}px',
          borderRadius: '${boxRadius}px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      case 'cyber-outline':
        return {
          border: '${boxBorderWidth}px solid ${boxColor}',
          backgroundColor: '${boxColor}${Math.round((boxOpacity / 100) * 255).toString(16).padStart(2, '0')}',
          padding: '${boxPaddingY}px ${boxPaddingX}px',
          borderRadius: '${boxRadius}px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 ${glowIntensity}px ${boxColor}15',
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#020617] rounded-2xl border border-slate-800/80">
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        .space-font {
          font-family: 'Space Grotesk', sans-serif;
        }
      \`}</style>

      {/* Stacked Layout Block */}
      {${layoutStyle === 'stacked' ? 'true' : 'false'} ? (
        <div className="flex flex-col items-center">
          {/* Symmetrical Clashing Cursors */}
          <div className="flex items-center justify-center h-14 mb-4 gap-[${cursorGap}px]">
            <PixelCursor type="cyan" mirrored={true} scale={${cursorScale}} angle={${cursorAngle}} origin="right top" />
            <PixelCursor type="rose" mirrored={false} scale={${cursorScale}} angle={-${cursorAngle}} origin="left top" />
          </div>

          {/* Symmetrical Text Mark */}
          <div 
            style={{ 
              letterSpacing: '${letterSpacingBrand * 0.01}em',
            }}
            className="flex items-center text-center space-font"
          >
            <span style={{ fontWeight: ${algoWeight}, color: '${algoColor}' }} className="text-4xl sm:text-5xl tracking-tighter mr-2">algo</span>
            
            {/* Embedded Clash Box wrapper */}
            {['solid', 'cyber-outline'].includes('${clashBoxStyle}') ? (
              <span style={getClashBoxStyles()} className="transition-all duration-300">
                <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter">{getClashText()}</span>
              </span>
            ) : '${clashBoxStyle}' === 'brackets' ? (
              <span className="flex items-center">
                <span style={{ color: '${boxColor}' }} className="text-4xl sm:text-5xl font-light mr-1">[</span>
                <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter">{getClashText()}</span>
                <span style={{ color: '${boxColor}' }} className="text-4xl sm:text-5xl font-light ml-1">]</span>
              </span>
            ) : (
              <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter ml-1">{getClashText()}</span>
            )}
          </div>
        </div>
      ) : (
        /* Inline Layout Block */
        <div 
          style={{ 
            letterSpacing: '${letterSpacingBrand * 0.01}em',
          }}
          className="flex items-center space-font"
        >
          <span style={{ fontWeight: ${algoWeight}, color: '${algoColor}' }} className="text-4xl sm:text-5xl tracking-tighter">algo</span>
          
          {/* Micro Symmetrical Cursors Inline */}
          <div className="flex items-center justify-center h-8 mx-4 gap-[${cursorGap}px]">
            <PixelCursor type="cyan" mirrored={true} scale={${cursorScale}} angle={${cursorAngle}} origin="right top" />
            <PixelCursor type="rose" mirrored={false} scale={${cursorScale}} angle={-${cursorAngle}} origin="left top" />
          </div>

          {/* Inline Clash box wrapper */}
          {['solid', 'cyber-outline'].includes('${clashBoxStyle}') ? (
            <span style={getClashBoxStyles()} className="transition-all duration-300">
              <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter">{getClashText()}</span>
            </span>
          ) : '${clashBoxStyle}' === 'brackets' ? (
            <span className="flex items-center">
              <span style={{ color: '${boxColor}' }} className="text-4xl sm:text-5xl font-light mr-1">[</span>
              <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter">{getClashText()}</span>
              <span style={{ color: '${boxColor}' }} className="text-4xl sm:text-5xl font-light ml-1">]</span>
            </span>
          ) : (
            <span style={{ fontWeight: ${clashWeight}, color: '${clashColor}' }} className="text-4xl sm:text-5xl tracking-tighter ml-1">{getClashText()}</span>
          )}
        </div>
      )}

      {/* Tagline Block (Strictly on a single line) */}
      <div 
        style={{ letterSpacing: '${letterSpacingTagline}px' }}
        className="mt-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 space-font border-t border-slate-900/60 pt-3 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <span style={{ color: '${taglineColor}' }}>
          {['code', 'clash', 'conquer'].join('${taglineSeparator}')}
        </span>
      </div>
    </div>
  );
}`;
  };

  // Helper method to resolve dynamic styling matching settings
  const getDynamicBoxStyles = () => {
    if (clashBoxStyle === 'solid') {
      return {
        backgroundColor: boxColor,
        padding: `${boxPaddingY}px ${boxPaddingX}px`,
        borderRadius: `${boxRadius}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1
      };
    }
    if (clashBoxStyle === 'cyber-outline') {
      return {
        border: `${boxBorderWidth}px solid ${boxColor}`,
        backgroundColor: `${boxColor}${Math.round((boxOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
        padding: `${boxPaddingY}px ${boxPaddingX}px`,
        borderRadius: `${boxRadius}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 ${glowIntensity}px ${boxColor}15`,
        lineHeight: 1
      };
    }
    return {};
  };

  return (
    <>
      <div className="text-slate-100 bg-[#020617] min-h-screen flex flex-col bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,23,42,0.65),rgba(2,6,23,1))]">
      
      {/* Background patterns */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-space {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .grid-blueprint {
          background-size: 24px 24px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .cursor-neon-blue {
          filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.85));
        }
        .cursor-neon-red {
          filter: drop-shadow(0 0 16px rgba(244, 63, 94, 0.85));
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .bounce-trophy {
          animation: subtle-bounce 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 via-purple-600 to-rose-500 p-[2px] shadow-lg">
              <div className="bg-slate-950 h-full w-full rounded-[6px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">
                A//C
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider text-white flex items-center gap-2">
                ALGOCLASH <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono tracking-normal">WORDMARK ENGINE</span>
              </h1>
              <p className="text-xs text-slate-400">Space Grotesk Level Identity System &amp; Cyber Clash Containment Box</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleCopyText(getReactCode(), 'React component')}
              className="text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white rounded-lg shadow-lg hover:shadow-rose-500/20 transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4" /> COPY JSX WORDMARK
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
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

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* LEFT VIEWPORT PANEL (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visual Arena Viewport */}
          <div className={`relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden ${showGrid ? 'grid-blueprint' : ''} shadow-2xl aspect-video w-full flex flex-col items-center justify-center p-8 transition-all duration-300`}>
            
            {/* Visual Guide Metrics lines */}
            {showGrid && (
              <>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-800/40 border-dashed border-l pointer-events-none" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800/40 border-dashed border-t pointer-events-none" />
              </>
            )}

            {/* Glowing environmental filters */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none z-0" />

            {/* PHYSICS RENDER LAYER */}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{ filter: 'blur(0.5px)' }}
            />

            {/* Top-right Status Console */}
            <div className="absolute top-4 right-6 z-40 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 px-3 py-1.5 rounded flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${clashed ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300">
                {statusText}
              </span>
            </div>

            {/* Top-left Quick Physics Controls */}
            <div className="absolute top-4 left-6 z-40 flex items-center gap-2">
              <button
                onClick={triggerClash}
                className="bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all flex items-center gap-2"
              >
                <Zap className="w-3 h-3" /> CLASH
              </button>
              <button
                onClick={resetTimeline}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                onClick={() => setIsSlowMo(!isSlowMo)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all flex items-center gap-1 border ${
                  isSlowMo 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
                }`}
              >
                <Play className="w-3 h-3" /> {isSlowMo ? 'Slow-Mo ON' : 'Slow-Mo'}
              </button>
            </div>

            {/* Arena Viewport Contents Wrapper */}
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 z-20 select-none">
              
              {/* Stacked Wordmark Mode */}
              {layoutStyle === 'stacked' ? (
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  
                  {/* Symmetrical Clashing 8-Bit Cursors or Trophy */}
                  {markType !== 'none' && (
                    <div 
                      className="absolute left-0 right-0 flex items-center justify-center h-16 transition-all duration-300"
                      style={{ top: 'calc(50% - 60px)' }}
                    >
                      {markType === 'cursors' ? (
                        <>
                          <div 
                            style={{ 
                              position: 'absolute',
                              left: clashed ? `calc(50% - ${cursorGap / 2}px)` : '15%',
                              transform: clashed 
                                ? `translate(-100%, 0) scale(${cursorScale}) rotate(${cursorAngle}deg)` 
                                : `translate(-100%, 0) scale(${cursorScale}) rotate(10deg)`,
                              transformOrigin: 'right top',
                              width: '12px', height: '17px',
                              transition: `left ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1), transform ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1)`
                            }} 
                            className="cursor-neon-blue"
                          >
                            {renderPixelCursor('cyan', true)}
                          </div>
                          <div 
                            style={{ 
                              position: 'absolute',
                              left: clashed ? `calc(50% + ${cursorGap / 2}px)` : '85%',
                              transform: clashed 
                                ? `translate(0, 0) scale(${cursorScale}) rotate(${-cursorAngle}deg)` 
                                : `translate(0, 0) scale(${cursorScale}) rotate(-10deg)`,
                              transformOrigin: 'left top',
                              width: '12px', height: '17px',
                              transition: `left ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1), transform ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1)`
                            }} 
                            className="cursor-neon-red"
                          >
                            {renderPixelCursor('red', false)}
                          </div>
                        </>
                      ) : (
                        <div 
                          style={{ 
                            position: 'absolute',
                            left: '50%',
                            top: clashed ? '0' : '-80px',
                            opacity: clashed ? 1 : 0,
                            transform: `translate(-50%, 0) scale(${cursorScale * 1.5})`, 
                            width: '14px', height: '13px',
                            transition: `top ${actualDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity ${actualDuration * 0.5}s ease`
                          }} 
                          className={clashed ? 'bounce-trophy' : ''}
                        >
                          {renderTrophySVG()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Symmetrical Brand text with customizable box wrapper */}
                  <div 
                    style={{ 
                      position: 'absolute',
                      top: 'calc(50% + 20px)',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      letterSpacing: `${letterSpacingBrand * 0.01}em`,
                    }}
                    className="flex items-center justify-center text-center font-space transition-all duration-300"
                  >
                    <span 
                      style={{ fontWeight: algoWeight, color: algoColor, fontSize: `${brandSize}px` }}
                      className="tracking-tighter select-all mr-2"
                    >
                      algo
                    </span>

                    {/* Check if Box Wrapper is enabled */}
                    {['solid', 'cyber-outline'].includes(clashBoxStyle) ? (
                      <span style={getDynamicBoxStyles()} className="transition-all duration-300">
                        <span 
                          style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                          className="tracking-tighter select-all"
                        >
                          {getClashText()}
                        </span>
                      </span>
                    ) : clashBoxStyle === 'brackets' ? (
                      <span className="flex items-center">
                        <span style={{ color: boxColor, fontSize: `${brandSize}px` }} className="font-light mr-1 select-none">[</span>
                        <span 
                          style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                          className="tracking-tighter select-all"
                        >
                          {getClashText()}
                        </span>
                        <span style={{ color: boxColor, fontSize: `${brandSize}px` }} className="font-light ml-1 select-none">]</span>
                      </span>
                    ) : (
                      <span 
                        style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                        className="tracking-tighter select-all ml-1"
                      >
                        {getClashText()}
                      </span>
                    )}

                  </div>

                </div>
              ) : (
                /* Inline Layout Mode */
                <div 
                  style={{ 
                    letterSpacing: `${letterSpacingBrand * 0.01}em`,
                  }}
                  className="flex items-center font-space transition-all duration-300 select-all"
                >
                  <span 
                    style={{ fontWeight: algoWeight, color: algoColor, fontSize: `${brandSize}px` }}
                    className="tracking-tighter select-all"
                  >
                    algo
                  </span>

                  {/* Mark acting as inline separator */}
                  {markType !== 'none' && (
                    <div 
                      style={{ gap: `${cursorGap}px` }}
                      className="flex items-center justify-center h-10 mx-6 transition-all duration-300 relative w-16"
                    >
                      {markType === 'cursors' ? (
                        <>
                          <div 
                            style={{ 
                              position: 'absolute',
                              left: clashed ? `calc(50% - ${cursorGap / 2}px)` : '10%',
                              transform: clashed 
                                ? `translate(-100%, -50%) scale(${cursorScale}) rotate(${cursorAngle}deg)` 
                                : `translate(-100%, -50%) scale(${cursorScale}) rotate(10deg)`,
                              transformOrigin: 'right top',
                              width: '12px', height: '17px',
                              top: '50%',
                              transition: `left ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1), transform ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1)`
                            }} 
                            className="cursor-neon-blue"
                          >
                            {renderPixelCursor('cyan', true)}
                          </div>
                          <div 
                            style={{ 
                              position: 'absolute',
                              left: clashed ? `calc(50% + ${cursorGap / 2}px)` : '90%',
                              transform: clashed 
                                ? `translate(0%, -50%) scale(${cursorScale}) rotate(${-cursorAngle}deg)` 
                                : `translate(0%, -50%) scale(${cursorScale}) rotate(-10deg)`,
                              transformOrigin: 'left top',
                              width: '12px', height: '17px',
                              top: '50%',
                              transition: `left ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1), transform ${actualDuration}s cubic-bezier(0.19, 1, 0.22, 1)`
                            }} 
                            className="cursor-neon-red"
                          >
                            {renderPixelCursor('red', false)}
                          </div>
                        </>
                      ) : (
                        <div 
                          style={{ 
                            position: 'absolute',
                            left: '50%',
                            top: clashed ? '50%' : '-40px',
                            opacity: clashed ? 1 : 0,
                            transform: `translate(-50%, -50%) scale(${cursorScale * 1.5})`, 
                            width: '14px', height: '13px',
                            transition: `top ${actualDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity ${actualDuration * 0.5}s ease`
                          }} 
                          className={clashed ? 'bounce-trophy' : ''}
                        >
                          {renderTrophySVG()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Check if Box Wrapper is enabled inline */}
                  {['solid', 'cyber-outline'].includes(clashBoxStyle) ? (
                    <span style={getDynamicBoxStyles()} className="transition-all duration-300">
                      <span 
                        style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                        className="tracking-tighter select-all"
                      >
                        {getClashText()}
                      </span>
                    </span>
                  ) : clashBoxStyle === 'brackets' ? (
                    <span className="flex items-center">
                      <span style={{ color: boxColor, fontSize: `${brandSize}px` }} className="font-light mr-1 select-none">[</span>
                      <span 
                        style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                        className="tracking-tighter select-all"
                      >
                        {getClashText()}
                      </span>
                      <span style={{ color: boxColor, fontSize: `${brandSize}px` }} className="font-light ml-1 select-none">]</span>
                    </span>
                  ) : (
                    <span 
                      style={{ fontWeight: clashWeight, color: clashColor, fontSize: `${brandSize}px` }}
                      className="tracking-tighter select-all ml-1"
                    >
                      {getClashText()}
                    </span>
                  )}
                </div>
              )}

              {/* Tagline Motto Underneath (Guaranteed on a single non-wrapping line) */}
              <div 
                style={{ 
                  letterSpacing: `${letterSpacingTagline}px`, 
                  fontSize: `${taglineSize}px`,
                  color: taglineColor 
                }}
                className="font-space font-bold uppercase tracking-widest mt-4 pt-3 border-t border-slate-900/60 w-full text-center whitespace-nowrap overflow-hidden text-ellipsis select-all"
              >
                {getTaglineText()}
              </div>

            </div>

            {/* Display Options controls bottom left */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold mono border transition flex items-center gap-1.5 ${
                  showGrid 
                    ? 'bg-slate-900 border-slate-700 text-cyan-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Eye className="w-3 h-3" /> GRID_METRICS: {showGrid ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>

            {/* Top right state readout */}
            <div className="absolute top-4 right-4 z-20 opacity-55">
              <span className="text-[10px] font-semibold mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                FONT: SPACE GROTESK
              </span>
            </div>

          </div>

          {/* Interactive parameter modifiers */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" /> Identity Customizer &amp; Dimensions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Wordmark Size (algo clash)</span>
                  <span className="mono text-cyan-400 font-bold">{brandSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="24" 
                  max="64" 
                  value={brandSize} 
                  onChange={(e) => setBrandSize(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Brand Letter Spacing</span>
                  <span className="mono text-rose-400 font-bold">{letterSpacingBrand}% em</span>
                </div>
                <input 
                  type="range" 
                  min="-8" 
                  max="4" 
                  value={letterSpacingBrand} 
                  onChange={(e) => setLetterSpacingBrand(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Tagline Tracking (Single Line)</span>
                  <span className="mono text-yellow-400 font-bold">{letterSpacingTagline}px</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="14" 
                  value={letterSpacingTagline} 
                  onChange={(e) => setLetterSpacingTagline(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Cursor Visual Scale</span>
                  <span className="mono text-indigo-400 font-bold">x{cursorScale.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="240" 
                  value={cursorScale * 100} 
                  onChange={(e) => setCursorScale(Number(e.target.value) / 100)} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Cursor Slant Angle</span>
                  <span className="mono text-rose-400 font-bold">{cursorAngle}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={cursorAngle} 
                  onChange={(e) => setCursorAngle(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Cursor Collision Gap</span>
                  <span className="mono text-yellow-400 font-bold">{cursorGap}px</span>
                </div>
                <input 
                  type="range" 
                  min="-10" 
                  max="30" 
                  value={cursorGap} 
                  onChange={(e) => setCursorGap(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                />
              </div>

            </div>

            {/* Custom Clash-Box settings controls */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Square className="w-4 h-4 text-rose-500" /> "clash" Box Containment Properties
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Horizontal Padding slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Box Width Padding</span>
                    <span className="mono text-rose-400">{boxPaddingX}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="36" 
                    value={boxPaddingX} 
                    onChange={(e) => setBoxPaddingX(Number(e.target.value))} 
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500" 
                  />
                </div>

                {/* Vertical Padding slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Box Height Padding</span>
                    <span className="mono text-rose-400">{boxPaddingY}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="20" 
                    value={boxPaddingY} 
                    onChange={(e) => setBoxPaddingY(Number(e.target.value))} 
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500" 
                  />
                </div>

                {/* Corner Rounding slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Box Corner Rounding</span>
                    <span className="mono text-rose-400">{boxRadius}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={boxRadius} 
                    onChange={(e) => setBoxRadius(Number(e.target.value))} 
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500" 
                  />
                </div>

              </div>
            </div>

            {/* Layout Modifier Controls */}
            <div className="border-t border-slate-800 pt-5 grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Central Mark Type selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Central Mark</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {[
                    { id: 'cursors', label: 'Cursors' },
                    { id: 'trophy', label: 'Trophy' },
                    { id: 'none', label: 'None' }
                  ].map((style) => (
                    <button 
                      key={style.id}
                      onClick={() => setMarkType(style.id)}
                      className={`text-[10px] py-1.5 font-bold rounded transition ${
                        markType === style.id 
                          ? 'bg-rose-500 text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Box Style variant selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clash Box Variant</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {[
                    { id: 'cyber-outline', label: 'Outline' },
                    { id: 'solid', label: 'Solid' },
                    { id: 'brackets', label: 'Bracket' },
                    { id: 'none', label: 'None' }
                  ].map((style) => (
                    <button 
                      key={style.id}
                      onClick={() => setClashBoxStyle(style.id)}
                      className={`text-[10px] py-1.5 font-bold rounded transition ${
                        clashBoxStyle === style.id 
                          ? 'bg-rose-500 text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wordmark Layout Structure */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wordmark Structure</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {[
                    { id: 'stacked', label: 'STACKED' },
                    { id: 'inline', label: 'INLINE' }
                  ].map((style) => (
                    <button 
                      key={style.id}
                      onClick={() => setLayoutStyle(style.id)}
                      className={`text-[10px] py-1.5 font-bold rounded transition ${
                        layoutStyle === style.id 
                          ? 'bg-rose-500 text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tagline Separators */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline Separator</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {[
                    { id: ' ▪ ', label: '▪' },
                    { id: ' . ', label: '•' },
                    { id: ' / ', label: '/' },
                    { id: ' | ', label: '|' }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setTaglineSeparator(item.id)}
                      className={`text-[10px] py-1.5 rounded transition ${
                        taglineSeparator === item.id 
                          ? 'bg-rose-500 text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* BRADING INFO PANEL (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Concept Rationale */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-extrabold text-white text-base mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-500" /> Identity Presets
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Select an official branding preset to load customized spacing tokens, text weights, and alignments.
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => applyPreset('cyber-boxed-rose')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-left transition flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-rose-400 transition">Cyber-Boxed Rose</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Custom sub-pixel border surrounding CLASH</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
              </button>

              <button 
                onClick={() => applyPreset('terminal-bracket')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-left transition flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition">Terminal Bracket</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Classic square brackets enclosing the battle word</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
              </button>

              <button 
                onClick={() => applyPreset('solid-brutalist')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-left transition flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-400 transition">Solid Brutalist Block</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Inline solid high-contrast developer layout</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
              </button>
            </div>
          </div>

          {/* Color pickers */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Color Token Specs
            </h3>
            
            <div className="flex flex-col gap-4">
              
              {/* Algo Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">"algo" Text</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono text-slate-500">{algoColor}</span>
                  <input 
                    type="color" 
                    value={algoColor} 
                    onChange={(e) => setAlgoColor(e.target.value)} 
                    className="w-6 h-6 rounded bg-transparent cursor-pointer border border-slate-700"
                  />
                </div>
              </div>

              {/* Clash Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">"clash" Text</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono text-slate-500">{clashColor}</span>
                  <input 
                    type="color" 
                    value={clashColor} 
                    onChange={(e) => setClashColor(e.target.value)} 
                    className="w-6 h-6 rounded bg-transparent cursor-pointer border border-slate-700"
                  />
                </div>
              </div>

              {/* Containment Box borders/fills Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">Box Borders / Fills</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono text-slate-500">{boxColor}</span>
                  <input 
                    type="color" 
                    value={boxColor} 
                    onChange={(e) => setBoxColor(e.target.value)} 
                    className="w-6 h-6 rounded bg-transparent cursor-pointer border border-slate-700"
                  />
                </div>
              </div>

              {/* Tagline Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">Tagline Text</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono text-slate-500">{taglineColor}</span>
                  <input 
                    type="color" 
                    value={taglineColor} 
                    onChange={(e) => setTaglineColor(e.target.value)} 
                    className="w-6 h-6 rounded bg-transparent cursor-pointer border border-slate-700"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Weights Modifier */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" /> Space Grotesk Weights
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">"algo" Font Weight</span>
                  <span className="mono text-cyan-400 font-bold">{algoWeight}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {['300', '400', '500', '700'].map((weight) => (
                    <button 
                      key={`algo-${weight}`}
                      onClick={() => setAlgoWeight(weight)}
                      className={`text-[10px] font-mono py-1 rounded transition ${
                        algoWeight === weight ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">"clash" Font Weight</span>
                  <span className="mono text-rose-400 font-bold">{clashWeight}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {['300', '400', '500', '700'].map((weight) => (
                    <button 
                      key={`clash-${weight}`}
                      onClick={() => setClashWeight(weight)}
                      className={`text-[10px] font-mono py-1 rounded transition ${
                        clashWeight === weight ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
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
                <Code className="text-rose-500 w-7 h-7" /> Component Exporter (React JSX)
              </h2>
              <p className="text-xs text-slate-400 mt-1">Export high-performance React components with embedded layout state bindings.</p>
            </div>
          </div>

          {/* Code Tab Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Visual Vector Preview Slot */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950 p-8 rounded-xl border border-slate-800/85">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4 items-center justify-center">
                  <div className="w-12 h-16 text-cyan-400 cursor-neon-blue">
                    {renderPixelCursor('cyan', true, { transform: 'scale(1.2) rotate(24deg)', transformOrigin: 'right top' })}
                  </div>
                  <div className="w-12 h-16 text-rose-500 cursor-neon-red">
                    {renderPixelCursor('red', false, { transform: 'scale(1.2) rotate(-24deg)', transformOrigin: 'left top' })}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mono font-bold uppercase tracking-widest text-center">
                  symmetrical_pixels
                </span>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 mono tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> 
                  AlgoClashLogo.jsx
                </span>
                <button 
                  onClick={() => handleCopyText(getReactCode(), 'React logo')} 
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <textarea 
                readOnly 
                value={getReactCode()}
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
            <span className="hover:text-slate-300 transition cursor-pointer">May 2026</span>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}
