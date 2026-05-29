import React, { useState, useEffect } from 'react';

export const CyberCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 12x17 Classic Retro Cursors (image_0aeeab.png Matrix Map)
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

  useEffect(() => {
    // Hide standard browser cursor globally
    document.body.style.cursor = 'none';
    
    // Add global custom stylesheet entry to enforce cursor: none across all elements
    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleNode);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const checkInteractive = (el) => {
        if (!el || el === document.body) return false;
        
        const tagName = el.tagName;
        const style = window.getComputedStyle(el);
        const role = el.getAttribute('role');

        if (
          tagName === 'BUTTON' ||
          tagName === 'A' ||
          tagName === 'INPUT' ||
          tagName === 'SELECT' ||
          tagName === 'TEXTAREA' ||
          role === 'button' ||
          style.cursor === 'pointer'
        ) {
          return true;
        }
        return checkInteractive(el.parentElement);
      };

      if (checkInteractive(target)) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto';
      if (document.head.contains(styleNode)) {
        document.head.removeChild(styleNode);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Active hover configurations
  const activeColor = isHovering ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
  const activeOutline = isHovering ? '#450a0a' : '#051d26';
  const activeCore = isHovering ? '#f43f5e' : '#00f2fe';

  return (
    <div 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        pointerEvents: 'none',
        zIndex: 100000,
        willChange: 'transform',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        transition: 'transform 0.06s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      <svg 
        style={{ 
          width: '26px', 
          height: '37px', 
          filter: `drop-shadow(0 0 10px ${activeColor})`,
          transition: 'filter 0.3s ease'
        }} 
        viewBox="0 0 12 17" 
        fill="none"
      >
        {classicCursorGrid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            if (cell === 0) return null;
            let fill = activeCore;
            if (cell === 1) fill = activeOutline;
            if (cell === 2) fill = activeCore;
            if (cell === 3) fill = '#FFFFFF';
            return (
              <rect 
                key={`cc-${rIdx}-${cIdx}`}
                x={cIdx} y={rIdx} width="1" height="1" 
                fill={fill} stroke={fill} strokeWidth="0.05"
                style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
