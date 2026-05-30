import React from 'react';

export const LogoWordmark = ({ 
  fontSize = '24px', 
  animated = false,
  style = {},
  ...props 
}) => {
  return (
    <div 
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize,
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#fff',
        userSelect: 'none',
        lineHeight: 1,
        fontFamily: "'Space Grotesk', sans-serif",
        ...style
      }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Left bracket */}
        <span 
          style={{ 
            display: 'inline-block', 
            color: 'var(--accent-cyan)', 
            marginRight: '0.16em', 
            textShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
            transform: 'skewX(-18deg)'
          }}
        >
          &lt;
        </span>

        {/* algo simple upright */}
        <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', textTransform: 'none' }}>
          {'algo'.split('').map((char, idx) => (
            <span 
              key={`algo-${idx}`}
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Asymmetrical Spacing Option separator */}
        <span 
          style={{ 
            display: 'inline-block', 
            marginLeft: '-0.02em', 
            marginRight: '0.12em', 
            color: 'var(--accent-crimson)', 
            textShadow: '0 0 12px rgba(244, 63, 94, 0.65)' 
          }}
        >
          ⌥
        </span>

        {/* CLASH with Katakana subtitle centered underneath */}
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <span 
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
              <path d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <path d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              <path d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
              <path d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <path d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </span>
          
          <span 
            style={{ 
              fontSize: '0.22em', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-18deg) translateX(-50%)',
              position: 'absolute',
              bottom: '-0.38em',
              left: '50%',
              whiteSpace: 'nowrap'
            }}
          >
            クラッシュ
          </span>
        </div>

        {/* Right Bracket */}
        <span 
          style={{ 
            display: 'inline-block', 
            color: 'var(--accent-cyan)', 
            marginLeft: '0.16em', 
            textShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
            transform: 'skewX(-18deg)'
          }}
        >
          &gt;
        </span>
      </div>
    </div>
  );
};
