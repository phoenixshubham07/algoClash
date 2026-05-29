import React, { useState, useEffect, useRef } from 'react';
import { CyberButton } from './CyberButton';
import { CyberCard } from './CyberCard';

const FAKE_OPPONENTS = [
  { username: 'garvit_99', elo: 1204, avatar: 'G', tag: 'DELHI_DUELIST', lang: 'cpp' },
  { username: 'viet_code_devil', elo: 1420, avatar: 'V', tag: 'HANOI_STRIKER', lang: 'python' },
  { username: 'shubham_v', elo: 1318, avatar: 'S', tag: 'MUMBAI_TITAN', lang: 'cpp' },
  { username: 'tokyo_blitz', elo: 1489, avatar: 'T', tag: 'TOKYO_REAPER', lang: 'java' },
  { username: 'greedy_solver', elo: 1190, avatar: 'R', tag: 'DP_WIZARD', lang: 'cpp' },
  { username: 'pointer_sniper', elo: 1395, avatar: 'P', tag: 'BANGALORE_SNIPER', lang: 'cpp' },
  { username: 'matrix_hacker', elo: 1250, avatar: 'M', tag: 'SEATTLE_PHANTOM', lang: 'python' },
  { username: 'lru_cache_god', elo: 1435, avatar: 'L', tag: 'SEOUL_VANGUARD', lang: 'java' },
  { username: 'binary_beast', elo: 1290, avatar: 'B', tag: 'HYDERABAD_EXEC', lang: 'cpp' },
];

export const MatchmakerDemo = ({ onMatchStart }) => {
  const [status, setStatus] = useState('idle'); // idle | searching | matched | reveal
  const [currentName, setCurrentName] = useState('SEARCH_TARGET');
  const [currentElo, setCurrentElo] = useState(1200);
  const [currentAvatar, setCurrentAvatar] = useState('?');
  const [opponent, setOpponent] = useState(null);
  const [revealCountdown, setRevealCountdown] = useState(3);
  
  const timerRef = useRef(null);

  const startMatchmaking = () => {
    setStatus('searching');
    
    // Choose actual opponent in advance
    const targetOpponent = FAKE_OPPONENTS[Math.floor(Math.random() * FAKE_OPPONENTS.length)];
    setOpponent(targetOpponent);

    let speed = 40; // Starts fast
    let index = 0;
    let elapsed = 0;
    const duration = 2500; // 2.5 seconds search

    const tick = () => {
      const opp = FAKE_OPPONENTS[index % FAKE_OPPONENTS.length];
      setCurrentName(opp.username);
      setCurrentElo(opp.elo);
      setCurrentAvatar(opp.avatar);
      
      index++;
      elapsed += speed;
      
      // Exponentially slow down the cycle
      speed = Math.min(speed * 1.10, 350);

      if (elapsed < duration) {
        timerRef.current = setTimeout(tick, speed);
      } else {
        // Slow down lands exactly on the chosen opponent
        setCurrentName(targetOpponent.username);
        setCurrentElo(targetOpponent.elo);
        setCurrentAvatar(targetOpponent.avatar);
        setStatus('matched');
        
        // Short pause, then VS reveal
        timerRef.current = setTimeout(() => {
          setStatus('reveal');
          setRevealCountdown(3);
        }, 800);
      }
    };

    tick();
  };

  // Countdown timer for match reveal screen
  useEffect(() => {
    if (status === 'reveal') {
      if (revealCountdown > 0) {
        const t = setTimeout(() => {
          setRevealCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(t);
      } else {
        // Starts the live combat simulator!
        onMatchStart(opponent);
      }
    }
  }, [status, revealCountdown, opponent, onMatchStart]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {status === 'idle' && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 className="font-display glow-cyan" style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            READY FOR COMBAT?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px auto', fontSize: '14px', lineHeight: 1.6 }}>
            Step into the 1v1 coding arena. Watch your opponent's cursor jump in real time while your screen pulses red.
          </p>
          <CyberButton variant="primary" size="lg" onClick={startMatchmaking}>
            FIND A DUEL
          </CyberButton>
        </div>
      )}

      {status === 'searching' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '300px' }}>
          <div className="bg-micro-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '24px 48px', width: '100%', maxWidth: '550px', backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}>
            {/* Pulsing grid scan line inside the searching block */}
            <div className="scanner-beam"></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '100%' }}>
              {/* Rotating radar graphic */}
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', flexShrink: 0 }}></div>
              
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 'bold', letterSpacing: '0.2em' }}>STATUS: MATCHMAKING_ACTIVE</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PING: 14MS</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>LOCKING ON:</span>
                  <span className="glow-cyan" style={{ fontSize: '18px', letterSpacing: '0.05em' }}>{currentName}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px' }}>
                  <span>ELO: {currentElo}</span>
                  <span style={{ color: 'var(--accent-yellow)' }}>RANK: PRODUCING_ bracket</span>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {status === 'matched' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '300px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--accent-yellow)', padding: '32px 48px', width: '100%', maxWidth: '550px', backgroundColor: '#050505', textAlign: 'center', boxShadow: '0 0 25px rgba(234, 179, 8, 0.15)' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-yellow)', fontWeight: 'bold', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>
              ⚡ OPPONENT ACQUIRED ⚡
            </span>
            <h3 className="font-display font-bold text-shadow-[0_0_12px_var(--accent-yellow)]" style={{ fontSize: '28px', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {opponent?.username}
            </h3>
            <div style={{ display: 'flex', gap: '24px', margin: '16px 0', fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <span>ELO: <b style={{ color: 'var(--accent-cyan)' }}>{opponent?.elo}</b></span>
              <span>TACTICAL: <b style={{ color: 'var(--accent-magenta)' }}>{opponent?.tag}</b></span>
            </div>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-yellow)', margin: '8px auto' }}></div>
          </div>
        </div>
      )}

      {status === 'reveal' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 2, 2, 0.98)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Futuristic grid mesh background */}
          <div className="grid-bg" style={{ opacity: 0.15 }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '80px',
            width: '100%',
            maxWidth: '1000px',
            marginBottom: '48px',
            flexWrap: 'wrap'
          }}>
            {/* PLAYER CARD LEFT (YOU) */}
            <div className="clip-cyber-inverted" style={{
              width: '280px',
              backgroundColor: '#0a0a0a',
              border: '2px solid var(--accent-cyan)',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(0, 242, 254, 0.2)',
              transform: 'translateX(0)',
              animation: 'slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: 'none',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'var(--accent-cyan)'
              }}>U</div>
              <h4 className="font-display" style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                YOU
              </h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                ELO Rating: 1200
              </p>
              <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', marginTop: '16px', letterSpacing: '0.25em', fontWeight: 'bold' }}>
                [READY_STATUS]
              </div>
            </div>

            {/* VS CENTER DECAL */}
            <div style={{ textAlign: 'center', animation: 'scaleUp 0.4s ease-out' }}>
              <div className="font-display glow-magenta" style={{
                fontSize: '92px',
                fontWeight: '900',
                fontStyle: 'italic',
                color: 'var(--accent-magenta)',
                letterSpacing: '-2px',
                lineHeight: 1
              }}>
                VS
              </div>
              <div style={{
                marginTop: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.4em',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                1V1 ARENA
              </div>
            </div>

            {/* PLAYER CARD RIGHT (OPPONENT) */}
            <div className="clip-cyber" style={{
              width: '280px',
              backgroundColor: '#0a0a0a',
              border: '2px solid var(--accent-magenta)',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(244, 63, 94, 0.2)',
              transform: 'translateX(0)',
              animation: 'slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: 'none',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid var(--accent-magenta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'var(--accent-magenta)'
              }}>{opponent?.avatar}</div>
              <h4 className="font-display" style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                {opponent?.username}
              </h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                ELO Rating: {opponent?.elo}
              </p>
              <div style={{ fontSize: '10px', color: 'var(--accent-magenta)', marginTop: '16px', letterSpacing: '0.25em', fontWeight: 'bold' }}>
                [{opponent?.tag}]
              </div>
            </div>
          </div>

          {/* COUNTDOWN TICK */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              MATCH INITIATION SECONDS
            </span>
            <div className="font-display glow-cyan" style={{
              fontSize: '84px',
              fontWeight: '800',
              color: 'var(--accent-cyan)',
              lineHeight: 1,
              marginTop: '8px',
              animation: 'pulseCount 1s ease-in-out infinite'
            }}>
              {revealCountdown}
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideLeft {
              from { transform: translateX(-100px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideRight {
              from { transform: translateX(100px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes pulseCount {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.15); opacity: 0.8; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
