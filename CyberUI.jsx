import React, { useState } from 'react';

// ============================================================================
// ALGO CLASH BRAND IDENTITY & DESIGN SYSTEM 
// (Context for AI Agents & Developers)
// ============================================================================
// • Aesthetic: Brutalist, military-tech, cyberpunk, high-fidelity data UI.
// • Typography: 
//    - Display/Headers: `font-display` (Space Grotesk) - Bold, uppercase, heavy tracking.
//    - Data/Body: `font-mono` (JetBrains Mono) - Small, crisp, metallic/dim text.
// • Colors: 
//    - Background: Deep black/carbon (`#000000`, `#030304`).
//    - Accent 1 (Safe/Player): Electric Cyan (`#00f2fe`).
//    - Accent 2 (Danger/Opponent): Crimson Red (`#f43f5e`).
//    - Accent 3 (Decals/Trophy): Cyber Yellow (`#ffd700`).
// • Motif: Clean vectors, 45-degree angle cuts (`clip-cyber`), 18-degree slant cursors.
//   No generic soft box shadows; use vivid colored glows on hover.
// • SVGs & Icons: Use `lucide-react` or purely geometric polygons. Ensure 
//   overlays use `pointer-events-none` so they don't block interaction.
// ============================================================================

// -----------------------------------------------------
// 18-DEGREE CLASHING LOGO (Identity Icon)
// -----------------------------------------------------
export const ClashLogo18Deg = ({ scale = 1.0, glow = true }) => {
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

  return (
    <div style={{ 
      display: 'flex', 
      gap: `${8 * scale}px`, 
      height: `${64 * scale}px`, 
      width: `${92 * scale}px`, 
      filter: glow ? 'drop-shadow(0 0 16px rgba(0,242,254,0.15))' : 'none' 
    }}>
      {/* Symmetrical Left Cursors pointing up-right at 18 degrees */}
      <div style={{ transform: 'rotate(18deg)', transformOrigin: 'right top', width: '50%', height: '100%', filter: glow ? 'drop-shadow(0 0 8px var(--accent-cyan))' : 'none' }}>
        {renderCursor('cyan', true)}
      </div>
      {/* Symmetrical Right Cursors pointing up-left at 18 degrees */}
      <div style={{ transform: 'rotate(-18deg)', transformOrigin: 'left top', width: '50%', height: '100%', filter: glow ? 'drop-shadow(0 0 8px var(--accent-crimson))' : 'none' }}>
        {renderCursor('crimson', false)}
      </div>
    </div>
  );
};

// -----------------------------------------------------
// CYBER BUTTON (Military Tech Variant)
// -----------------------------------------------------
export const CyberButton = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className, 
    onClick,
    ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sysHex] = useState(() => `0X${Math.floor(Math.random()*9999).toString(16).toUpperCase()}`);

  const variants = {
    primary: "border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]",
    danger: "border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]",
    warning: "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]",
    ghost: "border-white/10 text-white/30 hover:text-white hover:border-white/50 hover:bg-white/5 border-dashed shadow-[inset_0_0_10px_rgba(255,255,255,0.01)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base"
  };

  const baseClasses = "group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:tracking-[0.25em] hover:text-shadow-[0_0_10px_currentColor] clip-cyber border active:scale-95 bg-transparent";

  return (
    <button 
      className={baseClasses + " " + variants[variant] + " " + sizes[size] + " " + (className || "")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
        {isHovered && variant !== 'ghost' && (
           <span className="absolute inset-0 overflow-hidden mix-blend-overlay pointer-events-none">
               <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-40 animate-slice-sweep"></span>
           </span>
        )}

        <span className="absolute inset-0 bg-micro-dot pointer-events-none opacity-20"></span>
        
        <span className="absolute left-[4px] bottom-[2px] text-[6px] tracking-tighter opacity-50 font-bold pointer-events-none">
            {isHovered ? sysHex : 'SYS.RDY'}
        </span>

        <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
           {variant === 'primary' && <span className="w-1.5 h-1.5 bg-current inline-block mr-1"></span>}
           {children}
        </span>
    </button>
  );
};

// -----------------------------------------------------
// MILITARY STEPPED CHASSIS PANEL (cyberpunkcardesign8.jpg Variant)
// -----------------------------------------------------
export const MilitaryChassisPanel = ({ children, title, serial = 'S/N: 4275EV17EN', variant = 'yellow' }) => {
  const accentColors = {
    cyan: 'var(--accent-cyan)',
    crimson: 'var(--accent-crimson)',
    yellow: 'var(--accent-yellow)'
  };

  const activeColor = accentColors[variant] || 'var(--accent-yellow)';

  return (
    <div style={{
      border: `1px solid ${activeColor}`,
      backgroundColor: 'rgba(5,6,8,0.98)',
      padding: '32px',
      position: 'relative',
      boxShadow: `0 20px 40px rgba(0,0,0,0.95), 0 0 30px ${activeColor}08`,
      clipPath: 'polygon(0% 0%, 92% 0%, 100% 24px, 100% 100%, 8% 100%, 0% calc(100% - 24px))'
    }}>
      {/* Corner Brackets */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: `2px solid ${activeColor}`, borderLeft: `2px solid ${activeColor}` }}></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: `2px solid ${activeColor}`, borderRight: `2px solid ${activeColor}` }}></div>

      {/* Dotted Grid Overlay */}
      <div className="bg-micro-dot" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}></div>

      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="hazard-stripes-sm" style={{ width: '8px', height: '16px' }}></div>
          <span className="font-display" style={{ fontWeight: 'bold', letterSpacing: '0.2em', fontSize: '13px', color: activeColor }}>
            {title || 'SYSTEM TELEMETRY'}
          </span>
        </div>
        <span style={{ fontSize: '8px', opacity: 0.4, fontFamily: 'var(--font-mono)' }}>{serial}</span>
      </div>

      {/* Body */}
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
};


