import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberButton } from './CyberButton';
import { InteractiveBackground } from './InteractiveBackground';

// Live Self-Typing Editor for Battle Simulation
const TypingEditor = ({ active }) => {
  const [displayText, setDisplayText] = useState('');
  const codeLines = [
    '# AlgoClash Core Symmetric Match Engine',
    'def register_match_telemetry(duel_id, player_uuid):',
    '    telemetry = bind_keystroke_proctor(player_uuid)',
    '    cursor_socket = init_realtime_ghost_socket(duel_id)',
    '    ',
    '    while duel_active(duel_id):',
    '        # Monitor biometric typing rhythm',
    '        delta_ms = telemetry.get_next_keystroke_delta()',
    '        if delta_ms.is_anomalous_cheater():',
    '            trigger_firewall_lock(BLOCK_CLIPBOARD | FOCUS_LOCK)',
    '            ',
    '        # Stream ghost coordinate offsets',
    '        cursor_socket.broadcast(telemetry.coordinates)',
    '        recalculate_active_accuracy_ratio()',
    '        ',
    '    return declare_arena_gladiator_winner()'
  ];

  useEffect(() => {
    if (!active) {
      setDisplayText('');
      return;
    }

    let isMounted = true;
    let charIndex = 0;
    let lineIndex = 0;
    let currentText = '';

    const typeChar = () => {
      if (!isMounted) return;

      if (lineIndex < codeLines.length) {
        const currentLine = codeLines[lineIndex];
        if (charIndex < currentLine.length) {
          currentText += currentLine[charIndex];
          setDisplayText(currentText + '\n');
          charIndex++;
          setTimeout(typeChar, 14); // super fast high-octane typing speed
        } else {
          currentText += '\n';
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 60); // brief pause between lines
        }
      } else {
        // Reset and repeat typing loop
        setTimeout(() => {
          if (isMounted) {
            currentText = '';
            lineIndex = 0;
            charIndex = 0;
            setDisplayText('');
            typeChar();
          }
        }, 2500);
      }
    };

    typeChar();

    return () => {
      isMounted = false;
    };
  }, [active]);

  return (
    <pre style={{
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      color: 'var(--accent-cyan)',
      lineHeight: '1.45',
      textAlign: 'left',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all'
    }}>
      {displayText}
      <span style={{
        display: 'inline-block',
        width: '6px',
        height: '11px',
        backgroundColor: 'var(--accent-cyan)',
        animation: 'pulse 0.8s step-end infinite'
      }} />
    </pre>
  );
};

export const RedesignPage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  
  // Anti-Cheat Interactive typing widget state
  const [keystrokeDeltas, setKeystrokeDeltas] = useState([]);
  const [isGlitched, setIsGlitched] = useState(false);
  const [typingInputText, setTypingInputText] = useState('');
  const [typingFeedback, setTypingInputFeedback] = useState('PROCTORING STANDBY: PLACE CURSOR IN CONSOLE & TYPE');
  const [pasteError, setPasteError] = useState(false);
  
  const lastKeyTimeRef = useRef(null);
  const inputRef = useRef(null);

  // Dynamic viewport scrolling lock on mount to fix buggy nested scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  // IntersectionObserver to sync the current section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.55 }
    );

    const sections = document.querySelectorAll('.scroll-snap-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  // Manual click navigation scroll override
  const scrollToSection = (index) => {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(index);
    }
  };

  // Keystroke Rhythm biometric delta tracker
  const handleKeyDown = (e) => {
    // Ignore meta/modifier keys
    if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Shift' || e.key === 'Alt') {
      return;
    }

    const now = performance.now();
    if (lastKeyTimeRef.current !== null) {
      const delta = now - lastKeyTimeRef.current;
      // We only store normal typing deltas (< 1000ms) to keep graph bounded and beautiful
      if (delta < 1000) {
        setKeystrokeDeltas((prev) => [...prev.slice(-24), delta]); // Keep trailing 25 points
        
        // Dynamic analysis message
        if (delta < 50) {
          setTypingInputFeedback(`[KEYSTOKE DETECTED: ${Math.round(delta)}ms] APM CRITICAL // HYPER-COGNITIVE SPEED`);
        } else if (delta < 150) {
          setTypingInputFeedback(`[KEYSTOKE DETECTED: ${Math.round(delta)}ms] RHYTHM METRIC // SECURE_HUMAN_SIGNATURE`);
        } else {
          setTypingInputFeedback(`[KEYSTOKE DETECTED: ${Math.round(delta)}ms] ANALYSIS: NORMAL TYPING DELTA`);
        }
      }
    }
    lastKeyTimeRef.current = now;
  };

  // Paste Intercept to Trigger Anti-Cheat glitched lockdown visual
  const handlePaste = (e) => {
    e.preventDefault();
    setPasteError(true);
    setIsGlitched(true);
    setTypingInputFeedback('🚨 COGNITIVE INJECTION ANOMALY BLOCKED! CLOCK UNALIGNED.');
    
    // Auto clear alert lock after 3.5 seconds
    setTimeout(() => {
      setIsGlitched(false);
      setPasteError(false);
      setTypingInputFeedback('PROCTOR RE-ALIGNED. SCANNING KEYSTROKE STREAM...');
      setTypingInputText('');
    }, 3500);
  };

  // Generate beautiful biometric wave points
  const generateWavePath = () => {
    if (keystrokeDeltas.length === 0) {
      // Default idle scanning pulse line
      return "M 0 35 Q 75 35 150 35 T 300 35";
    }

    const width = 300;
    const height = 70;
    const pointsCount = keystrokeDeltas.length;
    
    return keystrokeDeltas.map((delta, i) => {
      const x = (i / (pointsCount - 1)) * width;
      // Map deltas ranging from 20ms to 600ms into height bounds
      const scaledY = height - Math.min(height - 5, Math.max(5, (delta / 400) * height));
      return `${i === 0 ? 'M' : 'L'} ${x} ${scaledY}`;
    }).join(' ');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background canvas simulation */}
      <InteractiveBackground />

      {/* Cyber Grid Scanlines */}
      <div className="scanlines" />

      {/* STICKY STATUS BAR HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '16px 4%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.95), transparent)',
        backdropFilter: 'blur(16px)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: activeSection === 0 ? 'var(--accent-slate)' : activeSection === 1 ? 'var(--accent-cyan)' : activeSection === 2 ? 'var(--accent-crimson)' : 'var(--accent-yellow)', 
              display: 'inline-block', 
              boxShadow: '0 0 12px currentColor', 
              transition: 'all 0.3s ease', 
              animation: 'pulse 1s infinite' 
            }} />
            ALGOCLASH // COGNITIVE_WARFARE
          </div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }} className="hidden md:inline">
            [HUD SYSTEM OPERATIONAL // SNAP LOCK ACTIVE]
          </span>
        </div>

        <a href="/" style={{ textDecoration: 'none' }}>
          <CyberButton variant="ghost" size="sm">
            [ EXIT COCKPIT ]
          </CyberButton>
        </a>
      </header>

      {/* FLOATING TACTILE HUD SIDEBAR NAV INDICATORS (Manual scroll snap overrides) */}
      <nav style={{
        position: 'fixed',
        left: '4%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {[0, 1, 2, 3].map((idx) => {
          const isActive = activeSection === idx;
          const label = idx === 0 ? '00 // INTRO' : idx === 1 ? '01 // LEETCODE_TOMBS' : idx === 2 ? '02 // CODEFORCES_QUEUES' : '03 // ANTI_CHEAT_SHIELD';
          const themeColor = idx === 0 ? 'var(--accent-slate)' : idx === 1 ? 'var(--accent-cyan)' : idx === 2 ? 'var(--accent-crimson)' : 'var(--accent-yellow)';
          
          return (
            <div 
              key={idx} 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => scrollToSection(idx)}
            >
              <div style={{
                width: isActive ? '12px' : '6px',
                height: isActive ? '12px' : '6px',
                backgroundColor: isActive ? themeColor : 'rgba(255,255,255,0.15)',
                boxShadow: isActive ? `0 0 10px ${themeColor}` : 'none',
                transform: 'rotate(45deg)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? 'bold' : 'normal',
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s ease'
              }} className="hidden lg:inline">
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* VIEWPORT SNAP WRAPPER */}
      <div 
        ref={containerRef}
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          position: 'relative',
          zIndex: 10,
          scrollBehavior: 'smooth'
        }}
        className="scroll-snap-container"
      >
        
        {/* SECTION 0: TACTICAL SYSTEM OVERVIEW INTRO */}
        <section 
          className="scroll-snap-section" 
          data-index="0"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            padding: '100px 5%'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 15,
            maxWidth: '900px'
          }}>
            {/* Spinning Scifi SVG Core Radar Widget */}
            <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '32px' }}>
              {/* Outer Hexagon (Rotating slowly) */}
              <svg width="180" height="180" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, transform: 'rotate(30deg)', animation: 'spin 18s linear infinite' }}>
                <polygon points="50,5 93.3,30 93.3,80 50,95 6.7,80 6.7,30" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" strokeDasharray="4, 3" />
              </svg>
              
              {/* Inner Circle Scan (Rotating opposite) */}
              <svg width="140" height="140" viewBox="0 0 100 100" style={{ position: 'absolute', top: '20px', left: '20px', animation: 'spin-reverse 10s linear infinite' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-slate)" strokeWidth="0.5" strokeDasharray="30, 10, 5, 10" style={{ opacity: 0.35 }} />
                <polygon points="50,15 80.3,32.5 80.3,67.5 50,85 19.7,67.5 19.7,32.5" fill="none" stroke="var(--accent-slate)" strokeWidth="1" style={{ opacity: 0.5 }} />
              </svg>

              {/* Core Crosshair Node (Blinking target lock) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--accent-slate)',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                animation: 'pulse 1s ease-in-out infinite',
                boxShadow: '0 0 12px var(--accent-slate)'
              }} />
              
              {/* Telemetry data readouts rotating around */}
              <span style={{ position: 'absolute', top: '10px', left: '190px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>[SEC_TARG: LEETCODE_VOID]</span>
              <span style={{ position: 'absolute', bottom: '15px', right: '190px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>[SEC_TARG: RETRO_LEDG_CF]</span>
            </div>

            <span style={{ fontSize: '10px', color: 'var(--accent-slate)', letterSpacing: '0.3em', fontWeight: 'bold' }}>
              ALGOCLASH // COGNITIVE DOMINANCE COCKPIT
            </span>
            
            <h1 className="font-display font-bold" style={{
              fontSize: 'clamp(28px, 6vw, 56px)',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginTop: '12px',
              lineHeight: '1.05',
              textShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}>
              A DIFFERENT LEAGUE
            </h1>
            
            <div style={{ height: '2px', width: '100px', backgroundColor: 'var(--accent-slate)', margin: '24px 0' }} />

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '680px',
              marginBottom: '32px'
            }}>
              Legacy platforms treat coding like a quiet library exam. Memorizers thrive, copy-pastes leak, and servers lag. AlgoClash introduces <span style={{ color: '#fff', fontWeight: 'bold' }}>Live Real-Time Symmetric Warfare</span>. We track the telemetry, sync the duelists, and proctor the keystrokes.
            </p>

            <div style={{ display: 'flex', gap: '16px' }} className="flex-col sm:flex-row">
              <CyberButton variant="primary" onClick={() => scrollToSection(1)}>
                [ DECRYPT DUELS ]
              </CyberButton>
              <CyberButton variant="ghost" onClick={() => scrollToSection(3)}>
                [ ANTI-CHEAT SHIELD ]
              </CyberButton>
            </div>
            
            {/* Scroll Assist */}
            <div style={{ marginTop: '48px', animation: 'bounce-micro 2s infinite', cursor: 'pointer' }} onClick={() => scrollToSection(1)}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
                SCROLL TO DEPLOY EXECS // ▼
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: DUEL 01 - THE COMPILER TOMB VS THE LIVE GLADIATOR (LeetCode) */}
        <section 
          className="scroll-snap-section" 
          data-index="1"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            padding: '100px 5% 40px 5%'
          }}
        >
          <div className="duel-grid">
            
            {/* Left Terminal: LeetCode (The Silent Tomb Void) */}
            <div className="terminal-card left">
              <div className="terminal-header red">
                <span>COMP_LC_01 // COLD_STAGNANT_GRID</span>
                <span className="blink-fast" style={{ color: 'var(--accent-crimson)' }}>● DEAD_VOID</span>
              </div>
              <div className="terminal-workspace greyed">
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: '#334155', textAlign: 'left', lineHeight: '1.4' }}>
                  {`// Memorizing standard array boilerplate...
// Submit passively into a cold void.
// No opponent is watching.
// No speed pressure. No adrenaline.

#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Just cheat from tab 2 or memo template
        return {0, 1};
    }
};`}
                </pre>

                {/* Simulated LeetCode Discord Leak Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(244, 63, 94, 0.05)',
                  border: '1px dashed rgba(244,63,94,0.3)',
                  padding: '12px',
                  fontSize: '9.5px',
                  color: 'var(--accent-crimson)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.4',
                  boxSizing: 'border-box'
                }} className="vibrate-micro">
                  <div style={{ fontWeight: 'bold', borderBottom: '1px dashed rgba(244,63,94,0.2)', paddingBottom: '4px', marginBottom: '4px' }}>
                    🚨 INTEGRITY ALERT: DISCORD CHESS LEAK
                  </div>
                  <span>[discord_bot]: 2Sum solution posted. 840 users copied template successfully.</span>
                </div>
              </div>
            </div>

            {/* Middle Divider Laser */}
            <div className="versus-divider">
              <div className="versus-text-gimmick">VS</div>
              <div className="versus-laser" style={{ background: 'linear-gradient(180deg, transparent, var(--accent-cyan), transparent)' }} />
            </div>

            {/* Right Terminal: AlgoClash Live Duel Editor */}
            <div className="terminal-card right cyan-glow">
              <div className="terminal-header cyan">
                <span>ALGOCLASH // SYMMETRIC_REALTIME_DUEL</span>
                <span className="pulse" style={{ color: 'var(--accent-cyan)' }}>● ACTIVE_LIVE</span>
              </div>
              <div className="terminal-workspace">
                <TypingEditor active={activeSection === 1} />
                
                {/* Simulated Ghost Cursor Tracking Badge */}
                <div style={{
                  position: 'absolute',
                  top: '100px',
                  right: '40px',
                  padding: '12px',
                  backgroundColor: 'rgba(0, 242, 254, 0.02)',
                  border: '1px solid var(--accent-cyan)',
                  boxShadow: '0 0 15px rgba(0, 242, 254, 0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  clipPath: 'polygon(0% 0%, 92% 0%, 100% 8px, 100% 100%, 8% 100%, 0% calc(100% - 8px))'
                }} className="vibrate-micro">
                  <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', display: 'inline-block', animation: 'pulse 0.5s infinite' }} />
                    [OPPONENT_GHOST_LINK]
                  </span>
                  <span>LATENCY: 8ms OK</span>
                  <span>ACCURACY RATE: 99.4%</span>
                  <span>LINE OFFSET: -4 lines</span>
                </div>
              </div>

              {/* Speedy mechanical indicator */}
              <div className="terminal-footer">
                <div className="speedometer-box">
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DUELIST APM SPEED</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    {/* Glowing Needle dial */}
                    <svg width="52" height="26" viewBox="0 0 50 25" fill="none">
                      <path d="M 5,25 A 20 25 0 0 1 45,25" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M 5,25 A 20 25 0 0 1 35,8" stroke="var(--accent-cyan)" strokeWidth="4" strokeLinecap="round" />
                      <line x1="25" y1="25" x2="38" y2="6" stroke="var(--accent-yellow)" strokeWidth="2.5" className="speed-needle" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>
                      280 APM <span style={{ color: 'var(--accent-cyan)', fontSize: '8.5px', marginLeft: '4px' }}>CRITICAL</span>
                    </span>
                  </div>
                </div>
                <div className="savage-quote cyan">
                  "LeetCode lets you code in a silent grave. AlgoClash feeds you to a live gladiator arena. Memorizers are executed on sight."
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: DUEL 02 - THE RETRO BUFFER VS THE WARP COMPILER (Codeforces) */}
        <section 
          className="scroll-snap-section" 
          data-index="2"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            padding: '100px 5% 40px 5%'
          }}
        >
          <div className="duel-grid">
            
            {/* Left Terminal: Codeforces (The 1990s Slow Buffer Queue) */}
            <div className="terminal-card left">
              <div className="terminal-header red">
                <span>COMP_CF_02 // SYSTEM_BUFFER_QUEUE</span>
                <span className="blink-fast" style={{ color: 'var(--accent-crimson)' }}>● LAG_BUFFER</span>
              </div>
              <div className="terminal-workspace greyed" style={{ justifyContent: 'center' }}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                  {`// Codeforces 1990s Table Ledger Submission.
[SERVER]: Recieved compilation hook. Enqueueing buffer...
[STATUS]: Queued. Wait in queue to check scoreboard compilation.
`}
                </pre>

                {/* Slow Retro Loader */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--accent-crimson)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  marginTop: '32px'
                }}>
                  <div className="spinning-retro" style={{ 
                    width: '26px', 
                    height: '26px', 
                    border: '2px solid rgba(244,63,94,0.1)', 
                    borderTop: '2.5px solid var(--accent-crimson)', 
                    borderRadius: '50%' 
                  }} />
                  <span>QUEUE POSITION: #4829 // RETRY_COUNT: 4</span>
                  <span style={{ fontSize: '9px', color: 'rgba(244,63,94,0.45)' }}>ETA: 14 MINUTES REMAINING</span>
                </div>
              </div>
            </div>

            {/* Middle Divider Laser */}
            <div className="versus-divider">
              <div className="versus-text-gimmick">VS</div>
              <div className="versus-laser" style={{ background: 'linear-gradient(180deg, transparent, var(--accent-crimson), transparent)' }} />
            </div>

            {/* Right Terminal: AlgoClash (Live matchmaker tree and brackets) */}
            <div className="terminal-card right crimson-glow">
              <div className="terminal-header crimson">
                <span>ALGOCLASH // INSTANT_WARP_MATCHMAKER</span>
                <span className="pulse" style={{ color: 'var(--accent-crimson)' }}>● LIVE_BRACKETING</span>
              </div>
              <div className="terminal-workspace" style={{ justifyContent: 'center' }}>
                
                {/* Simulated live-bracket node tree */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    MATCHMAKER STREAM // DOUBLE-ELIMINATION MATRIX
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
                    
                    {/* Players column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', zIndex: 12 }}>
                      <div className="bracket-node winner">
                        <span>P1: USER_GLADIATOR</span>
                        <span style={{ color: 'var(--accent-crimson)' }}>100% OK</span>
                      </div>
                      <div className="bracket-node loser">
                        <span>P2: RETRO_MEMORIZER</span>
                        <span>0% MELT</span>
                      </div>
                    </div>

                    {/* Connecting Laser lines */}
                    <svg width="120" height="70" style={{ overflow: 'visible', flex: 1, zIndex: 5 }}>
                      <path d="M 0,15 L 60,15 L 60,35 L 120,35" stroke="var(--accent-crimson)" strokeWidth="1.5" strokeDasharray="3,2" className="laser-bracket-line" fill="none" />
                      <path d="M 0,55 L 60,55 L 60,35" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
                    </svg>

                    {/* Quarterfinal Winners column */}
                    <div className="bracket-node active-duel" style={{ zIndex: 12 }}>
                      <span className="pulse-text" style={{ fontSize: '8.5px', color: 'var(--accent-crimson)' }}>CHAMPIONSHIP DUEL</span>
                      <span style={{ fontSize: '7px', color: '#fff' }}>WARP SPEED DIRECT</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Compiler delta speed indicator */}
              <div className="terminal-footer">
                <div className="speedometer-box">
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>MATCH RE-ROUTE SPEED</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>0.04s INSTANT</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--accent-crimson)', backgroundColor: 'rgba(244,63,94,0.1)', padding: '2px 8px', fontFamily: 'var(--font-mono)' }}>COMP_OK</span>
                  </div>
                </div>
                <div className="savage-quote crimson">
                  "Codeforces freezes your compiler in an ancient 1990s queue ledger. AlgoClash warp-matches and brackets your duel in milliseconds."
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: DUEL 03 - THE CHEATING CIRCUS VS THE ANTI-CHEAT KEYSTROKE SHIELD */}
        <section 
          className="scroll-snap-section" 
          data-index="3"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            padding: '100px 5% 40px 5%'
          }}
        >
          <div className="duel-grid">
            
            {/* Left Terminal: Generic Proctoring (The ChatGPT Tab-Switch Bypass Circus) */}
            <div className="terminal-card left">
              <div className="terminal-header red">
                <span>COMP_PROCT_03 // BYPASS_CIRCUS</span>
                <span className="blink-fast" style={{ color: 'var(--accent-yellow)' }}>● JOKED_INTEGRITY</span>
              </div>
              <div className="terminal-workspace greyed" style={{ justifyContent: 'center' }}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                  {`// Generic exam proctors check tab focus
[USER]: Switches tab to secondary browser...
[CHAT_GPT]: Generates 100% solution code.
[CLIPBOARD]: Code copied.
[USER]: Switches focus back. Paste command executed.
[STATUS]: Code compiles. Grade: A+ (Cheated)
`}
                </pre>

                {/* Animated Bypass Tag */}
                <div style={{
                  border: '1px solid var(--accent-yellow)',
                  backgroundColor: 'rgba(255,215,0,0.02)',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-yellow)',
                  textAlign: 'center',
                  marginTop: '24px',
                  clipPath: 'polygon(0% 0%, 94% 0%, 100% 6px, 100% 100%, 6% 100%, 0% calc(100% - 6px))'
                }} className="vibrate-micro">
                  [ INTEGRITY COMPROMISED ]<br />
                  COPY-PASTE EXPLOIT COMPLETED IN 2.1 SECONDS
                </div>
              </div>
            </div>

            {/* Middle Divider Laser */}
            <div className="versus-divider">
              <div className="versus-text-gimmick">VS</div>
              <div className="versus-laser" style={{ background: 'linear-gradient(180deg, transparent, var(--accent-yellow), transparent)' }} />
            </div>

            {/* Right Terminal: AlgoClash (Live Interactive Proctoring & Keystroke rhythm feedback) */}
            <div className="terminal-card right yellow-glow">
              <div className="terminal-header yellow">
                <span>ALGOCLASH // BIOMETRIC_COGNITIVE_FIREWALL</span>
                <span className="pulse" style={{ color: 'var(--accent-yellow)' }}>● SHIELD_DEPLOYED</span>
              </div>
              
              <div className="terminal-workspace" style={{ padding: '16px', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
                
                {/* Anti-cheat feedback console */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>MANDATE_PROCTOR // SYSTEM_STATUS</span>
                  <span style={{ color: isGlitched ? 'var(--accent-crimson)' : 'var(--accent-yellow)', fontWeight: 'bold' }}>
                    {isGlitched ? '🚨 THREAT_DETECTED' : '● SCANNING_STREAM'}
                  </span>
                </div>

                {/* THE INTERACTIVE TEXT INPUT BOX FOR USER TO ENGAGE */}
                <div style={{ position: 'relative', margin: '12px 0' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={typingInputText}
                    onChange={(e) => setTypingInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="[ CLICK HERE AND TYPE ON YOUR KEYBOARD TO TEST ]"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      border: isGlitched ? '2px solid var(--accent-crimson)' : '1px solid var(--accent-yellow)',
                      padding: '12px 16px',
                      color: isGlitched ? 'var(--accent-crimson)' : '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      clipPath: 'polygon(0% 0%, 96% 0%, 100% 8px, 100% 100%, 4% 100%, 0% calc(100% - 8px))',
                      transition: 'all 0.2s',
                      boxShadow: isGlitched ? '0 0 15px var(--accent-crimson)' : '0 0 10px rgba(255, 215, 0, 0.05)'
                    }}
                    disabled={isGlitched}
                  />
                </div>

                {/* REAL-TIME SVG KEYSTROKE WAVE PLOTTER */}
                <div style={{ 
                  flex: 1, 
                  backgroundColor: 'rgba(2, 2, 3, 0.8)', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '12px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  minHeight: '110px'
                }}>
                  <span style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    BIOMETRIC KEYSTROKE WAVEFORM // LIVE INTERVAL ANALYSIS
                  </span>

                  {/* Wave Graph SVG */}
                  <svg width="100%" height="70" viewBox="0 0 300 70" style={{ overflow: 'visible' }}>
                    {/* Horizontal scanning grids */}
                    <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="0" y1="15" x2="300" y2="15" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                    <line x1="0" y1="55" x2="300" y2="55" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                    
                    {/* Dynamic Biometric Path */}
                    <path 
                      d={generateWavePath()} 
                      fill="none" 
                      stroke={isGlitched ? 'var(--accent-crimson)' : keystrokeDeltas.length > 0 ? 'var(--accent-yellow)' : 'rgba(255,215,0,0.12)'} 
                      strokeWidth="2" 
                      className={keystrokeDeltas.length === 0 ? "laser-bracket-line" : ""}
                      style={{ transition: 'stroke 0.2s ease' }}
                    />
                    
                    {/* Live radar nodes */}
                    {keystrokeDeltas.length > 0 && (
                      <circle 
                        cx="300" 
                        cy={70 - Math.min(65, Math.max(5, (keystrokeDeltas[keystrokeDeltas.length - 1] / 400) * 70))} 
                        r="3.5" 
                        fill="var(--accent-yellow)" 
                        style={{ animation: 'pulse 0.4s infinite' }} 
                      />
                    )}
                  </svg>
                  
                  {/* Digital statistics readouts */}
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '8.5px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
                    <span>SAMPLE_NODES: {keystrokeDeltas.length}/25</span>
                    <span>INTERVAL_CAP: 1000ms</span>
                    <span>COGNITIVE_MATCH: {keystrokeDeltas.length > 0 ? 'SECURE_HUMAN_OK' : 'WAITING_INPUT'}</span>
                  </div>
                </div>

                {/* Warning Console logs */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  color: isGlitched ? 'var(--accent-crimson)' : 'var(--accent-yellow)',
                  border: isGlitched ? '1px dashed var(--accent-crimson)' : '1px dashed rgba(255,215,0,0.2)',
                  backgroundColor: isGlitched ? 'rgba(244,63,94,0.03)' : 'rgba(0,0,0,0.2)',
                  padding: '8px 12px',
                  marginTop: '10px',
                  boxSizing: 'border-box'
                }}>
                  {typingFeedback}
                </div>

                {/* FULL SCREEN PASTE DETECT GLITCH RED SHIELD LOCKDOWN OVERLAY */}
                <AnimatePresence>
                  {isGlitched && pasteError && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(2, 2, 3, 0.95)',
                        zIndex: 25,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        boxSizing: 'border-box',
                        border: '2px solid var(--accent-crimson)'
                      }}
                    >
                      <div className="hazard-stripes-crimson" style={{ width: '100%', height: '8px', position: 'absolute', top: 0, left: 0 }} />
                      <div className="hazard-stripes-crimson" style={{ width: '100%', height: '8px', position: 'absolute', bottom: 0, left: 0 }} />
                      
                      <div className="blink-fast" style={{
                        color: 'var(--accent-crimson)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        fontWeight: '900',
                        letterSpacing: '0.2em',
                        marginBottom: '10px',
                        textShadow: '0 0 15px var(--accent-crimson)'
                      }}>
                        ⚠️ COGNITIVE INJECTION ANOMALY BLOCKED!
                      </div>
                      
                      <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        color: '#fff',
                        textAlign: 'center',
                        lineHeight: '1.6',
                        maxWidth: '340px',
                        margin: '8px 0 16px 0'
                      }}>
                        INSTANT PASTE DETECTED. KEYBOARD TIME-DELTAs AT ZERO MILLISECONDS. CLIPBOARD IMPORT IS LOCKED. COGNITIVE bluePRINT PROTECTED.
                      </p>
                      
                      <div style={{
                        border: '1px solid var(--accent-crimson)',
                        backgroundColor: 'rgba(244,63,94,0.1)',
                        padding: '6px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        fontWeight: 'bold',
                        color: 'var(--accent-crimson)',
                        letterSpacing: '0.1em'
                      }}>
                        PROCTOR LOCKDOWN ACTIVE // AUTO-RELEASE: 3.5s
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Integrity Shield widget */}
              <div className="terminal-footer">
                <div className="speedometer-box">
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PROCTOR SHIELD INTEGRITY</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>100% BULLETPROOF</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--accent-yellow)', backgroundColor: 'rgba(255,215,0,0.1)', padding: '2px 8px', fontFamily: 'var(--font-mono)' }}>SHIELD_OK</span>
                  </div>
                </div>
                <div className="savage-quote yellow">
                  "Legacy boards let anyone cheat with ChatGPT copy-pastes. AlgoClash rhythm-proctors every single keystroke. Copy-paste doesn't exist here."
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* Embedded Animations and Scroll snap Layout styling */}
      <style>{`
        /* Native CSS Scroll Snapping configuration */
        .scroll-snap-container::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }

        .duel-grid {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          width: 100%;
          max-width: 1200px;
          height: 72vh;
          align-items: center;
          box-sizing: border-box;
          z-index: 15;
          position: relative;
        }

        @media (max-width: 991px) {
          .duel-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto 1fr;
            gap: 16px;
            height: auto;
            max-height: 85vh;
            overflow-y: auto;
            padding-bottom: 40px;
          }
          .versus-divider {
            flex-direction: row !important;
            height: auto !important;
            width: 100% !important;
            padding: 8px 0;
          }
          .versus-laser {
            width: 100% !important;
            height: 1px !important;
            background: linear-gradient(90deg, transparent, currentColor, transparent) !important;
          }
          .terminal-card {
            min-height: 240px;
          }
        }

        /* Terminal card designs */
        .terminal-card {
          background-color: #020203;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 45px rgba(0,0,0,0.92);
          position: relative;
          box-sizing: border-box;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .terminal-card.left {
          opacity: 0.5;
          filter: grayscale(40%);
        }
        .terminal-card.left:hover {
          opacity: 0.65;
          filter: grayscale(20%);
        }

        .terminal-card.cyan-glow:hover {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 35px rgba(0, 242, 254, 0.1), 0 16px 45px rgba(0,0,0,0.92);
        }
        .terminal-card.crimson-glow:hover {
          border-color: var(--accent-crimson);
          box-shadow: 0 0 35px rgba(244, 63, 94, 0.1), 0 16px 45px rgba(0,0,0,0.92);
        }
        .terminal-card.yellow-glow:hover {
          border-color: var(--accent-yellow);
          box-shadow: 0 0 35px rgba(255, 215, 0, 0.1), 0 16px 45px rgba(0,0,0,0.92);
        }

        .terminal-header {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 10px 18px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(255,255,255,0.015);
          font-weight: bold;
        }
        .terminal-header.red { color: var(--text-secondary); }
        .terminal-header.cyan { color: var(--accent-cyan); }
        .terminal-header.crimson { color: var(--accent-crimson); }
        .terminal-header.yellow { color: var(--accent-yellow); }

        .terminal-workspace {
          flex: 1;
          padding: 20px;
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .terminal-workspace.greyed {
          background-color: #010102;
        }

        .terminal-footer {
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background-color: rgba(0,0,0,0.25);
          box-sizing: border-box;
        }

        .speedometer-box {
          display: flex;
          flex-direction: column;
        }

        .savage-quote {
          font-family: var(--font-mono);
          font-style: italic;
          font-size: 10px;
          line-height: 1.4;
          text-align: right;
          max-width: 320px;
          opacity: 0.85;
        }
        .savage-quote.cyan { color: var(--accent-cyan); }
        .savage-quote.crimson { color: var(--accent-crimson); }
        .savage-quote.yellow { color: var(--accent-yellow); }

        /* Tournament Matchmaker Nodes */
        .bracket-node {
          background-color: #010102;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 10px 14px;
          font-family: var(--font-mono);
          font-size: 9px;
          width: 155px;
          display: flex;
          justify-content: space-between;
          clip-path: polygon(0% 0%, 94% 0%, 100% 6px, 100% 100%, 6% 100%, 0% calc(100% - 6px));
        }
        .bracket-node.winner {
          border-color: var(--accent-crimson);
          box-shadow: 0 0 12px rgba(244, 63, 94, 0.15);
        }
        .bracket-node.loser {
          opacity: 0.25;
        }
        .bracket-node.active-duel {
          border-color: var(--accent-crimson);
          background-color: rgba(244,63,94,0.02);
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.35);
          flex-direction: column;
          gap: 4px;
          align-items: center;
          justify-content: center;
          width: 155px;
        }

        /* Divider laser */
        .versus-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
        }
        .versus-text-gimmick {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 900;
          font-size: 13px;
          color: var(--text-secondary);
          background-color: #000000;
          border: 1px solid rgba(255,255,255,0.06);
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 2;
          margin: 12px 0;
        }
        .versus-laser {
          position: absolute;
          width: 1.5px;
          height: 100%;
          z-index: 1;
          opacity: 0.3;
        }

        /* Speed needles and other animations */
        .speed-needle {
          transform-origin: 25px 25px;
          animation: needle-shake 0.4s ease-in-out infinite alternate;
        }
        @keyframes needle-shake {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(10deg); }
        }

        .spinning-retro {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          100% { transform: rotate(-360deg); }
        }

        .vibrate-micro {
          animation: shake 0.2s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0.5px, -0.5px); }
          75% { transform: translate(-0.5px, 0.5px); }
        }

        .laser-bracket-line {
          stroke-dasharray: 8;
          animation: laser-dash 1.2s linear infinite;
        }
        @keyframes laser-dash {
          100% { stroke-dashoffset: -16; }
        }

        @keyframes bounce-micro {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>

    </div>
  );
};
