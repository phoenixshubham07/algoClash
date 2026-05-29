import React, { useState } from 'react';
import { CyberButton } from './CyberButton';
import { CyberCard } from './CyberCard';

const MOCK_MESSAGES = [
  'Generating micro-time vectors...',
  'Extracting AST differentials...',
  'Decrypting ELO metrics...',
  'Compiling comparison logs...',
  'Ready.'
];

export const CodeComparisonPaywall = ({ opponent, opponentFinalCode, onReset }) => {
  const [timelineVal, setTimelineVal] = useState(70); // percentage of round elapsed (0 - 100)
  const [paywallLocked, setPaywallLocked] = useState(true);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [sysLog, setSysLog] = useState('DECRYPT_TARGET: SECURE_HASH_39FF');

  const handleUnlock = () => {
    setIsDecrypting(true);
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 20;
      setDecryptProgress(progress);
      setSysLog(MOCK_MESSAGES[progress / 20 - 1] || 'Finalizing...');

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPaywallLocked(false);
          setIsDecrypting(false);
        }, 600);
      }
    }, 450);
  };

  // Determine line highlights based on timeline value
  const myHighlightLine = Math.min(Math.floor(timelineVal / 10) + 1, 10);
  const opponentHighlightLine = Math.min(Math.floor(timelineVal / 8) + 1, 13);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* TIMELINE DECK */}
      <div style={{ border: '1px solid var(--accent-cyan)', padding: '20px', backgroundColor: '#050505', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.25em', fontWeight: 'bold' }}>TACTICAL RUNTIME ANALYZER</span>
            <h3 className="font-display font-bold" style={{ fontSize: '20px', color: '#fff', marginTop: '4px', letterSpacing: '0.05em' }}>
              MATCH SCRUBBER TIMELINE
            </h3>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-cyan)' }}>
            TIMELINE SLIDER: {Math.floor((timelineVal / 100) * 14)}m {Math.floor((timelineVal % 10) * 6)}s / 14:32
          </span>
        </div>

        <input 
          type="range" 
          min="0" 
          max="100" 
          value={timelineVal} 
          onChange={(e) => setTimelineVal(Number(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#111',
            outline: 'none',
            border: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            accentColor: 'var(--accent-cyan)'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px' }}>
          <span>00:00 [MATCH_START]</span>
          <span>03:40 [YOUR_SUBMIT_1]</span>
          <span>06:12 [OPP_SUBMIT_1: WA]</span>
          <span>11:20 [OPP_SUBMIT_2: AC]</span>
          <span>14:32 [MATCH_END]</span>
        </div>
      </div>

      {/* COMPARATIVE EDITOR STACK */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '320px', marginBottom: '24px' }}>
        
        {/* YOUR CODE SIDE */}
        <CyberCard title="YOUR RUNTIME CODE" variant="default" systemCode="SYS.SOLVER_DUMP" statusText="DUMPED">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            HIGHLIGHTED ACTIVE LINE AT SECOND {Math.floor(timelineVal * 8)}:
          </div>
          <div style={{
            height: '240px',
            backgroundColor: '#020202',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid #1a1a1a',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '12px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            position: 'relative'
          }}>
            {`#include <iostream>\n#include <vector>\nusing namespace std;\n\nint minimizeXorPath(int n, vector<vector<int>>& grid) {\n    // Dynamic Programming Attempt 1\n    int val = grid[0][0];\n    // Recursive backtracking (Caused WA on limit case 9)\n    int pathSum = backtrack(grid, 0, 0);\n}`}
            
            {/* Scrubber highlight */}
            <div style={{
              position: 'absolute',
              top: `${(myHighlightLine - 1) * 19 + 12}px`,
              left: 0,
              right: 0,
              height: '19px',
              backgroundColor: 'rgba(0, 242, 254, 0.05)',
              borderLeft: '2px solid var(--accent-cyan)',
              transition: 'top 0.15s ease'
            }}>
              <span style={{ position: 'absolute', right: '12px', fontSize: '8px', color: 'var(--accent-cyan)', opacity: 0.6, top: '2px' }}>
                [EDITOR_POS]
              </span>
            </div>
          </div>
        </CyberCard>

        {/* OPPONENT CODE SIDE */}
        <CyberCard title={`${opponent.username.toUpperCase()} CODE DUMP`} variant="default" systemCode="SYS.OPPONENT_DUMP" statusText="READ_ONLY">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            HIGHLIGHTED ACTIVE LINE AT SECOND {Math.floor(timelineVal * 8)}:
          </div>
          <div style={{
            height: '240px',
            backgroundColor: '#020202',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid #1a1a1a',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '12px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            position: 'relative'
          }}>
            {opponentFinalCode || '// Loading opponent code buffer...'}
            
            {/* Scrubber highlight */}
            <div style={{
              position: 'absolute',
              top: `${(opponentHighlightLine - 1) * 19 + 12}px`,
              left: 0,
              right: 0,
              height: '19px',
              backgroundColor: 'rgba(244, 63, 94, 0.05)',
              borderLeft: '2px solid var(--accent-magenta)',
              transition: 'top 0.15s ease'
            }}>
              <span style={{ position: 'absolute', right: '12px', fontSize: '8px', color: 'var(--accent-magenta)', opacity: 0.6, top: '2px' }}>
                [EDITOR_POS]
              </span>
            </div>
          </div>
        </CyberCard>

      </div>

      {/* INTERACTIVE PAYWALL REPORT COMPONENT */}
      <div style={{ position: 'relative', width: '100%' }}>
        {paywallLocked ? (
          <div className="clip-cyber-inverted" style={{
            border: '1px dashed var(--accent-magenta)',
            backgroundColor: 'rgba(5, 5, 5, 0.9)',
            padding: '40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            {/* Scanning background beams */}
            <div className="scanner-beam" style={{ animationDuration: '4s', opacity: 0.08 }}></div>
            
            <div style={{ maxWidth: '600px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
              <span className="glow-magenta" style={{ fontSize: '11px', color: 'var(--accent-magenta)', fontWeight: 'bold', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                🔒 DIAGNOSTIC CORE BLOCKED
              </span>
              
              <h2 className="font-display font-bold" style={{ fontSize: '28px', color: '#fff', margin: '12px 0 16px 0', letterSpacing: '0.05em' }}>
                DETAILED DIVERGENCE ANALYSIS
              </h2>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Get full access to the side-by-side AST differential. Reveal the exact hidden inputs that failed your compiler. Inspect the timeline logs and unlock the AI-generated logic repair blueprint.
              </p>

              {isDecrypting ? (
                <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--accent-magenta)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                    <span>DECRYPTING: {decryptProgress}%</span>
                    <span>{sysLog}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#111', width: '100%', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${decryptProgress}%`, backgroundColor: 'var(--accent-magenta)', boxShadow: '0 0 8px var(--accent-magenta)', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <CyberButton variant="danger" size="md" onClick={handleUnlock}>
                    UNLOCK REPORT (₹29)
                  </CyberButton>
                  <CyberButton variant="ghost" size="md" onClick={handleUnlock}>
                    FREE WITH PRO (₹199/MO)
                  </CyberButton>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="clip-cyber-sm" style={{
            border: '1px solid var(--accent-cyan)',
            backgroundColor: '#050505',
            padding: '32px',
            animation: 'revealReport 0.8s ease-out'
          }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.25em', fontWeight: 'bold' }}>🔓 DECRYPTED DIAGNOSTIC CORE RELEASED</span>
            <h3 className="font-display font-bold glow-cyan" style={{ fontSize: '24px', color: '#fff', margin: '8px 0 16px 0' }}>
              ALGORITHMIC ANOMALY AUDIT
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
              {/* Left Column: AST Divergence */}
              <div style={{ borderRight: '1px solid #111', paddingRight: '20px' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--accent-yellow)', fontWeight: 'bold', marginBottom: '8px' }}>
                  1. DIVERGENCE POINT IDENTIFIED (T=03:40)
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Your implementation used recursive depth backtracking. This yields an elegant O(N) spatial memory complexity but suffers from O(2^N) exponential time growth. Under test constraint N=10^5, this triggered a hard Time Limit Exceeded (TLE) error at Hidden Case 9.
                </p>
                <div style={{ margin: '16px 0', border: '1px dashed #222', padding: '12px', backgroundColor: '#020202', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-magenta)' }}>
                  ⚠️ Hidden Case 9 Input: N=100000, GraphDensity=0.88
                </div>
              </div>

              {/* Right Column: AI Repairs */}
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 'bold', marginBottom: '8px' }}>
                  2. PROPOSED ALGORITHMIC PATH REPAIR
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Replace back-indexing recursive steps with iterative state-table dynamic programming. Pre-allocate an array size of N x N to capture XOR sum state vectors. This shifts the runtime boundary back to a comfortable O(N^2) linear trajectory, resolving hidden boundary gates.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>AI CORRECTION CONFIDENCE: 99.4%</span>
                </div>
              </div>
            </div>
            
            <style>{`
              @keyframes revealReport {
                from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
              }
            `}</style>
          </div>
        )}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <CyberButton variant="primary" size="md" onClick={onReset}>
          RETURN TO MAIN ARENA
        </CyberButton>
      </div>

    </div>
  );
};
