const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Fallback to load from frontend/.env if local .env variables are missing
if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
  require('dotenv').config({ path: path.join(__dirname, '../frontend/.env') });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client successfully initialized with URL:', supabaseUrl);
  } catch (err) {
    console.error('Supabase initialization failed:', err.message);
  }
} else {
  console.log('Running backend in local sandbox mode (missing Supabase credentials).');
}

// Global first blood indicator
global.firstBloodFired = false;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for the premium dev tier
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Seeding standard problem (Max Product of 3 elements)
const SEED_PROBLEM = {
  id: 'prod-product-of-3',
  title: 'Max Product of 3',
  description: `Blitz Format:

Given an integer array nums, find three numbers whose product is maximum and return the maximum product.

Input Constraints:
- 3 <= nums.length <= 10^4
- -1000 <= nums[i] <= 1000

Input Format:
First line: n (array size)
Second line: n integers separated by space

Output Format:
A single integer representing the maximum product.`,
  time_limit_ms: 3000,
  test_cases: [
    { input: "5\n1 2 3 4 5", output: "60" },
    { input: "3\n-10 -10 5", output: "500" }
  ],
  hidden_cases: [
    { input: "4\n1 10 -5 1", output: "10" },
    { input: "6\n-1 -2 -3 -4 0 5", output: "60" },
    { input: "5\n1 2 3 4 -10", output: "24" },
    { input: "5\n-100 -98 1 2 3", output: "29400" },
    { input: "3\n-1 -2 -3", output: "-6" },
    { input: "4\n0 0 0 0", output: "0" },
    { input: "5\n-10 -10 -10 1 2", output: "200" },
    { input: "5\n1 1 1 1 1", output: "1" },
    { input: "4\n-1 -1 -1 5", output: "5" },
    { input: "3\n10 10 10", output: "1000" }
  ]
};

// In-Memory state
const matches = new Map(); // match_id -> match state
const matchmakingQueue = []; // Array of { socket, user }
const socketUserMap = new Map(); // socket.id -> { user_id, match_id }

// Language Piston Configuration
const PISTON_LANG_MAP = {
  'cpp': { language: 'c++', version: '*' },
  'java': { language: 'java', version: '*' },
  'python': { language: 'python', version: '*' }
};

const TIME_MULTIPLIERS = {
  'cpp': 1.0,
  'java': 2.0,
  'python': 3.0
};

const MAX_CODE_LENGTH = 100000; // 100KB Limit

// Dynamic problem retrieval with fallback
async function getMatchProblem() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*');
        
      if (!error && data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
      }
    } catch (e) {
      // Fallback
    }
  }
  return SEED_PROBLEM;
}

// Database match creation
async function dbCreateMatch(matchId, p1, p2, problemId) {
  if (!supabase) return;
  try {
    await supabase.from('matches').insert({
      id: matchId,
      player_one: p1.id,
      player_two: p2.id,
      problem_id: problemId,
      status: 'active',
      player_one_elo_before: p1.elo || 1200,
      player_two_elo_before: p2.elo || 1200
    });
  } catch (e) {
    // Fail silently
  }
}

// Database match termination & ELO synchronization
async function dbEndMatch(matchId, winnerId, p1Stats, p2Stats, reason) {
  if (!supabase) return;
  try {
    const eloChange = 15;
    const p1EloAfter = p1Stats.id === winnerId ? (p1Stats.elo || 1200) + eloChange : (p1Stats.elo || 1200) - eloChange;
    const p2EloAfter = p2Stats.id === winnerId ? (p2Stats.elo || 1200) + eloChange : (p2Stats.elo || 1200) - eloChange;

    await supabase.from('matches').update({
      winner: winnerId,
      status: 'completed',
      player_one_elo_after: p1EloAfter,
      player_two_elo_after: p2EloAfter,
      ended_at: new Date().toISOString()
    }).eq('id', matchId);

    // Helper to update ELO and record counts
    const updateProfile = async (player, won) => {
      try {
        const { data } = await supabase.from('profiles').select('wins, losses').eq('id', player.id).maybeSingle();
        const wins = (data?.wins || 0) + (won ? 1 : 0);
        const losses = (data?.losses || 0) + (won ? 0 : 1);
        const newElo = (player.elo || 1200) + (won ? eloChange : -eloChange);

        await supabase.from('profiles').update({
          elo: newElo,
          wins,
          losses
        }).eq('id', player.id);
      } catch (err) {
        // Ignore
      }
    };

    await updateProfile(p1Stats, p1Stats.id === winnerId);
    await updateProfile(p2Stats, p2Stats.id === winnerId);
  } catch (e) {
    // Fail silently
  }
}

// Database submission logging
async function dbInsertSubmission(matchId, userId, language, code, verdict, casesPassed, totalCases, runTime = 0, memory = 0) {
  if (!supabase) return;
  try {
    await supabase.from('submissions').insert({
      match_id: matchId,
      user_id: userId,
      language: language,
      code: code,
      verdict: verdict,
      hidden_cases_passed: casesPassed,
      hidden_cases_total: totalCases,
      execution_time_ms: runTime,
      memory_used_kb: memory
    });
  } catch (e) {
    // Fail silently
  }
}

// Database anti-cheat event logger
async function dbLogAntiCheat(matchId, userId, eventType, payload) {
  if (!supabase) return;
  try {
    await supabase.from('anticheat_events').insert({
      match_id: matchId,
      user_id: userId,
      event_type: eventType,
      payload: payload
    });
  } catch (e) {
    // Fail silently
  }
}

// Execute code single case helper
async function runPiston(code, language, input, runTimeout = 3000) {
  const langConfig = PISTON_LANG_MAP[language];
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin: input,
      run_timeout: runTimeout
    });
    return response.data;
  } catch (error) {
    console.error('Piston execution error:', error.message);
    throw error;
  }
}

// Judge output comparison helper
function judgeSingleCase(pistonResult, expectedOutput) {
  const { run, compile } = pistonResult;

  if (compile && compile.code !== 0) {
    return { verdict: 'CE', detail: compile.stderr.slice(0, 300) };
  }

  if (run.signal === 'SIGKILL') {
    return { verdict: 'TLE' };
  }

  if (run.code !== 0 && !run.stdout.trim()) {
    return { verdict: 'RE', detail: run.stderr.slice(0, 300) };
  }

  const actual = run.stdout.trim().replace(/\r\n/g, '\n');
  const expected = expectedOutput.trim().replace(/\r\n/g, '\n');

  return actual === expected ? { verdict: 'AC' } : { verdict: 'WA' };
}

// Check tiebreakers when match concludes
function evaluateTiebreaker(match) {
  const playerIds = Object.keys(match.players);
  const p1 = match.players[playerIds[0]];
  const p2 = match.players[playerIds[1]];

  // 1. Highest progress wins
  if (p1.progress > p2.progress) return p1.id;
  if (p2.progress > p1.progress) return p2.id;

  // 2. Same progress, fewest submissions wins (cleaner solver)
  const p1Used = 2 - p1.submissionsLeft;
  const p2Used = 2 - p2.submissionsLeft;
  if (p1Used < p2Used) return p1.id;
  if (p2Used < p1Used) return p2.id;

  // 3. Fallback: lexicographically first ID (stable)
  return p1.id < p2.id ? p1.id : p2.id;
}

// Complete the match
function endMatch(matchId, winnerId, reason) {
  const match = matches.get(matchId);
  if (!match || match.status === 'completed') return;

  match.status = 'completed';
  match.winnerId = winnerId;
  match.endedAt = Date.now();

  const playerIds = Object.keys(match.players);
  const p1 = match.players[playerIds[0]];
  const p2 = match.players[playerIds[1]];

  io.to(matchId).emit('match:end', {
    winner_id: winnerId,
    reason: reason || 'Submission accepted or tiebreaker complete',
    p1_stats: { id: p1.id, progress: p1.progress, submissionsLeft: p1.submissionsLeft },
    p2_stats: { id: p2.id, progress: p2.progress, submissionsLeft: p2.submissionsLeft }
  });

  // Database updates
  dbEndMatch(matchId, winnerId, p1, p2, reason);

  // Global announcements
  const solveTime = Date.now() - match.createdAt;
  if (!global.firstBloodFired) {
    global.firstBloodFired = true;
    io.to('broadcast').emit('global:first_blood', {
      winner: winnerId === p1.id ? p1.username : p2.username,
      loser: winnerId === p1.id ? p2.username : p1.username,
      round_label: 'Round 1',
      solve_time_ms: solveTime
    });
  } else {
    io.to('broadcast').emit('global:match_complete', {
      winner: winnerId === p1.id ? p1.username : p2.username,
      loser: winnerId === p1.id ? p2.username : p1.username,
      round_label: 'Round 1',
      solve_time_ms: solveTime
    });
  }

  // Clean up references
  playerIds.forEach(pid => {
    const socketId = match.players[pid].socketId;
    if (socketId) socketUserMap.delete(socketId);
  });
  matches.delete(matchId);
  console.log(`Match ${matchId} ended. Winner: ${winnerId}`);
}

// Socket Connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join global broadcast feed room automatically
  socket.join('broadcast');

  // 1. Queue Matchmaking
  socket.on('match:find', async (userData) => {
    // Remove if already in queue
    const existingIndex = matchmakingQueue.findIndex(item => item.user.id === userData.id);
    if (existingIndex !== -1) {
      matchmakingQueue.splice(existingIndex, 1);
    }

    matchmakingQueue.push({ socket, user: userData });
    console.log(`User queued: ${userData.username}. Total in queue: ${matchmakingQueue.length}`);

    // If 2 players exist in the queue, match them
    if (matchmakingQueue.length >= 2) {
      const p1 = matchmakingQueue.shift();
      const p2 = matchmakingQueue.shift();
      const matchId = `match_${Date.now()}`;

      // Select dynamic problem
      const problem = await getMatchProblem();

      const matchState = {
        id: matchId,
        status: 'vs_reveal',
        players: {
          [p1.user.id]: {
            ...p1.user,
            socketId: p1.socket.id,
            ready: false,
            submissionsLeft: 2,
            progress: 0,
            code: '',
            language: 'cpp'
          },
          [p2.user.id]: {
            ...p2.user,
            socketId: p2.socket.id,
            ready: false,
            submissionsLeft: 2,
            progress: 0,
            code: '',
            language: 'cpp'
          }
        },
        problem: problem,
        createdAt: Date.now()
      };

      matches.set(matchId, matchState);
      
      // Associate socket ids
      socketUserMap.set(p1.socket.id, { user_id: p1.user.id, match_id: matchId });
      socketUserMap.set(p2.socket.id, { user_id: p2.user.id, match_id: matchId });

      p1.socket.join(matchId);
      p2.socket.join(matchId);

      // Write match to database
      await dbCreateMatch(matchId, p1.user, p2.user, problem.id);

      // Trigger matchmaking roulette assignment
      p1.socket.emit('match:found', { opponent: p2.user, match_id: matchId });
      p2.socket.emit('match:found', { opponent: p1.user, match_id: matchId });
      console.log(`Created Match Room: ${matchId}`);
    }
  });

  // Cancel queuing
  socket.on('match:cancel', (userId) => {
    const existingIndex = matchmakingQueue.findIndex(item => item.user.id === userId);
    if (existingIndex !== -1) {
      matchmakingQueue.splice(existingIndex, 1);
      console.log(`User cancelled matchmaking: ${userId}`);
    }
  });

  // 2. Client ready after VS Reveal completes
  socket.on('match:ready', ({ match_id, user_id }) => {
    const match = matches.get(match_id);
    if (!match) return;

    if (match.players[user_id]) {
      match.players[user_id].ready = true;
      match.players[user_id].socketId = socket.id; // Refresh socket connection id
      socketUserMap.set(socket.id, { user_id, match_id });
      socket.join(match_id);
    }

    const allReady = Object.values(match.players).every(p => p.ready);
    if (allReady && match.status === 'vs_reveal') {
      match.status = 'active';
      match.deadline = Date.now() + 1800 * 1000; // 30 minutes
      io.to(match_id).emit('match:start', {
        problem: match.problem,
        deadline: match.deadline,
        submissions_cap: 2
      });
      console.log(`Match started: ${match_id}`);
    }
  });

  // 3. Real-time typing indicators
  socket.on('me:typing', () => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    socket.to(meta.match_id).emit('opponent:typing', { at: Date.now() });
  });

  // 4. Ghost cursor updates
  socket.on('me:cursor', ({ line }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    socket.to(meta.match_id).emit('opponent:cursor', { line });
  });

  // 5. Sample Test Cases run (unlimited attempts, sample cases only)
  socket.on('testrun', async ({ problem_id, code, language }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;

    const match = matches.get(meta.match_id);
    if (!match) return;

    if (code && code.length > MAX_CODE_LENGTH) {
      return socket.emit('submit:error', { reason: 'Code exceeds 100KB limit.' });
    }

    socket.emit('testrun:compiling');

    try {
      const problem = match.problem;
      const testCases = problem.test_cases;
      
      const baseLimit = problem.time_limit_ms || 3000;
      const multiplier = TIME_MULTIPLIERS[language] || 1.0;
      const runTimeout = baseLimit * multiplier;

      // Run sample cases sequentially or parallel
      const runs = testCases.map(async (tc) => {
        const out = await runPiston(code, language, tc.input, runTimeout);
        const j = judgeSingleCase(out, tc.output);
        return {
          verdict: j.verdict,
          stdout: out.run ? out.run.stdout : '',
          stderr: out.run ? out.run.stderr : (out.compile ? out.compile.stderr : ''),
          compile_code: out.compile ? out.compile.code : 0
        };
      });

      const resolvedRuns = await Promise.all(runs);
      socket.emit('testrun:result', {
        success: resolvedRuns.every(r => r.verdict === 'AC'),
        cases: resolvedRuns
      });
    } catch (err) {
      socket.emit('submit:error', { reason: 'Code execution pipeline timeout' });
    }
  });

  // 6. High stakes submit (consumes 1 of 2 submissions if not CE)
  socket.on('submit', async ({ problem_id, code, language }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;

    const match = matches.get(meta.match_id);
    if (!match) return;

    const pState = match.players[meta.user_id];
    if (!pState || pState.submissionsLeft <= 0) {
      return socket.emit('submit:error', { reason: 'No submissions remaining.' });
    }

    if (code && code.length > MAX_CODE_LENGTH) {
      return socket.emit('submit:error', { reason: 'Code exceeds 100KB limit.' });
    }

    socket.emit('submit:compiling');

    try {
      const problem = match.problem;
      const hiddenCases = problem.hidden_cases;
      
      const baseLimit = problem.time_limit_ms || 3000;
      const multiplier = TIME_MULTIPLIERS[language] || 1.0;
      const runTimeout = baseLimit * multiplier;

      // Update code draft
      pState.code = code;
      pState.language = language;

      // Judge in parallel to avoid massive timeouts
      const judgePromises = hiddenCases.map(async (hc) => {
        const out = await runPiston(code, language, hc.input, runTimeout);
        return judgeSingleCase(out, hc.output);
      });

      const verdicts = await Promise.all(judgePromises);

      // Find first failing case or set AC
      let finalVerdict = 'AC';
      let casesPassed = 0;
      let details = '';

      for (let i = 0; i < verdicts.length; i++) {
        if (verdicts[i].verdict === 'AC') {
          casesPassed++;
        } else {
          if (finalVerdict === 'AC') {
            finalVerdict = verdicts[i].verdict;
            details = verdicts[i].detail || `Failed hidden case #${i + 1}`;
          }
        }
      }

      // Check if compilation error
      const isCE = verdicts.some(v => v.verdict === 'CE');
      if (isCE) {
        finalVerdict = 'CE';
        details = verdicts.find(v => v.verdict === 'CE').detail;
      }

      // CE and REJECTED do not consume attempts
      if (finalVerdict !== 'CE') {
        pState.submissionsLeft--;
      }

      pState.progress = casesPassed;

      // Log submission to database
      await dbInsertSubmission(
        meta.match_id,
        meta.user_id,
        language,
        code,
        finalVerdict,
        casesPassed,
        hiddenCases.length
      );

      // Send result back to player
      socket.emit('submit:result', {
        verdict: finalVerdict,
        casesPassed,
        totalCases: hiddenCases.length,
        submissionsLeft: pState.submissionsLeft,
        detail: details
      });

      // Broadcast alert to opponent
      socket.to(meta.match_id).emit('opponent:submitted', {
        verdict: finalVerdict,
        casesPassed,
        totalCases: hiddenCases.length,
        submissionsLeft: pState.submissionsLeft
      });

      // Handle win/lose or tiebreaker check
      if (finalVerdict === 'AC') {
        // Player got AC! Immediately declared winner
        endMatch(meta.match_id, meta.user_id, 'Rival solved all cases correctly.');
      } else {
        // Check if both out of attempts
        const opponentId = Object.keys(match.players).find(id => id !== meta.user_id);
        const oppState = match.players[opponentId];
        
        if (pState.submissionsLeft === 0 && oppState.submissionsLeft === 0) {
          // Both players exhausted attempts, run tiebreaker
          const winnerId = evaluateTiebreaker(match);
          endMatch(meta.match_id, winnerId, 'Both players exhausted attempts. Evaluating score.');
        }
      }

    } catch (err) {
      console.error(err);
      socket.emit('submit:error', { reason: 'Code execution pipeline failed.' });
    }
  });

  // 7. Forfeit match
  socket.on('match:forfeit', () => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;

    const match = matches.get(meta.match_id);
    if (!match) return;

    const opponentId = Object.keys(match.players).find(id => id !== meta.user_id);
    endMatch(meta.match_id, opponentId, 'Rival forfeited the duel.');
  });

  // 8. Anti-cheat events logging
  socket.on('anticheat:fullscreen_exit', ({ violation }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    dbLogAntiCheat(meta.match_id, meta.user_id, 'fullscreen_exit', { violation });
  });

  socket.on('anticheat:tab_switch', ({ count }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    dbLogAntiCheat(meta.match_id, meta.user_id, 'tab_switch', { count });
  });

  socket.on('anticheat:external_paste', (pasteDetails) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    dbLogAntiCheat(meta.match_id, meta.user_id, 'external_paste', pasteDetails);
  });

  socket.on('anticheat:disqualify', ({ reason }) => {
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;
    dbLogAntiCheat(meta.match_id, meta.user_id, 'disqualify', { reason });
    
    // Forfeit the match for disqualified user
    const match = matches.get(meta.match_id);
    if (match) {
      const opponentId = Object.keys(match.players).find(id => id !== meta.user_id);
      endMatch(meta.match_id, opponentId, `Disqualified: ${reason}`);
    }
  });

  // Explicit broadcast feed joiner
  socket.on('broadcast:join', () => {
    socket.join('broadcast');
    console.log(`Socket ${socket.id} joined broadcast feed.`);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    const meta = socketUserMap.get(socket.id);
    if (!meta) return;

    const match = matches.get(meta.match_id);
    if (!match) {
      socketUserMap.delete(socket.id);
      return;
    }

    // Set opponent status to disconnected
    socket.to(meta.match_id).emit('opponent:status', { status: 'disconnected' });
    
    // Set 30-second grace period for reconnect
    setTimeout(() => {
      // Re-verify if player reconnected
      const freshMatch = matches.get(meta.match_id);
      if (freshMatch && freshMatch.status !== 'completed') {
        const pState = freshMatch.players[meta.user_id];
        // If the socketId matches the disconnected one, it means they never re-bound
        if (pState && pState.socketId === socket.id) {
          const opponentId = Object.keys(freshMatch.players).find(id => id !== meta.user_id);
          endMatch(meta.match_id, opponentId, 'Opponent disconnected and grace period expired.');
        }
      }
    }, 30000);
  });
});

server.listen(PORT, () => {
  console.log(`AlgoClash Real-time Server active on port ${PORT}`);
});
