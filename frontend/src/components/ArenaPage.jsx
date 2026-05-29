import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Trophy, 
  Zap, 
  Terminal, 
  User, 
  Cpu, 
  Activity, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Play, 
  Send, 
  Sparkles,
  Eye,
  Clock,
  Award,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  Copy,
  ChevronDown
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Predefined Pool of Rivals for the Matchmaker Roulette
const RIVAL_POOL = [
  { username: 'garvit_99', elo: 1204, country: 'IN', flag: '🇮🇳', avatarColor: '#EF4444' },
  { username: 'tourist_fan', elo: 1420, country: 'VN', flag: '🇻🇳', avatarColor: '#F59E0B' },
  { username: 'cpp_assassin', elo: 1195, country: 'KR', flag: '🇰🇷', avatarColor: '#3B82F6' },
  { username: 'buffered_reader', elo: 1250, country: 'JP', flag: '🇯🇵', avatarColor: '#10B981' },
  { username: 'python_beast', elo: 1310, country: 'SG', flag: '🇸🇬', avatarColor: '#8B5CF6' },
  { username: 'compile_error_god', elo: 1180, country: 'IN', flag: '🇮🇳', avatarColor: '#EC4899' },
  { username: 'atcoder_samurai', elo: 1355, country: 'JP', flag: '🇯🇵', avatarColor: '#6366F1' },
  { username: 'viet_coder_pro', elo: 1285, country: 'VN', flag: '🇻🇳', avatarColor: '#14B8A6' }
];

// Seed list of mock names for roulette spinning effect
const FAKE_NAMES = [
  'void_pointer', 'nullptr_reaper', 'stack_overflow', 'segmentation_fault',
  'binary_beast', 'greedy_goblin', 'dp_wizard', 'o_of_one', 'bit_manipulator',
  'red_black_tree', 'hash_slinger', 'regex_terminator', 'matrix_multi', 'mutex_lock'
];

const DEFAULT_TEMPLATES = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Solve: Find maximum product of 3 elements in array
    int n;
    cin >> n;
    long long a[n];
    for(int i = 0; i < n; ++i) cin >> a[i];
    
    // TODO: Write optimal O(n) solution here
    
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        
        long[] a = new long[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            a[i] = Long.parseLong(st.nextToken());
        }
        
        // TODO: Write optimal O(n) solution here
    }
}`,
  python: `import sys

def solve():
    # Read all input from standard input
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    a = [int(x) for x in input_data[1:n+1]]
    
    # TODO: Write optimal O(n) solution here
    
if __name__ == '__main__':
    solve()
`
};

export const ArenaPage = ({ onReturnToHome, initialOpponent = null }) => {
  // Navigation / Phase States
  // 'lobby' | 'queuing' | 'roulette' | 'vs_reveal' | 'arena' | 'post_match'
  const [appState, setAppState] = useState('lobby');
  const [matchId, setMatchId] = useState(null);
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('code'); // 'description' | 'code'
  
  // Stable random session user id to avoid collisions
  const [userId] = useState(() => 'user_' + Math.random().toString(36).substr(2, 9));

  // Player Stats
  const [myStats, setMyStats] = useState({
    id: userId,
    username: 'shubham_b',
    elo: 1218,
    wins: 24,
    losses: 12,
    achievements: ['First Blood', 'Clutch', 'T#1 Founding Player'],
    country: 'IN',
    flag: '🇮🇳'
  });

  // Selected Opponent State (resolved during matchmaking)
  const [opponent, setOpponent] = useState(RIVAL_POOL[0]);
  const [spinName, setSpinName] = useState('searching...');
  const [vsCountdown, setVsCountdown] = useState(3);

  // Match State / Parameters
  const [submissionsLeft, setSubmissionsLeft] = useState(2);
  const [opponentSubmissionsLeft, setOpponentSubmissionsLeft] = useState(2);
  const [myProgress, setMyProgress] = useState(0); 
  const [opponentProgress, setOpponentProgress] = useState(0); 
  const [totalCases, setTotalCases] = useState(12);
  const [matchTimeRemaining, setMatchTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [opponentStatus, setOpponentStatus] = useState('active'); // 'active' | 'idle' | 'disconnected'
  const [opponentCursorLine, setOpponentCursorLine] = useState(1);
  const [dangerPulse, setDangerPulse] = useState(false); // Edges flash red when opponent hits >= 80%
  const [fullscreenViolations, setFullscreenViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(null);
  
  // Interactive Code Playground State
  const [activeLanguage, setActiveLanguage] = useState('cpp');
  const [userCode, setUserCode] = useState(DEFAULT_TEMPLATES.cpp);
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'system', text: 'SANDBOX INITIALIZED [CONTAINER_A_349]' },
    { type: 'system', text: 'READY FOR COMPILATION' }
  ]);
  const [lastVerdict, setLastVerdict] = useState(null);

  // Post-match states
  const [matchResult, setMatchResult] = useState(null); // 'victory' | 'defeat'
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Timers & socket ref
  const timerRef = useRef(null);
  const socketRef = useRef(null);
  const oppIdleTimerRef = useRef(null);

  // Audio synths helper
  const playBeep = (freq, duration, type = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const addConsoleLog = (type, text) => {
    setConsoleLogs(prev => [...prev, { type, text }]);
  };

  // Sync editor template code when changing language (if not edited by user yet)
  useEffect(() => {
    setUserCode(DEFAULT_TEMPLATES[activeLanguage]);
  }, [activeLanguage]);

  // Clean up socket and timers on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (oppIdleTimerRef.current) clearTimeout(oppIdleTimerRef.current);
    };
  }, []);

  // Countdown timer for vs reveal screen
  useEffect(() => {
    if (appState === 'vs_reveal') {
      if (vsCountdown > 0) {
        const t = setTimeout(() => {
          setVsCountdown(prev => {
            if (prev <= 1) {
              if (socketRef.current && matchId) {
                socketRef.current.emit('match:ready', { match_id: matchId, user_id: myStats.id });
              }
              return 0;
            }
            playBeep(523.25 + (3 - prev) * 100, 0.15, 'sine');
            return prev - 1;
          });
        }, 1000);
        return () => clearTimeout(t);
      }
    }
  }, [appState, vsCountdown, matchId, myStats.id]);

  // Establish connection and join matchmaking queue
  const startMatchmaking = () => {
    setAppState('queuing');
    playBeep(440, 0.1, 'square');
    addConsoleLog('system', 'ESTABLISHING SECURE WEBSOCKET TUNNEL...');

    if (!socketRef.current) {
      const socket = io(BACKEND_URL);
      socketRef.current = socket;

      socket.on('connect', () => {
        addConsoleLog('system', 'CONNECTED TO DIGITALOCEAN BLR-2 DROPLET');
        socket.emit('match:find', myStats);
      });

      socket.on('match:found', ({ opponent: oppData, match_id }) => {
        setOpponent(oppData);
        setMatchId(match_id);
        triggerRoulette(oppData, match_id);
      });

      socket.on('match:start', ({ problem: probData, deadline, submissions_cap }) => {
        setAppState('arena');
        setProblem(probData);
        setTotalCases(probData.hidden_cases.length);
        setSubmissionsLeft(submissions_cap);
        setOpponentSubmissionsLeft(submissions_cap);
        setMyProgress(0);
        setOpponentProgress(0);
        setDangerPulse(false);
        setLastVerdict(null);
        setFullscreenViolations(0);
        setShowWarning(null);
        setActiveTab('description'); // Open description tab first to read instructions

        // Start authoritative countdown timer based on deadline timestamp
        const calculateRemaining = () => {
          const rem = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
          setMatchTimeRemaining(rem);
          if (rem <= 0 && timerRef.current) {
            clearInterval(timerRef.current);
          }
        };
        calculateRemaining();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(calculateRemaining, 1000);
      });

      socket.on('opponent:typing', () => {
        setOpponentStatus('active');
        if (oppIdleTimerRef.current) clearTimeout(oppIdleTimerRef.current);
        oppIdleTimerRef.current = setTimeout(() => {
          setOpponentStatus('idle');
        }, 3000);
      });

      socket.on('opponent:cursor', ({ line }) => {
        setOpponentCursorLine(line);
      });

      socket.on('opponent:status', ({ status }) => {
        setOpponentStatus(status);
        if (status === 'disconnected') {
          addConsoleLog('error', '⚠️ RIVAL DISCONNECTED. GRACE PERIOD ACTIVE [30S]');
        }
      });

      socket.on('opponent:submitted', ({ verdict, casesPassed, totalCases, submissionsLeft }) => {
        setOpponentSubmissionsLeft(submissionsLeft);
        setOpponentProgress(casesPassed);
        if (casesPassed / totalCases >= 0.8) {
          setDangerPulse(true);
          addConsoleLog('error', `🔥 CRITICAL DANGER: Rival passed ${casesPassed}/${totalCases} test cases! SHIELD DEFENSES FAILING.`);
        } else {
          addConsoleLog('warning', `🚨 RIVAL SUBMISSION LOGGED: Passed ${casesPassed}/${totalCases} test cases [${verdict}]`);
        }
      });

      socket.on('testrun:compiling', () => {
        addConsoleLog('system', '⚙️ COMPILING SAMPLE TEST CASES...');
      });

      socket.on('testrun:result', ({ success, cases }) => {
        cases.forEach((c, i) => {
          if (c.verdict === 'AC') {
            addConsoleLog('success', `✔ Test Case ${i + 1}: PASSED (Time: 4ms)`);
          } else {
            addConsoleLog('error', `❌ Test Case ${i + 1}: FAILED [${c.verdict}]`);
            if (c.stderr) {
              addConsoleLog('error', `   Details: ${c.stderr.slice(0, 150)}`);
            }
          }
        });
        if (success) {
          addConsoleLog('success', '💡 Code compiled successfully. Ready for high-stakes validation.');
          playBeep(600, 0.2, 'sine');
        } else {
          playBeep(150, 0.3, 'sawtooth');
        }
      });

      socket.on('submit:compiling', () => {
        addConsoleLog('system', '🚀 DISPATCHING COMPILED PAYLOAD TO JUDGE SERVER...');
      });

      socket.on('submit:result', ({ verdict, casesPassed, totalCases, submissionsLeft: remSubmits, detail }) => {
        setSubmissionsLeft(remSubmits);
        setMyProgress(casesPassed);
        setLastVerdict({ verdict, casesPassed, detail });

        if (verdict === 'AC') {
          playBeep(987.77, 0.5, 'sine');
          addConsoleLog('success', `🏆 ACCEPTED [AC]! All ${casesPassed}/${totalCases} hidden test cases solved perfectly.`);
        } else {
          playBeep(150, 0.5, 'sawtooth');
          addConsoleLog('error', `❌ WRONG ANSWER [${verdict}]. Passed ${casesPassed}/${totalCases} cases. Attempts left: ${remSubmits}`);
          if (detail) {
            addConsoleLog('error', `   Details: ${detail}`);
          }
        }
      });

      socket.on('submit:error', ({ reason }) => {
        addConsoleLog('error', `⚠️ ERROR: ${reason}`);
      });

      socket.on('match:end', ({ winner_id, reason }) => {
        clearAllSimulations();
        if (winner_id === myStats.id) {
          setMatchResult('victory');
          playBeep(880, 0.5, 'sine');
        } else {
          setMatchResult('defeat');
          playBeep(120, 0.8, 'sawtooth');
        }
        setAppState('post_match');
      });
    } else {
      socketRef.current.emit('match:find', myStats);
    }
  };

  // Matchmaker Roulette spinner animation
  const triggerRoulette = (chosenRival, match_id) => {
    setAppState('roulette');
    playBeep(880, 0.1, 'triangle');
    
    let speed = 40; 
    let elapsed = 0;
    const totalDuration = 2500; 
    let nameIndex = 0;

    const spin = () => {
      const allCandidateNames = [...FAKE_NAMES, ...RIVAL_POOL.map(r => r.username)];
      setSpinName(allCandidateNames[nameIndex % allCandidateNames.length]);
      nameIndex++;
      elapsed += speed;
      
      speed = Math.min(speed * 1.1, 450);
      playBeep(300 + (nameIndex * 15), 0.05, 'sawtooth');

      if (elapsed < totalDuration) {
        setTimeout(spin, speed);
      } else {
        setSpinName(chosenRival.username);
        playBeep(600, 0.4, 'sine');
        setTimeout(() => {
          setAppState('vs_reveal');
          setVsCountdown(3);
          playBeep(523.25, 0.2, 'sine');
        }, 800);
      }
    };
    spin();
  };

  const handleLeaveArena = () => {
    if (socketRef.current) {
      socketRef.current.emit('match:cancel', myStats.id);
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    clearAllSimulations();
    onReturnToHome();
  };

  const clearAllSimulations = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (oppIdleTimerRef.current) clearTimeout(oppIdleTimerRef.current);
  };

  // Proctoring fullscreen violations checking
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (appState === 'arena' && !document.fullscreenElement) {
        setFullscreenViolations(prev => {
          const next = prev + 1;
          if (next >= 2) {
            if (socketRef.current) {
              socketRef.current.emit('match:forfeit');
            }
            return next;
          } else {
            setShowWarning(`⚠️ WARNING: Fullscreen Exit Detected (${next}/2). Exiting again will trigger immediate disqualification!`);
            setTimeout(() => {
              if (appState === 'arena' && !document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }, 3000);
            return next;
          }
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [appState]);

  const handleCodeChange = (e) => {
    setUserCode(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('me:typing');
    }
    if (Math.random() > 0.8) {
      playBeep(600, 0.02, 'sine');
    }
  };

  const runTestCases = () => {
    if (socketRef.current) {
      socketRef.current.emit('testrun', {
        problem_id: problem ? problem.id : 'prod-product-of-3',
        code: userCode,
        language: activeLanguage
      });
    }
  };

  const submitSolution = () => {
    if (submissionsLeft <= 0) return;
    if (socketRef.current) {
      socketRef.current.emit('submit', {
        problem_id: problem ? problem.id : 'prod-product-of-3',
        code: userCode,
        language: activeLanguage
      });
    }
  };

  const forfeitDuel = () => {
    if (window.confirm("Are you sure you want to forfeit? This will count as an immediate defeat.")) {
      if (socketRef.current) {
        socketRef.current.emit('match:forfeit');
      }
    }
  };

  const returnToLobby = () => {
    clearAllSimulations();
    setAppState('lobby');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getTextAreaLineNumber = (textarea) => {
    if (!textarea) return 1;
    const textToCursor = textarea.value.substr(0, textarea.selectionStart);
    return textToCursor.split('\n').length;
  };

  // Throttled Ghost Cursor position line update emitter
  useEffect(() => {
    if (appState !== 'arena') return;

    const interval = setInterval(() => {
      const textarea = document.querySelector('textarea');
      if (textarea && socketRef.current) {
        const line = getTextAreaLineNumber(textarea);
        socketRef.current.emit('me:cursor', { line });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [appState]);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 font-mono relative overflow-hidden flex flex-col justify-between selection:bg-red-500 selection:text-black">
      {/* Absolute Neon Grid Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14161d_1px,transparent_1px),linear-gradient(to_bottom,#14161d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30"></div>
      
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-50"></div>

      {/* Retro Cyberpunk Banner Header */}
      <header className="border-b-2 border-[#1E222A] bg-[#0E1015] px-6 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onReturnToHome}
            className="px-3 py-1.5 border border-[#2B3449] bg-[#141720] text-slate-400 hover:text-white text-xs rounded hover:bg-[#1D2230] transition flex items-center gap-1.5 font-mono font-bold cursor-pointer"
          >
            🡠 LEAVE ARENA
          </button>
          <div className="w-[1px] h-[20px] bg-slate-800 mx-1"></div>
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-black border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            ⚔
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-[#FF3B30] flex items-center gap-2">
              ALGOCLASH <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black tracking-normal">PREMIUM ALPHA</span>
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider">SYSTEM REGISTRY // BLR_DROPLET_2</p>
          </div>
        </div>
        
        {/* Status indicator badges resembling cyberpunkcardesign3 & 7 */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#141720] border border-[#232A3B] rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-400">NET STABLE</span>
          </div>
          <div className="text-[11px] text-right">
            <div className="text-[#FFE600] font-bold">1v1 TOURNAMENT #1</div>
            <div className="text-slate-500 text-[9px]">SOLO BRACKET // 64 SLOTS</div>
          </div>
        </div>
      </header>

      {/* WARNING NOTIFICATION MODAL */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="border-2 border-yellow-500 bg-[#16130B] max-w-md w-full p-6 rounded-lg shadow-[0_0_40px_rgba(245,158,11,0.25)] relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-500"></div>
            <div className="flex items-center gap-3 text-yellow-500 mb-4">
              <AlertTriangle size={32} />
              <h2 className="text-lg font-bold tracking-wider">PROCTORING WARNING</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">{showWarning}</p>
            <button 
              onClick={() => {
                setShowWarning(null);
                try { document.documentElement.requestFullscreen(); } catch(e) {}
              }}
              className="w-full py-3 bg-yellow-500 text-black font-black uppercase tracking-widest rounded hover:bg-yellow-400 transition"
            >
              RE-ENTER SECURED FULLSCREEN
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC SCREEN LAYOUT MANAGER */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col justify-center relative z-10">
        
        {/* PHASE STATE 1: LOBBY / PRE-MATCH DASHBOARD */}
        {appState === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* LEFT COLUMN: Player Identity Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Premium Cyber ID Frame */}
              <div className="border-2 border-[#FF3B30] bg-[#0E1015] rounded relative overflow-hidden shadow-[0_0_15px_rgba(255,59,48,0.1)]">
                
                {/* Tech Hazard Stripe Top Corner */}
                <div className="h-2 bg-gradient-to-r from-red-600 via-transparent to-red-600"></div>
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-25">
                  <svg viewBox="0 0 100 100" fill="none" stroke="#FF3B30" strokeWidth="2">
                    <line x1="0" y1="100" x2="100" y2="0" />
                    <line x1="20" y1="100" x2="100" y2="20" />
                    <line x1="40" y1="100" x2="100" y2="40" />
                  </svg>
                </div>

                <div className="p-6">
                  {/* Avatar & ELO */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded border-2 border-red-500 bg-red-950/40 flex items-center justify-center font-black text-red-500 text-3xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        S
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-xl">{myStats.flag}</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 tracking-widest">CODER UNIT</div>
                      <h3 className="text-xl font-bold tracking-wider text-slate-100">{myStats.username}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Trophy size={14} className="text-[#FFE600]" />
                        <span className="text-sm font-black text-[#FFE600]">{myStats.elo} ELO</span>
                      </div>
                    </div>
                  </div>

                  {/* Battle Stats Sheet */}
                  <div className="grid grid-cols-2 gap-3 border-y border-[#232A3B] py-4 mb-6 text-xs">
                    <div>
                      <div className="text-slate-500">VICTORIES</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">{myStats.wins} W</div>
                    </div>
                    <div>
                      <div className="text-slate-500">DEFEATS</div>
                      <div className="text-lg font-bold text-slate-400 mt-0.5">{myStats.losses} L</div>
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div>
                    <h4 className="text-xs text-slate-500 tracking-wider uppercase mb-3">Permanent Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {myStats.achievements.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-[#1B1F2A] border border-[#313C52] text-slate-300 text-[10px] px-2 py-1 rounded">
                          <Award size={10} className="text-[#FFE600]" />
                          <span>{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barcode Element mimicking Cyberpunk label */}
                  <div className="mt-8 pt-4 border-t border-[#1C202B] flex justify-between items-center opacity-70">
                    <div className="text-[8px] text-slate-500">AUTHENTICATED // SECURE_UID_F2A039</div>
                    <div className="w-24 h-6 bg-slate-300 flex items-center justify-center text-black font-black text-[10px] font-mono tracking-tighter cursor-pointer hover:bg-white transition">
                      |||| | ||| || |
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Details Panel */}
              <div className="border border-[#1E222A] bg-[#0E1015] p-5 rounded relative overflow-hidden">
                <h4 className="text-xs font-bold tracking-widest text-[#FFE600] mb-3 flex items-center gap-2">
                  <Zap size={14} /> ACTIVE TOURNAMENT
                </h4>
                <div className="text-sm font-bold text-slate-200">GRAND CLASH T#1</div>
                <div className="text-xs text-slate-500 mt-1 mb-4">64 Competitors Single Elimination Bracket</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#1B1F2A] pb-1.5">
                    <span className="text-slate-400">Total Entry Fee</span>
                    <span className="text-slate-200 font-bold">₹149</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1B1F2A] pb-1.5">
                    <span className="text-slate-400">Prize Pool Max</span>
                    <span className="text-[#FFE600] font-bold">₹5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Phase</span>
                    <span className="text-emerald-400 font-bold">Round of 64</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Entering Arena & Matchmaking Panel */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Grand Interactive Banner Block */}
              <div className="border-2 border-[#1E222A] bg-[#0E1015] p-8 rounded flex flex-col justify-between relative min-h-[350px] overflow-hidden">
                
                {/* Cyberpunk hazard striping border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(-45deg,#ffe600,#ffe600_10px,#000_10px,#000_20px)]"></div>
                
                <div>
                  <div className="text-xs text-[#FF3B30] font-bold tracking-widest mb-2">// DETONATION PROTOCOL //</div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
                    SOLVE FASTER. <span className="text-[#FF3B30]">ELIMINATE RIVALS.</span>
                  </h2>
                  <p className="text-sm text-slate-400 max-w-xl leading-relaxed mb-6">
                    This is not an exam. This is combat. Every competitive match is a high-pressure 1v1 duel. Track your rival's line number, brace against their test-case milestones, and feel the adrenaline.
                  </p>
                  
                  {/* Feature Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mb-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#FF3B30]" />
                      <span>Live Ghost Cursors (line tracking)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#FF3B30]" />
                      <span>Screen Edges Alert Pulse (80%+ Threat)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#FF3B30]" />
                      <span>Proctored Secured Fullscreen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#FF3B30]" />
                      <span>2 High-Stakes Submission Cap</span>
                    </div>
                  </div>
                </div>

                {/* Big Action Queue Trigger */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button 
                    onClick={startMatchmaking}
                    className="flex-1 py-4 bg-[#FF3B30] text-black font-black tracking-widest uppercase hover:bg-red-500 transition shadow-[0_0_20px_rgba(255,59,48,0.3)] flex items-center justify-center gap-3 text-lg cursor-pointer"
                  >
                    <Zap size={20} fill="currentColor" />
                    ENTER ARENA (QUEUING)
                  </button>
                  
                  <div className="px-4 py-2 bg-[#141720] border border-[#232A3B] rounded text-center sm:text-left">
                    <div className="text-[10px] text-slate-500">AVERAGE MATCH QUEUE TIME</div>
                    <div className="text-sm font-bold text-slate-200">0.05s // INSTANT</div>
                  </div>
                </div>
                
                {/* Tech Status Labels */}
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono tracking-tighter">
                  PORT:8080 // WS_ACTIVE // SECURE_RSA
                </div>
              </div>

              {/* Rules & Warnings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#1E222A] bg-[#0E1015] p-4 rounded text-xs">
                  <h5 className="font-bold text-[#FF3B30] mb-2 flex items-center gap-2">
                    <AlertTriangle size={12} /> SECURED ENVIRONMENT RULES
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    Once the match begins, full proctored proctection is active. Tab changes, mouse exits, and multi-monitor setups are tracked in real-time. Exit violations trigger immediate forfeiture.
                  </p>
                </div>
                <div className="border border-[#1E222A] bg-[#0E1015] p-4 rounded text-xs">
                  <h5 className="font-bold text-[#FFE600] mb-2 flex items-center gap-2">
                    <Terminal size={12} /> COMPILING SUBMISSION CODES
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    You only get 2 compilation validation passes to pass all 12 hidden tests. Wrong Answers consume attempts, compilation syntax errors are exempt. Write code defensively.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PHASE STATE 2: MATCHMAKING QUEUE HUD */}
        {appState === 'queuing' && (
          <div className="max-w-2xl mx-auto border-2 border-[#1E222A] bg-[#0E1015] rounded overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-pulse w-full">
            <div className="h-2 bg-[repeating-linear-gradient(-45deg,#ffe600,#ffe600_10px,#000_10px,#000_20px)]"></div>
            
            <div className="p-8">
              {/* Spinning Scan Crosshairs */}
              <div className="flex flex-col items-center justify-center my-12 relative">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#FF3B30] animate-spin flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-double border-slate-500 animate-pulse"></div>
                </div>
                <div className="mt-6 text-center">
                  <h2 className="text-xl font-black tracking-widest text-slate-200 uppercase">SEARCHING FOR OPPONENT...</h2>
                  <p className="text-xs text-slate-500 mt-1">LOCKING IN MATCH BRACKET / ROUND OF 64</p>
                </div>
              </div>

              {/* Simulated Console Logs inside Frame */}
              <div className="bg-[#07080B] border border-[#1C2029] p-4 rounded text-xs text-slate-300 font-mono space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF3B30] font-bold">»</span>
                  <span>INITIATING HANDSHAKE WITH BANGALORE CLUSTERS... SUCCESS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF3B30] font-bold">»</span>
                  <span>SEARCHING RANGE (ELO: 1100 - 1300)...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>LOCAL LATENCY VERIFIED // RTT: 12ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FFE600] font-bold">⚡</span>
                  <span>AUTHENTICATING SECURE MATCH TOKENS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE STATE 3: MATCHMAKER ROULETTE */}
        {appState === 'roulette' && (
          <div className="max-w-xl mx-auto border-2 border-red-500 bg-[#0E1015] rounded overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] w-full">
            <div className="h-2 bg-red-600"></div>
            
            <div className="p-8 text-center">
              <span className="text-xs text-red-500 font-bold tracking-widest uppercase">// SECURED DUEL ASSIGNMENT //</span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1 mb-10">LOCKING ON COMBATANT</h2>
              
              {/* Roulette Wheel Screen Container */}
              <div className="bg-black border border-red-500/50 rounded-lg p-6 my-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                
                {/* Horizontal scanner bar */}
                <div className="absolute inset-x-0 h-0.5 bg-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10 animate-scan pointer-events-none"></div>
                
                {/* Visual arrow guides */}
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-red-500 font-bold text-lg animate-pulse">▶</div>
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-red-500 font-bold text-lg rotate-180 animate-pulse">▶</div>

                <div className="text-3xl md:text-4xl font-black tracking-widest text-[#FF3B30] uppercase filter drop-shadow-[0_0_8px_rgba(255,59,48,0.5)]">
                  {spinName}
                </div>
                
                <div className="text-[10px] text-slate-500 uppercase mt-3 tracking-widest">
                  DECRYPTION ALGORITHM ACTIVE // RE-ALIGNING INDEXES
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Determining matching opponent utilizing balanced ELO-seeding indices...
              </div>
            </div>
          </div>
        )}

        {/* PHASE STATE 4: VS REVEAL SCREEN */}
        {appState === 'vs_reveal' && (
          <div className="max-w-4xl mx-auto animate-fadeIn relative w-full">
            
            {/* Massive VS Title Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] md:text-[220px] font-black tracking-tighter text-slate-900/10 uppercase select-none pointer-events-none font-sans">
              VS
            </div>

            {/* Split Dual Card Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              
              {/* Player 1 Card (Our Side) - Slides in Left */}
              <div className="border-2 border-red-500 bg-[#0E1015] rounded-xl p-8 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] bg-red-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">CHALLENGER</span>
                    <span className="text-xl">{myStats.flag}</span>
                  </div>
                  
                  <h3 className="text-3xl font-black tracking-wider text-white mt-2 mb-1">{myStats.username}</h3>
                  <div className="text-lg font-black text-[#FFE600] flex items-center gap-1.5 mt-2">
                    <Trophy size={18} />
                    <span>{myStats.elo} ELO</span>
                  </div>
                </div>

                <div className="border-t border-[#1C2029] pt-4 mt-6">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">ESTIMATED STRETCH EXPECTATION</div>
                  <div className="text-xs text-emerald-400 mt-1">BASE ADVANTAGE (+18 ELO EXPECTANCY)</div>
                </div>
              </div>

              {/* Player 2 Card (Opponent Side) - Slides in Right */}
              <div className="border-2 border-yellow-500 bg-[#0E1015] rounded-xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">RIVAL DEFENDER</span>
                    <span className="text-xl">{opponent.flag}</span>
                  </div>
                  
                  <h3 className="text-3xl font-black tracking-wider text-white mt-2 mb-1">{opponent.username}</h3>
                  <div className="text-lg font-black text-[#FFE600] flex items-center gap-1.5 mt-2">
                    <Trophy size={18} />
                    <span>{opponent.elo} ELO</span>
                  </div>
                </div>

                <div className="border-t border-[#1C2029] pt-4 mt-6">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">RIVAL METRIC SPECS</div>
                  <div className="text-xs text-red-400 mt-1">CLUTCH THREAT LEVEL: EXTREME</div>
                </div>
              </div>

            </div>

            {/* Bottom Centered Visual Timer Bar */}
            <div className="flex flex-col items-center mt-12 text-center">
              <div className="text-xs font-black text-[#FF3B30] tracking-widest uppercase mb-2">🧬 PREPARING SECURE SANDBOX COMPILATION 🧬</div>
              <div className="text-5xl font-black text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {vsCountdown}
              </div>
              <div className="w-64 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                <div className="h-full bg-[#FF3B30] rounded-full animate-loader duration-3000"></div>
              </div>
            </div>

          </div>
        )}

        {/* PHASE STATE 5: THE LIVE ARENA (DUEL WORKSPACE) */}
        {appState === 'arena' && (
          <div className="flex flex-col gap-4 h-full relative w-full">
            
            {/* ACTIVE DANGER PULSE SCREEN FRAME (OPPONENT PASSES >= 80% TEST CASES) */}
            {dangerPulse && (
              <div className="absolute inset-0 border-4 border-red-600 rounded-xl pointer-events-none animate-redBorderPulse z-30 shadow-[inset_0_0_40px_rgba(220,38,38,0.7)]"></div>
            )}

            {/* ARENA TOP CONTROL HUD */}
            <div className="bg-[#141720] border-2 border-[#232A3B] p-4 rounded-lg flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Match Active // SECURE TUNNEL
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={forfeitDuel}
                  className="px-4 py-1.5 border border-red-900/40 bg-red-950/30 text-red-400 text-xs rounded hover:bg-red-950/50 transition font-bold cursor-pointer"
                >
                  FORFEIT DUEL
                </button>
              </div>

            </div>

            {/* STAGES HEADER: Player Cards (Mortal Kombat Style layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Player Self Box */}
              <div className="md:col-span-4 bg-[#0E1015] border border-red-500 p-4 rounded relative overflow-hidden flex items-center justify-between">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                <div className="pl-4">
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest">YOU</div>
                  <h4 className="text-base font-extrabold text-slate-100">{myStats.username} {myStats.flag}</h4>
                  <div className="text-xs text-red-500 font-bold mt-0.5">{myStats.elo} ELO</div>
                </div>
                
                {/* Interactive Submission Counters (2 Maximum) */}
                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] text-slate-400 mb-1">CAP ATTEMPTS</span>
                  <div className="flex gap-1.5">
                    {[1, 2].map(n => (
                      <Zap 
                        key={n} 
                        size={16} 
                        className={`transition-colors duration-300 ${n <= submissionsLeft ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Server Authority Central Countdown Clock */}
              <div className="md:col-span-4 flex flex-col items-center justify-center bg-[#0E1015] border border-slate-800 p-3 rounded text-center">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">TIME DECRYPTION DEADLINE</span>
                <div className="text-3xl font-black text-[#FFE600] tracking-wider font-mono">
                  {formatTime(matchTimeRemaining)}
                </div>
                <span className="text-[9px] text-emerald-400 mt-0.5">SERVER AUTHORITATIVE CONTROL</span>
              </div>

              {/* Opponent rival Box */}
              <div className="md:col-span-4 bg-[#0E1015] border border-yellow-500 p-4 rounded relative overflow-hidden flex items-center justify-between">
                <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500"></div>
                <div className="pr-4">
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest">RIVAL DEFENDER</div>
                  <h4 className="text-base font-extrabold text-slate-100">{opponent.username} {opponent.flag}</h4>
                  <div className="text-xs text-yellow-500 font-bold mt-0.5">{opponent.elo} ELO</div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] text-slate-400 mb-1">RIVAL STATUS</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      opponentStatus === 'active' ? 'bg-emerald-500' :
                      opponentStatus === 'idle' ? 'bg-amber-400' : 'bg-red-600'
                    }`}></span>
                    <span className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                      {opponentStatus}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* MATCH LIVE PROGRESS METER BAR COMPOSITIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0B0F] border border-[#1E222A] p-4 rounded-lg">
              
              {/* Your Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Your Validation Progress:</span>
                  <span className="text-slate-200 font-black">{myProgress}/{totalCases} Test Cases Passed</span>
                </div>
                <div className="w-full bg-[#141720] rounded h-3 overflow-hidden relative flex p-0.5 border border-[#232A3B]">
                  <div 
                    className="h-full bg-emerald-500 rounded-sm transition-all duration-500"
                    style={{ width: `${(myProgress / totalCases) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Opponent Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Rival's Live Verification Progress:</span>
                  <span className="text-slate-200 font-black">{opponentProgress}/{totalCases} Test Cases Passed</span>
                </div>
                <div className="w-full bg-[#141720] rounded h-3 overflow-hidden relative flex p-0.5 border border-[#232A3B]">
                  <div 
                    className={`h-full rounded-sm transition-all duration-500 ${opponentProgress >= 10 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}
                    style={{ width: `${(opponentProgress / totalCases) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* DUAL SCREEN WORKSPACE (Left: Code Editor, Right: Real-time Arena Feeds) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
              
              {/* CODE WORKPLACE (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-3 bg-[#0E1015] border border-slate-800 rounded-lg p-4 h-[420px] md:h-[500px]">
                
                {/* Tabs Topbar */}
                <div className="flex items-center justify-between border-b border-[#232A3B] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                        activeTab === 'description'
                          ? 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📖 Problem
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                        activeTab === 'code'
                          ? 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💻 solution.{activeLanguage}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={activeLanguage} 
                      onChange={(e) => setActiveLanguage(e.target.value)}
                      className="bg-[#141720] border border-[#2B3449] text-slate-300 rounded px-2 py-1 cursor-pointer focus:outline-none"
                    >
                      <option value="cpp">C++ (GCC Latest)</option>
                      <option value="java">Java (JDK 21)</option>
                      <option value="python">Python (3.11)</option>
                    </select>
                  </div>
                </div>

                {activeTab === 'description' ? (
                  <div className="flex-1 overflow-y-auto bg-[#07080B] border border-[#171B24] rounded p-4 text-slate-300 leading-relaxed text-xs md:text-sm font-sans space-y-4">
                    <h3 className="text-lg font-black text-[#FFE600] tracking-wide border-b border-slate-800 pb-2">
                      {problem ? problem.title : 'Max Product of 3'}
                    </h3>
                    <div className="whitespace-pre-wrap font-mono text-xs text-slate-300 mt-2">
                      {problem ? problem.description : 'Loading problem statement...'}
                    </div>
                    {problem && problem.test_cases && (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 font-mono text-[11px]">
                        <h4 className="text-slate-400 font-bold uppercase tracking-wider">Sample Test Cases</h4>
                        {problem.test_cases.map((tc, i) => (
                          <div key={i} className="bg-[#10121a] p-3 border border-[#1C2029] rounded">
                            <div className="text-[#FFE600] font-bold mb-1">Sample Input {i + 1}:</div>
                            <pre className="text-slate-300 bg-black/40 p-2 rounded mb-2 overflow-x-auto">{tc.input}</pre>
                            <div className="text-emerald-400 font-bold mb-1">Expected Output {i + 1}:</div>
                            <pre className="text-slate-300 bg-black/40 p-2 rounded overflow-x-auto">{tc.output}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 font-mono text-xs md:text-sm relative overflow-hidden bg-[#07080B] border border-[#171B24] rounded p-3 text-slate-300 flex">
                    {/* Line numbers column */}
                    <div className="text-slate-600 text-right pr-4 select-none border-r border-[#171B24] space-y-0.5">
                      {Array.from({ length: 22 }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Pseudo Editable Area */}
                    <textarea 
                      value={userCode}
                      onChange={handleCodeChange}
                      spellCheck="false"
                      className="flex-1 h-full pl-4 bg-transparent outline-none border-none resize-none overflow-y-auto leading-relaxed focus:ring-0 text-emerald-400 font-mono text-xs md:text-sm"
                    ></textarea>

                    {/* Ghost cursor simulation indicator overlay */}
                    <div 
                      className="absolute right-4 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] rounded pointer-events-none transition-all duration-500"
                      style={{ top: `${opponentCursorLine * 16}px` }}
                    >
                      ⚡ {opponent.username} (Cursor: Line {opponentCursorLine})
                    </div>
                  </div>
                )}

                {/* Action Run Submissions Dock Panel */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button 
                    onClick={runTestCases}
                    className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded font-bold uppercase tracking-wide text-xs transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <Play size={14} />
                    Run Sample Tests (Unlimited)
                  </button>

                  <button 
                    onClick={() => submitSolution()}
                    disabled={submissionsLeft <= 0}
                    className={`py-3 px-8 rounded font-black uppercase tracking-widest text-xs transition flex-1 flex items-center justify-center gap-2 cursor-pointer ${
                      submissionsLeft > 0 
                        ? 'bg-[#FF3B30] text-black hover:bg-red-500 shadow-[0_0_15px_rgba(255,59,48,0.25)]' 
                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Send size={14} />
                    SUBMIT TO HIGH STAKES ({submissionsLeft} ATTEMPTS REMAINING)
                  </button>
                </div>

              </div>

              {/* LIVE RECENT ARENA LOGS (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                
                {/* Secured Sandbox Terminal logs */}
                <div className="border border-slate-800 bg-[#0E1015] rounded-lg p-4 flex flex-col h-1/2 overflow-hidden">
                  <div className="flex items-center gap-1.5 border-b border-[#232A3B] pb-2 text-xs font-bold text-slate-400">
                    <Terminal size={14} />
                    <span>INTEGRAL COMPILER CONSOLE</span>
                  </div>
                  
                  {/* Terminal Log Stream */}
                  <div className="flex-1 overflow-y-auto space-y-2 mt-3 font-mono text-[10px] md:text-xs">
                    {consoleLogs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`leading-relaxed border-l-2 pl-2 ${
                          log.type === 'system' ? 'border-[#FF3B30] text-slate-300' :
                          log.type === 'success' ? 'border-emerald-500 text-emerald-400' :
                          log.type === 'warning' ? 'border-yellow-500 text-yellow-300' :
                          'border-red-600 text-red-400'
                        }`}
                      >
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blueprint Live Arena Event Feed */}
                <div className="border border-slate-800 bg-[#0E1015] rounded-lg p-4 flex flex-col h-1/2 overflow-hidden justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#232A3B] pb-2 text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">PSYCHOLOGICAL BROADCASTS</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>

                    <div className="space-y-3 mt-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Opponent Submissions Cap</span>
                        <span className="text-slate-200 font-bold">{opponentSubmissionsLeft}/2 remaining</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Rival Focus Status</span>
                        <span className="text-amber-400 font-bold">Line {opponentCursorLine} Focus</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Local Multiplier Multi</span>
                        <span className="text-[#FFE600] font-black">{activeLanguage === 'cpp' ? '1.0x (GCC)' : activeLanguage === 'java' ? '2.0x (JVM)' : '3.0x (Py)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Cheat Metrics Panel */}
                  <div className="bg-[#07080B] border border-[#232A3B] p-3 rounded text-[10px] space-y-1 mt-4">
                    <div className="text-[#FF3B30] font-black tracking-wider uppercase flex items-center gap-1">
                      <Shield size={10} />
                      <span>THE SENTINEL MONITOR V1.0</span>
                    </div>
                    <div className="text-slate-400">Proctored fullscreen verification matches: OK</div>
                    <div className="text-slate-400">Total verified tab jumps logged: <span className={fullscreenViolations > 0 ? 'text-red-500 font-bold' : 'text-slate-300'}>{fullscreenViolations}</span></div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* PHASE STATE 6: POST MATCH ROUTING (WIN/DEFEAT SCREEN) */}
        {appState === 'post_match' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn w-full">
            
            {/* LARGE HEADER MOMENT (3 SECS GOLD/SILVER GLOW) */}
            <div className={`p-8 rounded-xl border-2 text-center relative overflow-hidden ${
              matchResult === 'victory' 
                ? 'border-[#FFE600] bg-gradient-to-b from-[#25220B] to-[#0A0B0E] shadow-[0_0_50px_rgba(245,158,11,0.2)]' 
                : 'border-slate-700 bg-gradient-to-b from-[#1C1D21] to-[#0A0B0E] shadow-[0_0_50px_rgba(255,255,255,0.05)]'
            }`}>
              
              {/* Dynamic decorative banners */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(-45deg,#ffe600,#ffe600_10px,#000_10px,#000_20px)] opacity-50"></div>

              {matchResult === 'victory' ? (
                <>
                  <span className="text-xs text-[#FFE600] font-black tracking-widest uppercase">// CRITICAL ACCEPTED ACCOMPLISHED //</span>
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-widest mt-2 mb-4 filter drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]">
                    VICTORY
                  </h2>
                  <div className="text-2xl font-black text-[#FFE600] mt-1 flex items-center justify-center gap-2">
                    <span>+18 ELO GAINED</span>
                    <span className="text-xs bg-[#FFE600] text-black px-1.5 py-0.5 rounded">NEW CAP: 1236 ELO</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs text-red-500 font-black tracking-widest uppercase">// DEFEATED IN INTENSE COMBAT //</span>
                  <h2 className="text-5xl md:text-6xl font-black text-slate-300 tracking-widest mt-2 mb-4">
                    ELIMINATED
                  </h2>
                  <div className="text-xl font-black text-slate-400 mt-1">
                    -14 ELO PENALIZATION // CURRENT CAP: 1204 ELO
                  </div>
                </>
              )}

              {/* CTA Routing Options */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8 relative z-10">
                <button 
                  onClick={returnToLobby}
                  className="py-3 px-8 bg-white text-black font-black uppercase tracking-wider rounded hover:bg-slate-200 transition text-sm cursor-pointer"
                >
                  RETURN TO ARENA LOBBY
                </button>
                <button 
                  onClick={() => setShowAnalysis(prev => !prev)}
                  className="py-3 px-8 border border-slate-700 hover:border-slate-500 text-slate-300 font-black uppercase tracking-wider rounded transition text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={16} />
                  {showAnalysis ? 'HIDE MATCH ANALYSIS' : 'SHOW MATCH ANALYSIS'}
                </button>
              </div>

            </div>

            {/* DOCK PAYWALL FOR MATCH ANALYSIS (PHASE 2 PREVIEW AS REQUESTED) */}
            {showAnalysis && (
              <div className="border border-slate-800 bg-[#0E1015] rounded-xl p-6 relative overflow-hidden">
                
                {/* Paywall Banner Overlay Block */}
                {matchResult === 'defeat' && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-[10px] bg-[#FFE600] text-black px-2 py-0.5 rounded font-black uppercase tracking-widest mb-3">
                      LOCKED PREMIUM ANALYSIS FEATURE
                    </span>
                    <h4 className="text-xl font-bold text-white mb-2">UNLOCK DEEP WORKPLACE ANALYSIS</h4>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                      See where you went wrong. Reveal the hidden test inputs, step-by-step cursor timeline, side-by-side rival comparison, and AI personalized optimizations.
                    </p>
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                      <button 
                        onClick={() => alert("Simulating Razorpay Transaction Link: ₹29 payment verified!")}
                        className="py-2 px-6 bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider rounded hover:bg-yellow-400 transition cursor-pointer"
                      >
                        UNLOCK REVEAL FOR ₹29
                      </button>
                      <button 
                        onClick={() => alert("Subscribed successfully! Dynamic ELO metrics active.")}
                        className="py-2 px-6 bg-[#1F2937] text-white border border-slate-700 font-bold text-xs uppercase tracking-wider rounded hover:bg-slate-700 transition cursor-pointer"
                      >
                        FREE WITH PRO SUB (₹199/MO)
                      </button>
                    </div>
                  </div>
                )}

                {/* Side-By-Side Code Comparison Mock UI */}
                <div className="relative">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">// COMBATANT WORKPLACE TIMELINE //</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Your final submission */}
                    <div className="border border-[#232A3B] bg-[#07080B] p-4 rounded-lg">
                      <div className="flex items-center justify-between border-b border-[#1F2937] pb-2 mb-3 text-xs">
                        <span className="text-slate-400 font-bold">Your Attempt Logs</span>
                        <span className="text-emerald-400 font-bold">Solved in 14:32</span>
                      </div>
                      <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {`#include <iostream>\n// Optimal sorting solution implemented.\nint main() {\n    cin >> n;\n    // Hidden case #8 corrected in memory limits.\n}`}
                      </pre>
                    </div>

                    {/* Opponent's final submission */}
                    <div className="border border-[#232A3B] bg-[#07080B] p-4 rounded-lg">
                      <div className="flex items-center justify-between border-b border-[#1F2937] pb-2 mb-3 text-xs">
                        <span className="text-slate-400 font-bold">Rival {opponent.username} Attempt Logs</span>
                        <span className="text-[#FFE600] font-bold">Solved in 11:24</span>
                      </div>
                      <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {`#include <bits/stdc++.h>\n// O(n log n) standard heap implementation.\nint main() {\n    // Bypassed hidden timeouts successfully.\n}`}
                      </pre>
                    </div>
                  </div>

                  {/* Mini statistics checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[#1C2029] text-xs">
                    <div>
                      <div className="text-slate-500 uppercase">Solve Delta Time</div>
                      <div className="text-base font-bold text-slate-200 mt-0.5">3 min 08s gap</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Attempts Consumed</div>
                      <div className="text-base font-bold text-slate-200 mt-0.5">1 Submission</div>
                    </div>
                    <div>
                      <div className="text-slate-500 uppercase">Worst Execution Time</div>
                      <div className="text-base font-bold text-slate-200 mt-0.5">142ms // Multi PASS</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Platform Rank Change</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">Rank #347 India</div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* LinkedIn post template share card component */}
            <div className="border border-slate-800 bg-[#0E1015] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FFE600]" /> GENERATE SHARE CARD
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  Earn bragging rights. Download your certified match stats card formatted perfectly for WhatsApp status or LinkedIn posts.
                </p>
              </div>

              <button 
                onClick={() => alert("Generating high-fidelity Canvas card asset...")}
                className="py-2.5 px-6 bg-[#FF3B30] text-black font-black text-xs uppercase tracking-widest hover:bg-red-500 transition cursor-pointer"
              >
                DOWNLOAD CARD
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Cyberpunk HUD Footer Section */}
      <footer className="border-t border-[#1E222A] bg-[#08090C] py-4 px-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[10px] text-slate-500 font-mono">
          <span>ALGORITHM WORKPLACE // V1.0-STABLE</span>
          <span className="hidden sm:inline">•</span>
          <span>COMPILER CLUSTER NODE // BLR_DROP_2</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#FF3B30] font-bold">SENTINEL SECURED PROTOCOL V1</span>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>CODER AUTHENTICATED:</span>
          <span className="text-[#FFE600] font-bold bg-[#1A1E29] border border-[#2B354D] px-2 py-0.5 rounded">
            {myStats.username} ({myStats.elo} ELO)
          </span>
        </div>
      </footer>
    </div>
  );
};
