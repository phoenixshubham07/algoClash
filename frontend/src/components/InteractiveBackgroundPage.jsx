import React from 'react';
import { InteractiveBackground } from './InteractiveBackground';
import { CyberButton } from './CyberButton';

export const InteractiveBackgroundPage = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-black)' }}>
      {/* THE INTERACTIVE BACKGROUND */}
      <InteractiveBackground />

      {/* SAMPLE FOREGROUND CONTENT */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        pointerEvents: 'none' // Let mouse events pass through to document for canvas interaction
      }}>
        <div style={{
          backgroundColor: 'rgba(2, 2, 3, 0.8)',
          padding: '40px 60px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)',
          pointerEvents: 'auto' // Re-enable pointer events for the card buttons
        }}>
          <h1 className="font-display" style={{ color: '#fff', fontSize: '3rem', letterSpacing: '0.2em', textShadow: '0 0 20px rgba(0, 242, 254, 0.5)', textAlign: 'center', margin: 0 }}>
            INTERACTIVE <span style={{ color: 'var(--accent-cyan)' }}>CANVAS</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginTop: '1rem', textAlign: 'center' }}>
            Move cursor to repel syntax particles.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '16px' }}>
            <CyberButton variant="primary" onClick={() => window.location.href = '/'}>
              RETURN HOME
            </CyberButton>
          </div>
        </div>
      </div>
    </div>
  );
};
