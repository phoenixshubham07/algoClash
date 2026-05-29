import React, { useState } from 'react';

export const CyberButton = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    onClick,
    ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sysHex] = useState(() => `0X${Math.floor(Math.random() * 9999).toString(16).toUpperCase()}`);

  // Define accent colors for variants
  let accentColor = 'var(--accent-cyan)';
  if (variant === 'danger') {
    accentColor = 'var(--accent-crimson)';
  } else if (variant === 'warning') {
    accentColor = 'var(--accent-yellow)';
  } else if (variant === 'ghost') {
    accentColor = 'rgba(255, 255, 255, 0.25)';
  }

  // Border backing fill
  let containerBg = accentColor;
  if (variant === 'ghost') {
    containerBg = isHovered ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.15)';
  }

  // Size padding adjustments
  let sizePadding = '12px 32px';
  let sizeFontSize = '14px';
  if (size === 'sm') {
    sizePadding = '8px 16px';
    sizeFontSize = '12px';
  } else if (size === 'lg') {
    sizePadding = '16px 48px';
    sizeFontSize = '16px';
  }

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: containerBg,
    padding: '1px', // 1px border simulation
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    clipPath: size === 'sm' 
      ? 'polygon(0% 0%, 96% 0%, 100% 8px, 100% 100%, 4% 100%, 0% calc(100% - 8px))' 
      : 'polygon(0% 0%, 95% 0%, 100% 16px, 100% 100%, 5% 100%, 0% calc(100% - 16px))',
    boxShadow: isHovered && variant !== 'ghost'
      ? `0 0 16px ${accentColor}`
      : 'none',
  };

  const innerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: isHovered ? '0.25em' : '0.2em',
    fontSize: sizeFontSize,
    padding: sizePadding,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    backgroundColor: isHovered ? (variant === 'ghost' ? 'rgba(255,255,255,0.08)' : accentColor) : 'var(--bg-black)',
    color: isHovered ? (variant === 'ghost' ? '#fff' : 'var(--bg-black)') : accentColor,
    clipPath: size === 'sm'
      ? 'polygon(0% 0%, 96% 0%, 100% 8px, 100% 100%, 4% 100%, 0% calc(100% - 8px))'
      : 'polygon(0% 0%, 95% 0%, 100% 16px, 100% 100%, 5% 100%, 0% calc(100% - 16px))',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  return (
    <button 
      style={containerStyle}
      className={`transition-cyber ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      <span style={innerStyle}>
        {/* Animated Sweep Line on Hover */}
        {isHovered && variant !== 'ghost' && (
          <span 
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <span 
              className="animate-slice-sweep"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '40px',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
            ></span>
          </span>
        )}

        {/* Micro-dot texture background */}
        <span 
          className="bg-micro-dot"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: isHovered ? 0.06 : 0.12,
            transition: 'opacity 0.3s ease',
            zIndex: 1
          }}
        ></span>
        
        {/* Dynamic Hex Data on left */}
        <span 
          style={{
            position: 'absolute',
            left: '8px',
            bottom: '2px',
            fontSize: '7px',
            opacity: 0.5,
            fontWeight: 'bold',
            pointerEvents: 'none',
            letterSpacing: '0px',
            color: 'currentColor',
            zIndex: 2
          }}
        >
          {isHovered ? sysHex : 'SYS.RDY'}
        </span>

        {/* Content Wrapper */}
        <span style={{ position: 'relative', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
          {variant === 'primary' && (
            <span 
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'currentColor',
                display: 'inline-block',
                animation: isHovered ? 'blink-cursor 1s step-end infinite' : 'none'
              }}
            ></span>
          )}
          {children}
        </span>
      </span>
    </button>
  );
};
