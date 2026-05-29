import React, { useState } from 'react';
import { CyberCard } from './CyberCard';

const MOCK_BRACKET = {
  round_1: [
    { id: 'r1_m1', p1: 'garvit_99', elo1: 1204, p2: 'greedy_solver', elo2: 1190, score1: 12, score2: 8, status: 'completed', winner: 'garvit_99' },
    { id: 'r1_m2', p1: 'viet_code_devil', elo1: 1420, p2: 'matrix_hacker', elo2: 1250, score1: 12, score2: 10, status: 'completed', winner: 'viet_code_devil' },
    { id: 'r1_m3', p1: 'shubham_v', elo1: 1318, p2: 'binary_beast', elo2: 1290, score1: 12, score2: 6, status: 'completed', winner: 'shubham_v' },
    { id: 'r1_m4', p1: 'tokyo_blitz', elo1: 1489, p2: 'lru_cache_god', elo2: 1435, score1: 12, score2: 11, status: 'completed', winner: 'tokyo_blitz' },
    { id: 'r1_m5', p1: 'pointer_sniper', elo1: 1395, p2: 'cpp_kid_4', elo2: 1220, score1: 9, score2: 12, status: 'completed', winner: 'cpp_kid_4' },
    { id: 'r1_m6', p1: 'alpha_coder', elo1: 1280, p2: 'omega_zero', elo2: 1210, score1: 12, score2: 7, status: 'completed', winner: 'alpha_coder' },
    { id: 'r1_m7', p1: 'YOU', elo1: 1200, p2: 'delta_duelist', elo2: 1180, score1: 12, score2: 10, status: 'completed', winner: 'YOU' },
    { id: 'r1_m8', p1: 'harsh_cpp', elo1: 1412, p2: 'std_vector_god', elo2: 1310, score1: 12, score2: 9, status: 'completed', winner: 'harsh_cpp' },
  ],
  round_2: [
    { id: 'r2_m1', p1: 'garvit_99', elo1: 1222, p2: 'viet_code_devil', elo2: 1438, score1: null, score2: null, status: 'live', winner: null },
    { id: 'r2_m2', p1: 'shubham_v', elo1: 1336, p2: 'tokyo_blitz', elo2: 1503, score1: 12, score2: 9, status: 'completed', winner: 'shubham_v' },
    { id: 'r2_m3', p1: 'cpp_kid_4', elo1: 1238, p2: 'alpha_coder', elo2: 1298, score1: null, score2: null, status: 'pending', winner: null },
    { id: 'r2_m4', p1: 'YOU', elo1: 1218, p2: 'harsh_cpp', elo2: 1426, score1: null, score2: null, status: 'pending', winner: null },
  ],
  round_3: [
    { id: 'r3_m1', p1: 'TBD', elo1: null, p2: 'shubham_v', elo2: 1354, score1: null, score2: null, status: 'pending', winner: null },
    { id: 'r3_m2', p1: 'TBD', elo1: null, p2: 'TBD', elo2: null, score1: null, score2: null, status: 'pending', winner: null },
  ],
  round_4: [
    { id: 'r4_m1', p1: 'TBD', elo1: null, p2: 'TBD', elo2: null, score1: null, score2: null, status: 'pending', winner: null }
  ]
};

export const TournamentBracket = ({ onSelectLiveMatch }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleNodeClick = (match) => {
    setSelectedMatch(match);
    if (match.status === 'live' && onSelectLiveMatch) {
      onSelectLiveMatch(match);
    }
  };

  const renderMatchNode = (match) => {
    const isCompleted = match.status === 'completed';
    const isLive = match.status === 'live';
    
    // Node border color based on status
    let nodeBorder = '1px solid #222';
    let pulseClass = '';
    
    if (isLive) {
      nodeBorder = '1px solid var(--accent-magenta)';
      pulseClass = 'live-pulse';
    } else if (isCompleted) {
      nodeBorder = '1px solid #333';
    }

    return (
      <div 
        key={match.id}
        onClick={() => handleNodeClick(match)}
        className={pulseClass}
        style={{
          width: '180px',
          backgroundColor: '#050505',
          border: nodeBorder,
          padding: '8px 12px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          margin: '12px 0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {isLive && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            left: '8px',
            backgroundColor: 'var(--accent-magenta)',
            color: '#fff',
            fontSize: '7px',
            padding: '1px 4px',
            fontWeight: 'bold',
            letterSpacing: '0.1em'
          }}>
            LIVE SPECTATE
          </span>
        )}

        {/* Player 1 Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: match.winner === match.p1 ? 'var(--accent-cyan)' : match.winner ? 'var(--text-muted)' : 'var(--text-primary)',
          fontWeight: match.winner === match.p1 ? 'bold' : 'normal'
        }}>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>
            {match.p1}
          </span>
          <span>{match.score1 !== null ? match.score1 : '-'}</span>
        </div>

        {/* Player 2 Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: match.winner === match.p2 ? 'var(--accent-cyan)' : match.winner ? 'var(--text-muted)' : 'var(--text-primary)',
          fontWeight: match.winner === match.p2 ? 'bold' : 'normal'
        }}>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>
            {match.p2}
          </span>
          <span>{match.score2 !== null ? match.score2 : '-'}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <CyberCard title="LIVE BRACKET TELEMETRY" systemCode="ENG.TOURNAMENT_BRA" statusText="AUTO_STAGGER">
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          India National Tournament Bracket (64 duelist capacity, seeded by ELO). Auto-progression staggered round starts: sibling duels trigger next rounds instantly. Click <b style={{ color: 'var(--accent-magenta)' }}>LIVE SPECTATE</b> to spectate in real-time.
        </p>

        {/* BRACKET WRAPPER AND FLEX TREE */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflowX: 'auto',
          padding: '24px 0',
          gap: '24px',
          minWidth: '850px'
        }}>
          
          {/* COLUMN 1: ROUND OF 16 (8 MATCHES) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '560px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 'bold', borderBottom: '1px solid #111', paddingBottom: '4px' }}>ROUND OF 16</div>
            {MOCK_BRACKET.round_1.map(renderMatchNode)}
          </div>

          {/* COLUMN 2: QUARTERS (4 MATCHES) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '560px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 'bold', borderBottom: '1px solid #111', paddingBottom: '4px' }}>QUARTERS</div>
            {MOCK_BRACKET.round_2.map(renderMatchNode)}
          </div>

          {/* COLUMN 3: SEMIS (2 MATCHES) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '560px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 'bold', borderBottom: '1px solid #111', paddingBottom: '4px' }}>SEMIS</div>
            {MOCK_BRACKET.round_3.map(renderMatchNode)}
          </div>

          {/* COLUMN 4: GRAND FINAL */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '560px', gap: '48px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 'bold', borderBottom: '1px solid #111', paddingBottom: '4px' }}>CHAMPIONSHIP</div>
            {MOCK_BRACKET.round_4.map(renderMatchNode)}
            <div className="clip-cyber-sm" style={{
              border: '1px dashed var(--accent-cyan)',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#020202',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              width: '180px'
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '0.2em' }}>TROPHY REVENUE</div>
              <div className="glow-cyan" style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                ₹50,000 PRIZE
              </div>
            </div>
          </div>

        </div>

        {/* NODAL METRICS BOTTOM POP-UP */}
        {selectedMatch && (
          <div style={{
            marginTop: '24px',
            border: '1px solid #222',
            padding: '16px',
            backgroundColor: '#020202',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>MATCH DETAILS [ID: {selectedMatch.id.toUpperCase()}]</span>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                {selectedMatch.p1} <span style={{ color: 'var(--accent-magenta)' }}>vs</span> {selectedMatch.p2}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Status: <span style={{ color: selectedMatch.status === 'live' ? 'var(--accent-magenta)' : selectedMatch.status === 'completed' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{selectedMatch.status.toUpperCase()}</span>
                {selectedMatch.winner && ` • Winner: ${selectedMatch.winner}`}
              </div>
            </div>
            {selectedMatch.status === 'live' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-magenta)' }}></span>
                <span style={{ fontSize: '11px', color: 'var(--accent-magenta)', fontWeight: 'bold' }}>MATCH IS ACTIVELY RUNNING IN ROOM 08</span>
              </div>
            )}
            {selectedMatch.status === 'completed' && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Solved in {Math.floor(Math.random() * 12) + 6}m {Math.floor(Math.random() * 60)}s • ELO exchanged
              </div>
            )}
          </div>
        )}
      </CyberCard>

      <style>{`
        .live-pulse {
          box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
          animation: pulseBorder 1.5s ease-in-out infinite;
        }
        @keyframes pulseBorder {
          0%, 100% { border-color: rgba(244, 63, 94, 0.5); }
          50% { border-color: rgba(244, 63, 94, 1); box-shadow: 0 0 15px rgba(244, 63, 94, 0.3); }
        }
      `}</style>

    </div>
  );
};
