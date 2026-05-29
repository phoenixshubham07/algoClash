import React, { useState, useEffect, useRef } from 'react';
import { CyberButton } from './CyberButton';
import { CyberCard } from './CyberCard';

const PROBLEMS_DATA = {
  title: 'BLITZ_04: XOR_PATH_MINIMIZE',
  difficulty: 'MEDIUM',
  description: 'Given a grid of size N x N filled with integers. You start at (0,0) and can only move right and down to reach (N-1, N-1). Return the minimum possible XOR sum of the path. N <= 10^5.',
  test_cases: [
    { input: 'N=3, Grid=[[1,2,3],[3,4,5],[2,1,0]]', output: '2' },
    { input: 'N=2, Grid=[[1,3],[2,4]]', output: '5' }
  ],
  sample_code: {
    cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint minimizeXorPath(int n, vector<vector<int>>& grid) {\n    // TODO: Implement DP memory state\n    int current_xor = 0;\n    \n    // Optimize time complexity from O(2^N) to O(N^2)\n    \n}`,
    python: `def minimize_xor_path(n, grid):\n    # TODO: Implement DP memory state\n    current_xor = 0\n    \n    # Optimize time complexity from O(2^N) to O(N^2)\n    pass`,
    java: `import java.util.*;\n\npublic class Solution {\n    public int minimizeXorPath(int n, int[][] grid) {\n        // TODO: Implement DP memory state\n        int currentXor = 0;\n        \n        // Optimize time complexity from O(2^N) to O(N^2)\n        return 0;\n    }\n}`
  },
  opponent_code: {
    cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint minimizeXorPath(int n, vector<vector<int>>& grid) {\n    vector<vector<int>> dp(n, vector<int>(n, 99999));\n    dp[0][0] = grid[0][0];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if(i > 0) dp[i][j] = min(dp[i][j], dp[i-1][j] ^ grid[i][j]);\n            if(j > 0) dp[i][j] = min(dp[i][j], dp[i][j-1] ^ grid[i][j]);\n        }\n    }\n    return dp[n-1][n-1];\n}`,
    python: `def minimize_xor_path(n, grid):\n    dp = [[99999] * n for _ in range(n)]\n    dp[0][0] = grid[0][0]\n    for i in range(n):\n        for j in range(n):\n            if i > 0: dp[i][j] = min(dp[i][j], dp[i-1][j] ^ grid[i][j])\n            if j > 0: dp[i][j] = min(dp[i][j], dp[i][j-1] ^ grid[i][j])\n    return dp[n-1][n-1]`,
    java: `import java.util.*;\npublic class Solution {\n    public int minimizeXorPath(int n, int[][] grid) {\n        int[][] dp = new int[n][n];\n        dp[0][0] = grid[0][0];\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                if (i > 0) dp[i][j] = Math.min(dp[i][j], dp[i-1][j] ^ grid[i][j]);\n                if (j > 0) dp[i][j] = Math.min(dp[i][j], dp[i][j-1] ^ grid[i][j]);\n            }\n        }\n        return dp[n-1][n-1];\n    }\n}`
  }
};

export const CombatSimulator = ({ opponent, onMatchEnd }) => {
  const [lang, setLang] = useState('cpp');
  const [code, setCode] = useState(PROBLEMS_DATA.sample_code.cpp);
  const [timeLeft, setTimeLeft] = useState(90); // 90-second speed match
  const [myAttempts, setMyAttempts] = useState(2);
  const [myCasesPassed, setMyCasesPassed] = useState(0);
  const [opponentAttempts, setOpponentAttempts] = useState(2);
  const [opponentCasesPassed, setOpponentCasesPassed] = useState(0);
  const [opponentLine, setOpponentLine] = useState(1);
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [dangerPulse, setDangerPulse] = useState(false);
  const [gameResult, setGameResult] = useState(null); // null | 'victory' | 'defeat'
  const [consoleLogs, setConsoleLogs] = useState(['[SYSTEM] Match initialized.', '[SYSTEM] Submissions cap set to 2.']);
  const [opponentCodeStream, setOpponentCodeStream] = useState('');

  const oppCodeRef = useRef('');
  const codeIndexRef = useRef(0);

  // Update starter code when language changes
  useEffect(() => {
    setCode(PROBLEMS_DATA.sample_code[lang]);
  }, [lang]);

  // Main countdown timer
  useEffect(() => {
    if (gameResult) return;
    
    if (timeLeft > 0) {
      const t = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(t);
    } else {
      // Time out!
      triggerMatchEnd('defeat', 'TIMEOUT: Opponent solved the problem while you ran out of time.');
    }
  }, [timeLeft, gameResult]);

  // Simulated Opponent Activity Loop
  useEffect(() => {
    if (gameResult) return;

    // Load reference opponent code based on their language
    const fullOpponentCode = PROBLEMS_DATA.opponent_code[opponent.lang];
    oppCodeRef.current = fullOpponentCode;

    // Interval to simulate opponent typing
    const typingInterval = setInterval(() => {
      setOpponentTyping(true);
      
      // Selectively add characters
      const charsToAdd = Math.floor(Math.random() * 8) + 3;
      codeIndexRef.current = Math.min(codeIndexRef.current + charsToAdd, oppCodeRef.current.length);
      setOpponentCodeStream(oppCodeRef.current.slice(0, codeIndexRef.current));
      
      // Set opponent line number based on newlines in stream
      const lines = oppCodeRef.current.slice(0, codeIndexRef.current).split('\n').length;
      setOpponentLine(lines);

      setTimeout(() => setOpponentTyping(false), 200);

      // Stop typing if completed
      if (codeIndexRef.current >= oppCodeRef.current.length) {
        clearInterval(typingInterval);
      }
    }, 400);

    return () => clearInterval(typingInterval);
  }, [opponent, gameResult]);

  // Simulated Opponent Submission events
  useEffect(() => {
    if (gameResult) return;

    // Schedule Opponent submission 1 (WA / Partial Solve) at 35 seconds
    const oppSubmit1 = setTimeout(() => {
      setOpponentAttempts(1);
      setOpponentCasesPassed(7); // Passed 7/12 cases
      setConsoleLogs(prev => [
        ...prev,
        `[TELEMETRY] ${opponent.username} submitted: WA (7/12 test cases passed).`
      ]);
    }, 30000);

    // Schedule Opponent submission 2 (AC / Full Solve + RED SCREEN) at 60 seconds
    const oppSubmit2 = setTimeout(() => {
      setOpponentAttempts(0);
      setOpponentCasesPassed(12); // Passed 12/12 cases
      setDangerPulse(true); // Red screen pulse
      
      setConsoleLogs(prev => [
        ...prev,
        `[WARN] CRITICAL ALERT: ${opponent.username} has reached 100% test cases passed!`,
        `[TELEMETRY] ${opponent.username} completed the match with AC (12/12 cases).`
      ]);

      // If user hasn't finished, opponent wins after 4 seconds of red screen pulsing!
      const loseDelay = setTimeout(() => {
        if (!gameResult) {
          triggerMatchEnd('defeat', `${opponent.username} locked in the final solution before you!`);
        }
      }, 5000);

      return () => clearTimeout(loseDelay);

    }, 55000);

    return () => {
      clearTimeout(oppSubmit1);
      clearTimeout(oppSubmit2);
    };
  }, [opponent, gameResult]);

  const runTestCases = () => {
    setConsoleLogs(prev => [...prev, `[USER] Initiating sample compilation in ${lang.toUpperCase()}...`]);
    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `[EXECUTION] Sample test case 1: PASSED.`,
        `[EXECUTION] Sample test case 2: PASSED.`,
        `[SYSTEM] Code is syntactically sound. Ready for Hidden submission.`
      ]);
    }, 1000);
  };

  const submitCode = () => {
    if (myAttempts <= 0) return;
    
    const attemptsLeft = myAttempts - 1;
    setMyAttempts(attemptsLeft);
    
    setConsoleLogs(prev => [...prev, `[USER] SUBMITTING CODE to Judge System...`]);
    
    // Evaluate if code is solved. Let's say if the user completes the code or clicks submit on attempt 2, they succeed!
    // Or let's make it a nice visual progress check:
    // If they have 2 attempts, the first yields 10/12 (WA, trigger red warning overlay to let them fix it).
    // The second attempt yields 12/12 (AC, Victory!).
    setTimeout(() => {
      if (myAttempts === 2) {
        setMyCasesPassed(10);
        setConsoleLogs(prev => [
          ...prev,
          `[JUDGE] Result: WA (10/12 hidden test cases passed).`,
          `[SYSTEM] Performance bounds satisfied. Logical error on extreme corner constraint.`
        ]);
      } else {
        setMyCasesPassed(12);
        setConsoleLogs(prev => [
          ...prev,
          `[JUDGE] Result: AC (12/12 hidden test cases passed).`
        ]);
        triggerMatchEnd('victory', `Perfect Solve! You defeated ${opponent.username} with ELO +18.`);
      }
    }, 1500);
  };

  const triggerMatchEnd = (result, details) => {
    setGameResult(result);
    setDangerPulse(false);
    setConsoleLogs(prev => [...prev, `[SYSTEM] Match ended. Status: ${result.toUpperCase()}.`]);
    
    // Switch to spectator / paywall dashboard in 4 seconds
    setTimeout(() => {
      onMatchEnd({
        result,
        details,
        opponent,
        opponentFinalCode: PROBLEMS_DATA.opponent_code[opponent.lang]
      });
    }, 4500);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} className={dangerPulse ? 'danger-mode' : ''}>
      
      {/* ARENA HEADER: MATCH CARDS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* PLAYER CARD LEFT */}
        <div className="clip-cyber-sm" style={{ border: '1px solid var(--accent-cyan)', padding: '12px 24px', backgroundColor: '#050505', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '220px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>U</div>
          <div>
            <div className="font-display" style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px', letterSpacing: '0.05em' }}>YOU [SOLVER]</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ELO: 1200</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SUBMITS:</span>
              <span style={{ fontSize: '10px', color: myAttempts === 1 ? 'var(--accent-yellow)' : myAttempts === 0 ? 'var(--accent-magenta)' : 'var(--accent-cyan)', fontWeight: 'bold' }}>{myAttempts}/2 LEFT</span>
            </div>
          </div>
        </div>

        {/* COMPRESSED ARENA TIMER */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>ROUND DEADLINE</span>
          <div className="font-display glow-cyan" style={{ fontSize: '28px', fontWeight: '800', color: timeLeft <= 15 ? 'var(--accent-magenta)' : 'var(--accent-cyan)', animation: timeLeft <= 15 ? 'blink-cursor 0.5s ease infinite' : 'none' }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          {dangerPulse && (
            <div className="glow-magenta" style={{ fontSize: '9px', color: 'var(--accent-magenta)', fontWeight: 'bold', letterSpacing: '0.1em', marginTop: '2px', animation: 'blink-cursor 0.8s step-end infinite' }}>
              CRITICAL DANGER: OPPONENT IN AC PATH
            </div>
          )}
        </div>

        {/* PLAYER CARD RIGHT */}
        <div className="clip-cyber-sm" style={{ border: '1px solid var(--accent-magenta)', padding: '12px 24px', backgroundColor: '#050505', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '220px', textAlign: 'right', flexDirection: 'row-reverse' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-magenta)' }}>{opponent.avatar}</div>
          <div>
            <div className="font-display" style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px', letterSpacing: '0.05em' }}>{opponent.username}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ELO: {opponent.elo}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SUBMITS:</span>
              <span style={{ fontSize: '10px', color: opponentAttempts === 1 ? 'var(--accent-yellow)' : opponentAttempts === 0 ? 'var(--accent-magenta)' : 'var(--accent-cyan)', fontWeight: 'bold' }}>{opponentAttempts}/2 LEFT</span>
            </div>
          </div>
        </div>

      </div>

      {/* MORTAL KOMBAT LIFEBARS / TEST CASES */}
      <div style={{ border: '1px solid #111', padding: '16px', backgroundColor: '#020202', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Your bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>
            <span>YOUR EVALUATION ACCURACY</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{myCasesPassed}/12 CASES PASSED</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#111', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(myCasesPassed / 12) * 100}%`, backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>

        {/* Opponent's bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>
            <span>OPPONENT EVALUATION ACCURACY</span>
            <span style={{ color: 'var(--accent-magenta)' }}>{opponentCasesPassed}/12 CASES PASSED</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#111', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(opponentCasesPassed / 12) * 100}%`, backgroundColor: 'var(--accent-magenta)', boxShadow: '0 0 10px var(--accent-magenta)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>
      </div>

      {/* DUAL WORKSPACE: SIDE-BY-SIDE CODING */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '360px', flexWrap: 'wrap' }}>
        
        {/* CODE EDITOR PANELS (LEFT: YOU) */}
        <CyberCard title="BLITZ ARENA EDITOR" variant="primary" systemCode="SYS.INPUT_STREAM" statusText="EDITING" style={{ height: '100%', minHeight: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #1a1a1a', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 'bold' }}>PROBLEM: minimize_xor_path</span>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{
                backgroundColor: '#020202',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan)',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '0px'
              }}
            >
              <option value="cpp">C++ (GCC 13)</option>
              <option value="python">Python (3.11)</option>
              <option value="java">Java (JDK 21)</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#020202',
              color: 'var(--text-primary)',
              border: '1px solid #1a1a1a',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none',
              padding: '12px',
              resize: 'none',
              lineHeight: 1.5
            }}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <CyberButton variant="ghost" size="sm" onClick={runTestCases} style={{ flexGrow: 1 }}>
              TEST RUN
            </CyberButton>
            <CyberButton variant="primary" size="sm" onClick={submitCode} disabled={myAttempts <= 0} style={{ flexGrow: 2 }}>
              SUBMIT CODE ({myAttempts})
            </CyberButton>
          </div>
        </CyberCard>

        {/* CODE EDITOR PANELS (RIGHT: OPPONENT) */}
        <CyberCard title={`${opponent.username.toUpperCase()} SPECTATE`} variant="danger" systemCode="SYS.SPECTATE_LINK" statusText={opponentTyping ? 'TYPING' : 'IDLE'} style={{ height: '100%', minHeight: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #1a1a1a', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 'bold' }}>LANGUAGE: {opponent.lang.toUpperCase()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--accent-magenta)' }}>GHOST CURSOR ON LINE:</span>
              <span className="glow-magenta" style={{ fontWeight: 'bold', fontSize: '12px' }}>{opponentLine}</span>
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#020202',
            color: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid #1a1a1a',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '12px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
            position: 'relative'
          }}>
            {opponentCodeStream || '// Waiting for opponent keypress...'}

            {/* Custom visual ghost line pointer */}
            <div style={{
              position: 'absolute',
              top: `${(opponentLine - 1) * 18 + 12}px`,
              left: '0',
              right: '0',
              height: '18px',
              backgroundColor: 'rgba(244, 63, 94, 0.05)',
              borderLeft: '2px solid var(--accent-magenta)',
              pointerEvents: 'none',
              transition: 'top 0.2s ease-out'
            }}>
              <span style={{ position: 'absolute', right: '12px', fontSize: '8px', color: 'var(--accent-magenta)', opacity: 0.7, top: '2px' }}>
                [GHOST CURSOR]
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>SPEED MATCH ACTIVITY:</span>
            <span style={{ color: opponentTyping ? 'var(--accent-magenta)' : 'var(--text-muted)', fontWeight: 'bold' }}>
              {opponentTyping ? '⚡ TRANSMITTING' : '• STANDBY'}
            </span>
          </div>
        </CyberCard>

      </div>

      {/* TELEMETRY / CONSOLE LOG OUTPUT */}
      <div style={{ marginTop: '24px' }}>
        <CyberCard title="ARENA CONSOLE / COMPILER OUTPUT" systemCode="SYS.STDOUT" statusText="LIVE">
          <div style={{
            height: '110px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {consoleLogs.map((log, i) => {
              let logColor = 'var(--text-secondary)';
              if (log.startsWith('[SYSTEM]')) logColor = 'var(--accent-cyan)';
              else if (log.startsWith('[WARN]') || log.startsWith('[TELEMETRY]')) logColor = 'var(--accent-yellow)';
              else if (log.startsWith('[JUDGE] Result: AC')) logColor = 'var(--accent-cyan)';
              else if (log.startsWith('[JUDGE] Result: WA')) logColor = 'var(--accent-magenta)';
              else if (log.startsWith('[EXECUTION]')) logColor = 'rgba(255,255,255,0.7)';
              
              return (
                <div key={i} style={{ color: logColor }}>
                  {log}
                </div>
              );
            })}
          </div>
        </CyberCard>
      </div>

      {/* OVERLAY: VICTORY / DEFEAT SCREENS */}
      {gameResult && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(2, 2, 2, 0.95)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="grid-bg" style={{ opacity: 0.15 }}></div>
          
          <div style={{
            border: `2px solid ${gameResult === 'victory' ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
            padding: '48px',
            backgroundColor: '#050505',
            textAlign: 'center',
            maxWidth: '600px',
            boxShadow: `0 0 40px ${gameResult === 'victory' ? 'rgba(0, 242, 254, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            animation: 'scaleUp 0.3s ease-out',
            position: 'relative'
          }}>
            <h2 className="font-display" style={{
              fontSize: '54px',
              fontWeight: '900',
              letterSpacing: '0.15em',
              color: gameResult === 'victory' ? 'var(--accent-cyan)' : '#888',
              textShadow: gameResult === 'victory' ? '0 0 15px rgba(0, 242, 254, 0.6)' : 'none',
              textTransform: 'uppercase'
            }}>
              {gameResult === 'victory' ? 'VICTORY' : 'DEFEATED'}
            </h2>
            
            <p style={{ margin: '24px 0', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {gameResult === 'victory' 
                ? `Perfect solve in time. You outclassed ${opponent.username} and advanced in the bracket.`
                : `Outplayed. ${opponent.username} locked in the optimized path first.`}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#020202',
              padding: '16px',
              border: '1px solid #111',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ELO ADJUSTMENT</span>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: gameResult === 'victory' ? 'var(--accent-cyan)' : 'var(--accent-magenta)', marginTop: '4px' }}>
                  {gameResult === 'victory' ? '+18 ELO' : '-14 ELO'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MATCH TIME</span>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  {formatTime(90 - timeLeft)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="cursor-blink" style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-cyan)' }}></span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                LOADING ANALYSIS INJECTOR...
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
