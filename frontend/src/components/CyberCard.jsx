import React from 'react';

export const CyberCard = ({ 
  children, 
  className = '', 
  variant = 'default', 
  title, 
  systemCode = 'NODE_A1',
  statusText = 'STS',
  style = {}
}) => {
  // Map variant to styling colors
  let accentColor = 'rgba(255, 255, 255, 0.15)';
  let glowColor = 'transparent';
  let headerText = 'var(--text-primary)';
  let headerDot = '#555';
  
  if (variant === 'primary') {
    accentColor = 'var(--accent-cyan)';
    glowColor = 'rgba(0, 242, 254, 0.05)';
    headerText = 'var(--accent-cyan)';
    headerDot = 'var(--accent-cyan)';
  } else if (variant === 'danger') {
    accentColor = 'var(--accent-crimson)';
    glowColor = 'rgba(244, 63, 94, 0.05)';
    headerText = 'var(--accent-crimson)';
    headerDot = 'var(--accent-crimson)';
  } else if (variant === 'warning') {
    accentColor = 'var(--accent-yellow)';
    glowColor = 'rgba(255, 215, 0, 0.05)';
    headerText = 'var(--accent-yellow)';
    headerDot = 'var(--accent-yellow)';
  }

  const outerStyle = {
    position: 'relative',
    background: accentColor,
    padding: '1px', // 1px border simulation
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: `0 8px 30px rgba(0,0,0,0.85), ${glowColor}`,
    clipPath: 'polygon(5% 0%, 100% 0%, 100% calc(100% - 16px), 95% 100%, 0% 100%, 0% 16px)',
    ...style
  };

  const innerStyle = {
    position: 'relative',
    backgroundColor: '#040404',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    clipPath: 'polygon(5% 0%, 100% 0%, 100% calc(100% - 16px), 95% 100%, 0% 100%, 0% 16px)',
    flexGrow: 1
  };

  return (
    <div 
      className={`${className}`}
      style={outerStyle}
    >
      <div style={innerStyle}>
        {/* Background Texture micro-dots */}
        <div 
          className="bg-micro-dot"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            pointerEvents: 'none',
            mixBlendMode: 'screen'
          }}
        ></div>
        
        {/* Top Accent Trace */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '16px',
            right: '48px',
            height: '2px',
            backgroundColor: accentColor,
            opacity: variant === 'default' ? 0.2 : 0.6,
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}
        ></div>

        {/* Corner Target Brackets */}
        {/* Top-Left */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '12px',
            borderTop: '2px solid rgba(255, 255, 255, 0.25)',
            borderLeft: '2px solid rgba(255, 255, 255, 0.25)',
            transform: 'translate(-1px, -1px)',
            pointerEvents: 'none'
          }}
        ></div>
        {/* Bottom-Right */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '12px',
            height: '12px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
            borderRight: '2px solid rgba(255, 255, 255, 0.25)',
            transform: 'translate(1px, 1px)',
            pointerEvents: 'none'
          }}
        ></div>

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
          
          {/* Header telemetry info */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '16px', backgroundColor: accentColor }}></div>
                <h3 
                  className="font-display" 
                  style={{ 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.15em', 
                    fontSize: '15px',
                    color: headerText
                  }}
                >
                  {title}
                </h3>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingLeft: '16px' }}>
              <span 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.2em',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                {systemCode} // CLAR_V09
              </span>
              
              {/* Pulsing Status Light */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-muted)' }}>{statusText}</span>
                <div 
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: headerDot,
                    boxShadow: variant !== 'default' ? `0 0 6px ${headerDot}` : 'none',
                    animation: variant === 'danger' ? 'blink-cursor 0.8s step-end infinite' : 'none'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Body */}
          <div 
            style={{ 
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              flexGrow: 1,
              paddingLeft: '16px',
              borderLeft: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            {children}
          </div>

          {/* Bottom design traces */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', opacity: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
              <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  style={{ 
                    width: '4px', 
                    height: '10px', 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'skewX(-20deg)'
                  }}
                ></div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
