import React, { useState, useRef } from 'react';
import { CyberButton } from './CyberButton';
import { CyberCard } from './CyberCard';
import { MatchmakerDemo } from './MatchmakerDemo';
import { CombatSimulator } from './CombatSimulator';
import { CodeComparisonPaywall } from './CodeComparisonPaywall';

export const ArenaPage = ({ onReturnToHome, initialOpponent = null }) => {
  const [arenaMode, setArenaMode] = useState(initialOpponent ? 'fight' : 'lobby');
  const [matchedOpponent, setMatchedOpponent] = useState(initialOpponent);
  const [matchDetails, setMatchDetails] = useState(null);

  const handleMatchStart = (opponent) => {
    setMatchedOpponent(opponent);
    setArenaMode('fight');
  };

  const handleMatchEnd = (details) => {
    setMatchDetails(details);
    setArenaMode('analysis');
  };

  const handleReset = () => {
    setArenaMode('lobby');
    setMatchedOpponent(null);
    setMatchDetails(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-black)' }}>
      {/* BACKGROUND ELEMENTS */}
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      {/* TACTICAL SIMULATOR HEADER */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 5%',
        borderBottom: '1px solid rgba(255,107,0,0.15)',
        backgroundColor: 'rgba(4,4,4,0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CyberButton variant="ghost" size="sm" onClick={onReturnToHome}>
            🡠 HOME_GATEWAY
          </CyberButton>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
          <span className="font-display" style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '0.15em', color: '#fff' }}>
            TACTICAL_ARENA<span style={{ color: 'var(--accent-orange)' }}>_SIM_V1.4</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <span>ARENA_LOAD: <b style={{ color: 'var(--accent-cyan)' }}>12%</b></span>
          <span>ACTIVE_SPECTATORS: <b style={{ color: '#fff' }}>1,084</b></span>
          <span>ROUTING: <b style={{ color: 'var(--accent-orange)' }}>AUTO</b></span>
        </div>
      </header>

      {/* SIMULATOR CONTAINER */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 5% 80px 5%'
      }}>
        
        {/* Visual coordinate coordinates decorations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>
          <span>LAT_GRID_COORD: 19.0760° N, 72.8777° E [MUM_NODE_03]</span>
          <span>SYSTEM_SYS.FIGHT_CORE: OK_</span>
        </div>

        {/* Tactical Hazard Slash header bar */}
        <div className="hazard-stripes-sm" style={{ height: '4px', width: '100%', marginBottom: '24px', opacity: 0.6 }}></div>

        {/* Dashboard grid panel */}
        <div style={{
          border: '1px solid #222',
          backgroundColor: '#040404',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
          position: 'relative'
        }}>
          {/* Accent corners */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderTop: '2px solid var(--accent-orange)', borderLeft: '2px solid var(--accent-orange)', transform: 'translate(-1px,-1px)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderBottom: '2px solid var(--accent-orange)', borderRight: '2px solid var(--accent-orange)', transform: 'translate(1px,1px)' }}></div>

          {/* Render Active Stage */}
          {arenaMode === 'lobby' && (
            <MatchmakerDemo onMatchStart={handleMatchStart} />
          )}

          {arenaMode === 'fight' && (
            <CombatSimulator opponent={matchedOpponent} onMatchEnd={handleMatchEnd} />
          )}

          {arenaMode === 'analysis' && (
            <CodeComparisonPaywall 
              opponent={matchDetails?.opponent} 
              opponentFinalCode={matchDetails?.opponentFinalCode} 
              onReset={handleReset} 
            />
          )}
        </div>

        {/* TELEMETRY FOOTER */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div className="clip-cyber-sm" style={{ border: '1px solid #111', padding: '12px 20px', backgroundColor: '#040404', fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-orange)', borderRadius: '50%' }}></span>
            <span>SECURE SANDBOX: CLIENT EXECUTION HOSTED ON FLY.IO PRIVATE CONTAINERS</span>
          </div>

          <div className="clip-cyber-sm" style={{ border: '1px solid #111', padding: '12px 20px', backgroundColor: '#040404', fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%' }}></span>
            <span>TRIAL RUN ACTIVE: SIMULATOR DELIVERING COMPRESSED SPEED ROUND MATRICES</span>
          </div>
        </div>

      </main>
    </div>
  );
};
