# AlgoClash: Complete Blueprint
> Ground-level. No fluff. Everything we know as of April 2026.

---

## WHO YOU ARE RIGHT NOW

- Solo founder, student
- ₹5,000 in hand
- algoclash.com domain owned
- Supabase + React + Vite frontend shell exists (auth works, dashboard is empty)
- No company registered
- No investors
- No team

---

## WHAT EXISTS IN CODE RIGHT NOW

| Feature | Status |
|---|---|
| Landing page | Done |
| Google OAuth | Done |
| Username onboarding | Done |
| Route guards (AuthGuard) | Done |
| Dashboard UI | Shell only, all zeros |
| Code editor | Not started |
| Judge system | Not started |
| Match room / Socket.io | Not started |
| ELO / matchmaking | Not started |
| Problems database | Not started |
| Payment | Not started |

---

## THE NORTH STAR

**Short term:** First tournament. 34 paid entries minimum. Prove it works.  
**Medium term:** 500–2,000 active student users across India. Recurring revenue.  
**Long term:** India → Vietnam → Korea → Japan. Every CS student from Mumbai to Tokyo knows their national rank on AlgoClash. Every country has a champion. That is the company.

Everything below serves that in order.

---

## THE USP — WHAT MAKES THIS NOT CODEFORCES

This needs to be locked in before building anything. Every feature decision runs through this filter.

**Codeforces:** Everyone solves the same problem. You submit to a leaderboard. You find out your rank after. It's an exam.

**AlgoClash:** You are in a room with one specific person who is actively trying to beat you right now. You can feel them move. That's a fight.

The answer to "why pay ₹149":
> *"Because I'm not submitting to a leaderboard. I'm watching my opponent's cursor jump to line 47 while my screen is turning red. That's not a test. That's combat."*

**Non-negotiable product principles:**
- Every competitive match is exactly 1v1. No exceptions. No group rounds.
- Ghost Cursors are live in every match. Opponent's line number always visible.
- Red Screen fires when opponent hits 80%+ test cases. Always.
- Problems are in Blitz format — no Alice/Bob stories, pure objectives.
- The psychological pressure is the product. The code is just the medium.

If a feature doesn't serve the 1v1 psychological warfare experience, it waits.

---

# PHASE 0 — BUILD TO LAUNCHABLE
> Timeline: 3–5 weeks | Cost: ₹0

This is the only phase where you write code before making money.  
Build the minimum thing a 1v1 tournament needs. Nothing more.

## What to Build (Critical Path Only)

### Week 1 — The Judge
**Monaco Editor + Piston API. One user submits code. Gets a verdict.**

Install Monaco:
```bash
npm install @monaco-editor/react
```

Piston API call (free, no key):
```js
const response = await fetch('https://emkc.org/api/v2/piston/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: 'python',       // or cpp, java, javascript
    version: '*',
    files: [{ content: userCode }],
    stdin: testCaseInput,
    run_timeout: 3000,        // 3 second limit
  })
});
const { run } = await response.json();
// run.stdout = output, run.stderr = errors, run.code = exit code
```

Test case matching — full verdict logic (not just string compare):

```js
function judge(pistonResult, expectedOutput, lang, problem) {
  const { run, compile } = pistonResult;

  // 1. Compilation error (C++/Java)
  if (compile && compile.code !== 0) {
    return { verdict: 'CE', detail: compile.stderr.slice(0, 500) };
  }

  // 2. TLE or MLE — Piston SIGKILL signal
  if (run.signal === 'SIGKILL') {
    return run.stderr.includes('MemoryError') || run.stderr.includes('bad_alloc')
      ? { verdict: 'MLE' }
      : { verdict: 'TLE' };
  }

  // 3. Runtime error — nonzero exit + no stdout
  if (run.code !== 0 && !run.stdout.trim()) {
    return { verdict: 'RE', detail: run.stderr.slice(0, 500) };
  }

  // 4. Output comparison
  const actual = run.stdout.trim();
  const expected = expectedOutput.trim();

  if (problem.comparator === 'float') {
    return floatCompare(actual, expected, 1e-6)
      ? { verdict: 'AC' }
      : { verdict: 'WA' };
  }
  if (problem.comparator === 'custom') {
    return problem.checker(actual, expected)
      ? { verdict: 'AC' }
      : { verdict: 'WA' };
  }
  return actual === expected ? { verdict: 'AC' } : { verdict: 'WA' };
}
```

Verdict codes (industry standard, match Codeforces/AtCoder):
- `AC` — Accepted
- `WA` — Wrong Answer
- `TLE` — Time Limit Exceeded
- `MLE` — Memory Limit Exceeded
- `RE` — Runtime Error
- `CE` — Compilation Error

That is your entire judge. Done.

---

## Language Support & Fairness

**Supported languages: C++, Java, Python only.** Intentional constraint. More languages = more edge cases = more cheating surface area. Three is enough.

**Time limit multipliers** (applied to problem's base time_limit_ms):

```js
const TIME_MULTIPLIERS = {
  'cpp':    1.0,   // baseline
  'java':   2.0,   // JVM startup + verbosity
  'python': 3.0    // interpreted overhead
};

const MEMORY_LIMITS_MB = {
  'cpp':    256,
  'java':   512,
  'python': 512
};
```

**Piston language identifiers** (exact strings to pass to API):

```js
const PISTON_LANG = {
  'cpp':    { language: 'c++',    version: '*' },  // latest gcc
  'java':   { language: 'java',   version: '*' },
  'python': { language: 'python', version: '*' }   // python 3
};
```

**Problem seeding rule (non-negotiable):** Every problem in the database must have a verified reference solution in **all three languages** that passes all hidden test cases within the language's multiplied time limit. If the Python reference TLEs at 3x, the problem is rejected from the seed set.

Seed problem record:
```sql
alter table problems add column reference_solutions jsonb;
-- shape: { cpp: "...", java: "...", python: "..." }
alter table problems add column comparator text default 'exact';
-- values: 'exact' | 'float' | 'custom'
alter table problems add column tags text[];  -- ['implementation', 'greedy', 'dp', ...]
```

**Code size cap:**
```js
const MAX_CODE_LENGTH = 100_000;  // chars
if (code.length > MAX_CODE_LENGTH) {
  return { verdict: 'REJECTED', detail: 'code exceeds 100KB limit' };
}
```

**Research-needed items (before tournament):**
- [ ] Verify Piston's default memory limit per language — if unset, enforce via `run_memory_limit` param
- [ ] Test Python solutions at 3x multiplier on 5 representative problems — confirm fairness
- [ ] Decide: allow Java `BufferedReader` standard imports? (yes, recommended — without it Java I/O is brutal)
- [ ] Decide: Python 3.10 vs 3.11? (3.11 is 25% faster — use latest Piston offers)

**Problems schema in Supabase:**
```sql
create table problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,         -- Blitz format: no Alice/Bob stories
  difficulty text,                    -- easy / medium / hard
  tournament_round text,              -- which round this problem is eligible for
  test_cases jsonb not null,          -- [{ input: "...", output: "..." }] shown to player on WA
  hidden_cases jsonb not null,        -- what actually decides the verdict, never shown
  stress_test_input text,             -- very large input (n=10^6+) for tiebreaker runtime comparison
  time_limit_ms int default 3000,
  comparator text default 'exact',    -- exact | float | custom
  tags text[],                        -- ['greedy', 'dp', 'implementation', ...]
  reference_solutions jsonb,          -- { cpp: "...", java: "...", python: "..." }
  created_at timestamptz default now()
);
```

**The performance hidden test case (built into hidden_cases, not separate):**

Every problem must include at least one hidden test case with n at maximum constraint. This is the performance gate:
- An O(n) solution passes it within the time limit
- An O(n²) solution gets TLE — fails it

This means a player with a correct but inefficient algorithm loses hidden cases to a player with an efficient one. Algorithm quality is judged automatically without any extra tiebreaker logic. The `stress_test_input` field is the extreme version used only when both players pass ALL hidden cases and you need to compare raw runtime.

Seed 15 problems minimum before tournament. Focus on easy-medium. Rewrite open problem set descriptions in Blitz format. Each problem must pass reference solutions in all three languages before being added.

---

### Week 2 — The Match Room (Socket.io)
**Two players. Same problem. Race. This is the hardest week.**

**Infra: Fly.io free tier** — Node.js + Socket.io server. Zero cost.

```
fly launch    # creates app
fly deploy    # deploys
```

Match flow:
```
Player A clicks "Find Match"
  → joins matchmaking queue (stored in Redis / in-memory for now)
Player B clicks "Find Match"
  → server pairs them
  → creates match record in Supabase
  → emits "match:start" to both with problem + room ID

Both players code in Monaco
Player A submits
  → server calls Piston API
  → if all hidden test cases pass → emit "match:end" { winner: A }
  → update ELO in profiles table
  → redirect both to results screen

If no submission in 30 min → draw, no ELO change
If both players exhaust their 2 submissions without AC → tiebreaker hierarchy decides winner
```

---

### The Arena Feel (Phase 0, non-negotiable)

> The product promise: **"It feels like you're actually fighting someone."** If we ship T#1 without the features below, we are shipping LeetCode-with-a-timer. Anyone can clone that in a weekend. The psychological presence of the opponent IS the moat.

Previous versions of this blueprint put these in Phase 2. **That was wrong.** Moving to Phase 0. These features ship with T#1.

All of them are implementable in 2-3 days of focused Socket.io + React work. Tiny JSON messages (~50 bytes). Trivial bandwidth even at 64 concurrent matches.

#### 1. Presence & Typing Activity
Opponent status in real time: `active` / `idle` / `disconnected`.

```js
// Client — debounced 500ms
editor.onDidChangeModelContent(() => {
  debouncedEmit('me:typing');
});

// Server
socket.on('me:typing', () => {
  const now = Date.now();
  userState[userId].lastActivity = now;
  opponentSocket.emit('opponent:typing', { at: now });
});

// Client (opponent side) — renders a subtle pulse next to opponent's avatar
// If no "opponent:typing" event for 5+ seconds → "idle"
// Socket disconnect → "offline" (red)
```

#### 2. Ghost Cursor (line number broadcast)
Every 2 seconds, broadcast opponent's current editing line number. NOT keystrokes, NOT content — just line number. Prevents cheating (no code leak) while maximizing tension.

```js
// Client
setInterval(() => {
  const line = monacoEditor.getPosition().lineNumber;
  socket.emit('me:cursor', { line });
}, 2000);

// Opponent's client renders: "Opponent is on line 23"
// Show a ghost line indicator in your own editor at their line
```

**Why this feels alive:** seeing the opponent's cursor moving toward the bottom of their screen = "they're almost done." Pure psychological pressure with zero cheating risk.

#### 3. Opponent Submission Alert
When opponent hits submit, YOUR screen flashes a notification:

```js
// Triggered by 'opponent:submitted' event from server (see Submission Cap section)
showToast({
  text: "Opponent just submitted!",
  subtext: `Passed ${hidden_cases_passed}/${hidden_cases_total} cases`,
  variant: hidden_cases_passed >= hidden_cases_total * 0.8 ? 'danger' : 'warning',
  duration: 4000
});
```

#### 4. Live Progress Bar
After each opponent submit, their test-case pass count is visible to you on a small progress bar at top of match room. You don't see WHICH cases failed — just how many passed.

```
Opponent:  ██████████░░  10/12    (yours: 7/12)
```

This creates the core drama: "they're ahead, I need to hurry."

#### 5. Red Screen Alert (80% threshold)
When opponent passes ≥80% of hidden cases, your screen edges pulse red. Pure CSS animation triggered by Socket.io event. 2 hours of work. Massive UX impact.

```css
@keyframes redPulse {
  0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 0, 0, 0); }
  50%      { box-shadow: inset 0 0 60px 10px rgba(255, 0, 0, 0.6); }
}
.danger-mode { animation: redPulse 1.2s ease-in-out infinite; }
```

```js
socket.on('opponent:submitted', ({ hidden_cases_passed, hidden_cases_total }) => {
  if (hidden_cases_passed / hidden_cases_total >= 0.8) {
    document.body.classList.add('danger-mode');
  }
});
```

#### 6. Submission Counter (always visible)
Top-right corner of match room, at all times:

```
⚡ Submissions: 2 remaining   ← green
⚡ Submissions: 1 remaining   ← yellow, pulsing
⚡ Submissions: 0 remaining   ← red, input disabled
```

This is the heartbeat of the match. Players will stare at it before each submit.

#### 7. Countdown Timer (server-authoritative)
```
⏱  08:42 remaining
```

Shown large, centered at top of match room. Color transitions: green (>10min) → yellow (2-10min) → red pulsing (<2min). Server sends `match.deadline` (ISO timestamp). Client renders local countdown, but server is authoritative — match ends based on server clock, not client.

#### 8. Victory / Defeat Moments + Post-Match Routing

When a match ends, a full-screen moment first — then automatic routing. Both flows happen without the player clicking anything.

**Winner screen (3 seconds):**
```
VICTORY                        ← large, gold
+18 ELO  →  1,218 total
Solved in 14:32
[opponent's code revealed after 3s auto-advance]
```
After 3 seconds: **auto-redirect to Spectator view** of another live match.

Overlay shows: `⚔ Your next match in 08:12` — server-sent countdown to their scheduled next round. They can watch the live match while waiting. Ghost cursors active in spectator view too.

**Defeat screen (3 seconds):**
```
DEFEATED                       ← large, gray
-14 ELO  →  1,186 total
[name] solved it in 14:32
```
After 3 seconds: **auto-redirect to Spectator view** of another live match.

Difference from winner: a **paywall card docked at bottom** of spectator view.

```
┌─────────────────────────────────────────────────────┐
│  🔍 Your Match Analysis                             │
│  See where you went wrong. Hidden cases revealed.   │
│  Side-by-side code comparison. AI-generated hint.   │
│                                                     │
│  [Unlock for ₹29]          [Free with Pro ₹199/mo] │
└─────────────────────────────────────────────────────┘
```

The paywall card doesn't block the spectator view — it docks at bottom. Player can watch, but the analysis card is always visible, always a reminder. This is the T#1 monetization surface for Phase 2 subscriptions. Plant the seed early.

**What analysis unlocks:**
- Which hidden test cases they failed and the actual inputs (sanitized — no full test data leak)
- Timeline: a bar chart of both players' typing activity, submission moments, Red Screen triggers
- Winner's final AC code (annotated with where the approaches diverged)
- One AI-generated hint: "You handled n≤1000 correctly but your time complexity breaks at n=10^5 — try X approach instead"

**Why both go to Spectator:**
- Winner: occupied and engaged, not idle. Less dropout between rounds.
- Loser: sees other matches happening, feels the tournament is alive, might buy analysis, might buy tournament ticket next time.
- Both: more time on platform = more WhatsApp screenshots = free marketing.

Emotional moments are shareable. Screenshots of defeat screens go to WhatsApp. WhatsApp is the distribution channel.

---

#### 9. Matchmaking Roulette + VS Reveal Screen

This is the moment before combat. Not a loading spinner. A **cinematic reveal**.

**Flow:**
```
Player clicks "Find Match" / bracket system assigns opponent
  → Socket.io emits match:found to both players
  → Both clients start Roulette animation simultaneously (client-side, 3-4 seconds)
  → After animation: VS screen for 2 seconds
  → Then: match:start — problem revealed, 30-min timer begins
```

**Roulette animation:**

A slot machine cycling through opponent names. Starts fast, slows to a stop on actual opponent. Duration: 3 seconds. Pure CSS + setTimeout. No server calls during this — data already arrived with `match:found`.

```js
// Client-side roulette
function playMatchmakerRoulette(actualOpponent, onComplete) {
  const names = shuffledFakeNames;  // pre-loaded list of random usernames
  let speed = 50;  // ms per swap, starts fast
  let i = 0;
  let elapsed = 0;
  const totalDuration = 3000;

  const tick = () => {
    displayOpponentName(names[i % names.length]);
    i++;
    elapsed += speed;
    speed = Math.min(speed * 1.08, 400);  // exponential slowdown
    if (elapsed < totalDuration) {
      setTimeout(tick, speed);
    } else {
      displayOpponentName(actualOpponent.username);  // land on real name
      onComplete();
    }
  };
  tick();
}
```

**VS Screen (2 seconds after roulette):**

Full-screen. Dark background. Two player cards animate in from sides.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ┌──────────────┐          VS          ┌──────────────┐      │
│   │              │                      │              │      │
│   │   [avatar]   │                      │   [avatar]   │      │
│   │   Shubham    │                      │   garvit_99  │      │
│   │   ELO: 1218  │                      │   ELO: 1204  │      │
│   │              │                      │              │      │
│   └──────────────┘                      └──────────────┘      │
│                                                                │
│                    ⚔  MATCH BEGINS IN 2  ⚔                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

Player card (top-left in match room, not full screen) persists into the actual match — small, always visible. So during the fight you always see: your name + ELO top-left, opponent name + ELO bottom-right (or top-right). Mortal Kombat health bar layout.

```jsx
// Match room persistent layout
<div className="match-room">
  <div className="player-card self top-left">
    <Avatar user={me} />
    <span>{me.username}</span>
    <span className="elo">{me.elo}</span>
  </div>

  <div className="match-timer center-top">{timeRemaining}</div>

  <div className="player-card opponent bottom-right">
    <Avatar user={opponent} />
    <span>{opponent.username}</span>
    <span className="elo">{opponent.elo}</span>
    <span className="attempts">{opponentAttemptsRemaining} attempts left</span>
  </div>

  <MonacoEditor ... />
  <SubmitBar attemptsRemaining={myAttemptsRemaining} />
</div>
```

**Why this matters:** The roulette + VS screen takes 5 seconds total. In those 5 seconds the player goes from "waiting for match" to "I know exactly who I'm fighting and they know me." That psychological commitment — you've seen each other's ELO, you know if they're stronger or weaker — changes how people play. It's not a coding problem anymore. It's a duel.

**Socket.io events to add:**
```
Server → Client:
  match:found     { opponent: { id, username, elo, avatar_url }, match_id }
  match:start     { problem, deadline, submissions_cap: 2 }  ← sent AFTER roulette delay

Client → Server:
  match:ready     { }   ← client emits this after roulette animation completes
                         server waits for BOTH match:ready before emitting match:start
```

The `match:ready` handshake ensures both players see the roulette + VS screen fully before the problem appears. No one gets a head start because their connection was faster.

#### Socket.io Events Summary (complete list for Phase 0)

```
Server → Client:
  match:found         { opponent: { id, username, elo, avatar_url }, match_id }
  match:start         { problem, deadline, submissions_cap: 2 }   ← after both ready
  opponent:typing     { at }
  opponent:cursor     { line }
  opponent:submitted  { verdict, hidden_cases_passed, hidden_cases_total, attempts_remaining }
  submit:result       { verdict, hidden_cases_passed, hidden_cases_total, attempts_remaining }
  submit:error        { reason }
  testrun:result      { sample_cases_passed, stdout_by_case }
  match:end           { winner_id, your_elo_change, opponent_code, next_match_in_seconds }
  spectate:assigned   { spectating_match_id }           ← post-match auto-routing
  opponent:disconnected { grace_period_seconds }
  opponent:reconnected  { }

Client → Server:
  match:find          { }                      # enter queue
  match:ready         { }                      # after roulette animation complete
  me:typing           { }                      # debounced 500ms
  me:cursor           { line }                 # every 2s
  submit              { problem_id, code, language }
  testrun             { problem_id, code, language }  # unlimited, sample cases only
  match:forfeit       { }                      # voluntary surrender
  spectate:join       { match_id }             # join spectator room
  spectate:leave      { match_id }             # leave spectator room
```

#### Bandwidth Budget

Per match, per player, over 30 minutes:
- Typing events: ~60/min × 30 min × 30 bytes = ~54KB
- Cursor events: 30/min × 30 min × 30 bytes = ~27KB
- Submission events: 4 max × 200 bytes = ~1KB
- **Total per match: ~80KB per player. Nothing.**

Fly.io free tier Socket.io won't OOM from bandwidth. It will OOM from concurrent connection count. That's why tournament day upgrades to paid DO droplet regardless.

**Supabase tables needed:**
```sql
create table matches (
  id uuid primary key default gen_random_uuid(),
  player_one uuid references profiles(id),
  player_two uuid references profiles(id),
  problem_id uuid references problems(id),
  winner uuid references profiles(id),
  status text default 'active',   -- active / completed / draw
  started_at timestamptz default now(),
  ended_at timestamptz,
  player_one_elo_before int,
  player_two_elo_before int,
  player_one_elo_after int,
  player_two_elo_after int
);

-- Add to profiles:
alter table profiles add column elo int default 1200;
alter table profiles add column wins int default 0;
alter table profiles add column losses int default 0;
```

**Submission cap (game-design decision, not rate limit):**

**2 submissions maximum per player per problem.** Not a cooldown — a hard cap. Codeforces/AtCoder use penalties instead; we use a hard cap because it forces high-stakes drama every submit.

Why 2 and not 1 or 3:
- **1** — too punishing. One typo and the match is effectively over.
- **2** — one real attempt + one recovery. Rewards thinking before submitting. Each submit feels heavy.
- **3+** — devolves into guess-and-check, kills the tension.

**"Test Run" is unlimited and free.** Players can run their code against the **sample test cases** (visible to them) as many times as they want. This is debugging, not submission. Only "Submit" (runs against hidden cases) consumes an attempt.

What counts as a consumed submission:
| Verdict | Counts against 2-cap? | Reason |
|---|---|---|
| AC (Accepted) | — | Match ends, winner declared |
| WA (Wrong Answer) | Yes | Real attempt, didn't pass hidden cases |
| TLE / MLE / RE | Yes | Real attempt, logic or perf issue |
| CE (Compilation Error) | **No** | Syntax typo shouldn't burn a life |
| REJECTED (code too large, etc.) | No | Client-side validation failure |

CE not counting is intentional. Without this, a missing semicolon costs 50% of attempts. Unfair.

Anti-abuse: the CE exemption doesn't let players spam submissions as a fake compiler — Piston still takes 2-8s per call, and there's a 3-second **cooldown between submission attempts** to prevent UI spam. Cooldown ≠ cap; both exist.

```js
// Server-side enforcement
const submissionsForProblem = new Map();  // key: `${userId}:${problemId}` → { count, lastSubmitAt }

socket.on('submit', async ({ problemId, code, language }) => {
  const key = `${userId}:${problemId}`;
  const state = submissionsForProblem.get(key) || { count: 0, lastSubmitAt: 0 };

  // 3-sec cooldown between submits (UI debounce, not a real rate limit)
  if (Date.now() - state.lastSubmitAt < 3000) {
    return socket.emit('submit:error', { reason: 'Please wait a moment' });
  }

  if (state.count >= 2) {
    return socket.emit('submit:error', { reason: 'No submissions remaining' });
  }

  const result = await judgeSubmission(code, language, problemId);

  // CE does not consume an attempt
  if (result.verdict !== 'CE' && result.verdict !== 'REJECTED') {
    state.count += 1;
  }
  state.lastSubmitAt = Date.now();
  submissionsForProblem.set(key, state);

  // Write to submissions table (microsecond timestamp via Postgres default)
  await insertSubmission({ match_id, user_id: userId, problem_id: problemId, ...result });

  // Notify submitter with attempts remaining
  socket.emit('submit:result', { ...result, attempts_remaining: 2 - state.count });

  // BROADCAST TO OPPONENT — this is where the game becomes alive (see Arena Feel section)
  opponentSocket.emit('opponent:submitted', {
    verdict: result.verdict,
    hidden_cases_passed: result.hidden_cases_passed,
    hidden_cases_total: result.hidden_cases_total,
    attempts_remaining: 2 - state.count
  });
});

// Test Run (sample cases only — unlimited, does not count)
socket.on('testrun', async ({ problemId, code, language }) => {
  const problem = await getProblem(problemId);
  const result = await runAgainstCases(code, language, problem.test_cases);  // NOT hidden_cases
  socket.emit('testrun:result', result);
});
```

---

### Submissions Table (required for tiebreakers + audit)

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id),
  user_id uuid references profiles(id),
  language text not null,                  -- 'cpp' | 'java' | 'python'
  code text not null,
  verdict text not null,                   -- AC | WA | TLE | MLE | RE | CE | REJECTED
  hidden_cases_passed int default 0,
  hidden_cases_total int default 0,
  execution_time_ms int,
  memory_used_kb int,
  submitted_at timestamptz default clock_timestamp(),  -- microsecond precision
  judged_at timestamptz
);

create index idx_submissions_match on submissions(match_id, submitted_at);
```

Every submission logs here. Tiebreakers read from this table. Anti-cheat reads from this table. Audit trail lives here forever.

### Perfect Tiebreaker Hierarchy (deterministic, zero extra latency)

Runs server-side at match end. All data already in `submissions` table. No network call.

```
1. First player to submit AC (all hidden cases passed) → winner
2. Neither player got AC:
   → Higher hidden_cases_passed count wins
3. Same hidden_cases_passed:
   → Earliest submitted_at (microsecond timestamp) for that best submission wins
4. Same timestamp (essentially impossible, <1μs collision):
   → Fewer total submissions wins (cleaner solver)
5. Still tied (astronomical):
   → Lower player UUID lexicographically (deterministic, logged as 'tiebreak_fallback')
```

**Never use client timestamps. Never coin flip.** Postgres `clock_timestamp()` on submission insert = single source of truth.

### Bracket Engine (automatic progression — 64 → 32 → 16 → 8 → 4 → 2 → 1)

```sql
create table brackets (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id),
  round int not null,                            -- 1..6 for 64-player
  slot int not null,                             -- position within round
  match_id uuid references matches(id),
  player_one uuid references profiles(id),
  player_two uuid references profiles(id),
  winner uuid references profiles(id),
  next_bracket_id uuid references brackets(id),  -- winner advances here
  status text default 'pending',                 -- pending | active | completed | forfeit
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index idx_brackets_tournament on brackets(tournament_id, round, slot);
```

**Seed function** (runs once when tournament fills to 64):
```js
async function seedBracket(tournamentId) {
  const players = await getRegisteredPlayers(tournamentId);  // 64
  // Seed by ELO: highest vs lowest in each pairing — fairer than random
  players.sort((a, b) => b.elo - a.elo);
  const paired = pairBySeed(players);  // [(p1,p64), (p2,p63), ...]

  // Create round 1 (32 matches)
  const round1 = [];
  for (let i = 0; i < 32; i++) {
    round1.push(await createBracket({
      tournament_id: tournamentId,
      round: 1, slot: i,
      player_one: paired[i][0].id,
      player_two: paired[i][1].id
    }));
  }

  // Create empty rounds 2–6 with next_bracket_id links
  let prev = round1;
  for (let r = 2; r <= 6; r++) {
    const next = [];
    for (let i = 0; i < prev.length / 2; i++) {
      const slot = await createBracket({ tournament_id: tournamentId, round: r, slot: i });
      await updateBracket(prev[i * 2].id,     { next_bracket_id: slot.id });
      await updateBracket(prev[i * 2 + 1].id, { next_bracket_id: slot.id });
      next.push(slot);
    }
    prev = next;
  }

  // Kick off all round 1 matches in parallel
  await Promise.all(round1.map(startMatch));
}
```

**Auto-advance on match end:**
```js
async function onMatchEnd(matchId, winnerId) {
  const b = await getBracketByMatch(matchId);
  await updateBracket(b.id, { winner: winnerId, status: 'completed', completed_at: new Date() });

  if (!b.next_bracket_id) {
    return finalizeTournament(b.tournament_id, winnerId);  // grand final done
  }
  const next = await getBracket(b.next_bracket_id);

  if (!next.player_one) {
    await updateBracket(next.id, { player_one: winnerId });
  } else {
    await updateBracket(next.id, { player_two: winnerId });
    await startMatch(next);  // both slots filled → go
  }
}
```

**Staggered round starts:** Each pair of sibling matches triggers next-round match as soon as both finish. Don't wait for entire round. Less idle waiting = less dropout.

**Grace period (no-show):** 5 minutes after `startMatch` emits, if player hasn't connected → auto-forfeit, opponent wins by walkover.

---

### Week 3 — Tournament Registration + Payment

**Tournament table in Supabase:**
```sql
create table tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  entry_fee int not null,          -- in rupees
  prize_pool int not null,
  max_slots int not null,
  registered_count int default 0,
  status text default 'open',      -- open / full / ongoing / completed
  scheduled_at timestamptz,
  format text default 'single_elimination'
);

create table tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id),
  user_id uuid references profiles(id),
  payment_status text default 'pending',  -- pending / paid / refunded
  razorpay_payment_id text,
  registered_at timestamptz default now()
);
```

**Razorpay Payment Link** — no company needed. Just PAN + bank account.
- Create account at razorpay.com
- Generate a ₹149 payment link
- Add a Google Form field: "Paste your Razorpay transaction ID"
- Manually verify + flip payment_status to 'paid' in Supabase
- Automate this in Phase 2 when you have money for Razorpay API

For Tournament #1, manual verification is fine at 200 people. It takes 2 hours. Do it.

---

### Week 3.5 — Edge Case Handling (Critical, Don't Skip)

This section exists because tournament day is where tiny unhandled cases become public disasters. Handle all of these before inviting a single paying user.

#### A. Code-Level Edge Cases (handled inside `judge()`)

| Case | Detection | Verdict |
|---|---|---|
| Infinite loop / slow algo | Piston `run.signal === 'SIGKILL'` past timeout | `TLE` |
| Memory blow-up (e.g. 10^9 array) | SIGKILL + `MemoryError` / `bad_alloc` in stderr | `MLE` |
| Segfault, null ptr, div-by-zero | `run.code !== 0` + empty stdout | `RE` |
| C++/Java compile fail | `compile.code !== 0` | `CE` |
| Python syntax error | runtime traceback in stderr, no stdout | `RE` |
| Empty output | `run.stdout.trim() === ''` | `WA` |
| Trailing whitespace/newlines | `.trim()` both sides before compare | normalized, not a fail |
| Case sensitivity ("YES" vs "yes") | problem-level flag `case_sensitive: true/false` | per problem |
| Floating-point precision | `Math.abs(a-b) < 1e-6`, set via `comparator: 'float'` | per problem |
| Multiple valid answers (e.g. "any valid path") | `comparator: 'custom'` + per-problem checker fn | per problem |
| Nonzero exit code but correct output | stdout matches expected | still `AC` (warn-log only) |
| Stderr noise, stdout correct | ignore stderr in verdict | `AC` |
| Code length abuse (10MB paste) | client + server check `code.length > 100_000` | `REJECTED` before Piston |
| Non-deterministic output (random seed, dict iter order) | flagged during problem seeding | reject problem if output is non-deterministic |
| Windows line endings (`\r\n`) in stdin | Piston normalizes to `\n` | verified during seeding |
| Unicode / emoji in output | UTF-8 everywhere in Postgres + Node | test with one emoji problem |

#### B. Security Edge Cases (Piston sandboxes, enforce defensively)

| Threat | Mitigation |
|---|---|
| Fork bomb | Piston isolates with `nproc` limit (default handles it) |
| File-system writes | Piston rootfs is read-only |
| Network egress from user code | Piston sandbox has no network |
| Unbounded memory alloc | Per-language memory cap passed in Piston call |
| Compile-time abuse (C++ template metaprogramming) | Compile timeout: 10s hard cap |
| Long-running submission (bypass time limit via sleep) | Piston enforces wall-clock timeout, not CPU |
| Reading judge internals / test files | Piston isolation prevents FS access beyond sandbox |
| Copy-paste from ChatGPT | Fullscreen enforcement + tab-switch logging catches most of this. Large external paste flagged. Full Sentinel lands Phase 3. |

#### C. Match-Level Edge Cases (Socket.io + client state)

| Case | Handling |
|---|---|
| Player refreshes browser mid-match | Rejoin room via `match_id` in localStorage; code auto-saved to Supabase every 5s |
| Player closes tab | 30s grace period → if no reconnect → opponent wins by forfeit |
| Both players disconnect simultaneously | Match paused 60s → if neither returns → draw, no ELO change |
| Transient network drop (<30s) | Socket.io auto-reconnect; state resyncs from server on connect |
| Both submit AC at same millisecond | `clock_timestamp()` microsecond precision breaks tie |
| Piston API 503 mid-match | Retry 3x with exponential backoff (500ms, 1s, 2s); pause match timer; show "judge unavailable" banner; if all 3 fail → escalate to admin |
| Submit while previous Piston call still running | Reject second submit; 3-sec cooldown enforces this |
| Both players exhaust their 2 submissions without AC | Match waits until timer expires; tiebreaker hierarchy resolves winner (% passed → earliest timestamp) |
| Player exhausts 2 submissions with 20 min remaining | Client disables Submit button; Test Run still works; player can keep debugging but cannot submit again |
| CE on submission (shouldn't count) | Verdict returned, attempts_remaining unchanged, player notified "syntax errors don't consume attempts" |
| Player submits at 29:58, Piston takes 4s, judged at 30:02 | `submitted_at` timestamp is what counts; if submitted before deadline, verdict is honored |
| Opponent disconnects after exhausting their 2 submissions | You have 30s grace to submit AC and win; if match timer expires first, tiebreaker applies |
| Both players ready (match:ready) but one loses connection before match:start | Server re-emits match:start to reconnecting player; roulette doesn't replay, VS screen skipped |
| Roulette animation finishes but opponent connection dropped | Server sends match:cancelled; both players return to queue; rematch with someone else |
| Loser clicks "close" on analysis paywall | Card minimizes to a tab. Reappears on next page focus. Don't let them ignore it silently. |
| Winner's next match starts while they're still spectating | Push notification banner overlays spectator view: "Your match is ready"; click auto-routes to new VS screen |
| Player tries to spectate their own previous match (replay) | Not available Phase 0. Log the request — if common, prioritize post-match replay feature in Phase 2. |
| Match timer hits 0 mid-submission | Submissions with `submitted_at <= match.deadline` still count; late ones rejected |
| Monaco editor crashes (rare) | Code drafts written to IndexedDB every debounced keystroke (200ms); recoverable on reload |
| User spectating their own match in another tab | Allow (harmless). Ban it only if it becomes a cheating vector. |
| User opens dev tools / pauses JS | Server-side timer is authoritative. Client pause does nothing. |
| Match starts but player's clock is wrong | Client displays server-sent `deadline` timestamp, not local time delta |

#### D. Tournament-Level Edge Cases (bracket engine)

| Case | Handling |
|---|---|
| Player no-show at bracket start | 5-min grace → auto-forfeit → opponent advances |
| Both players no-show | Random winner advances (logged as `forfeit_both`); or re-seed if >1hr until next round |
| Player wins round 1 but disconnects before round 2 | 5-min grace in round 2 same as above |
| Odd player count (shouldn't happen with 64 cap) | Top ELO gets round 1 bye; only happens if cap changes |
| Tournament starts but Piston is down globally | Delay by 15 min; if still down, postpone tournament; refund entries in full |
| Prize pool payment stuck in Razorpay | Manual transfer to winners same day; document transaction IDs |

#### E. Problem-Content Edge Cases (caught during seeding, not tournament)

| Issue | Prevention |
|---|---|
| Problem solvable in C++ but Python TLEs at 3x | Reject from seed set |
| Integer overflow trap (C++ `int` vs `long long`) | Constraints explicit in description; reference solutions use correct types |
| Multiple correct outputs | Use `comparator: 'custom'` with per-problem checker |
| Off-by-one in test case generation | Every test case verified by running all 3 reference solutions locally before insert |
| Hidden case stricter than sample cases | Intentional — document which samples are "demonstrative only" |
| Problem description ambiguous | Peer-review each problem with one CP-experienced friend before seeding |

#### Verdict Display to Users

Show only final verdict to player. Don't leak which specific hidden case failed (prevents reverse-engineering tests).

```js
// Show to user:
{ verdict: 'WA', hidden_cases_passed: 7, hidden_cases_total: 12 }

// DON'T show:
{ failing_case: { input: '5 3\n1 2 3 4 5', expected: '15', got: '10' } }
```

#### Research-Needed Items

Before tournament day, validate each:
- [ ] Piston's default `nproc` sandbox limit — confirm fork bomb protection works
- [ ] Python `input()` vs `sys.stdin.read()` performance gap — document recommended I/O pattern for users
- [ ] Java `Scanner` vs `BufferedReader` — note in problem hints (Scanner is often too slow)
- [ ] Piston concurrent call limit (public API) — test with 32 parallel submissions
- [ ] Postgres `clock_timestamp()` resolution on Supabase free tier — verify microsecond precision is real, not rounded to ms
- [ ] Monaco editor auto-save interval — 5s is guess; tune based on draft size

---

### Anti-Cheat: What to Enforce and What Not To

#### The core question: fullscreen enforcement + paste disable — how far to go?

**Fullscreen enforcement: YES. Mandatory from T#1.**

Fullscreen = the player's entire screen is the match room. Any exit — tab switch, alt+tab, clicking away — is a potential lookup on ChatGPT/Claude. Enforce it.

2 violations = disqualified. Same as your college. This is the industry standard for online proctored exams.

```js
// Client — request fullscreen on match:start
async function enterFullscreen() {
  try {
    await document.documentElement.requestFullscreen();
  } catch (e) {
    // Browser denied (rare) — log, don't block
    socket.emit('anticheat:fullscreen_denied', { reason: e.message });
  }
}

// Track violations
let fullscreenViolations = 0;

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenViolations++;
    socket.emit('anticheat:fullscreen_exit', { violation: fullscreenViolations });

    if (fullscreenViolations >= 2) {
      socket.emit('anticheat:disqualify', { reason: 'fullscreen_violations' });
    } else {
      showWarning(`⚠ Fullscreen violation ${fullscreenViolations}/2. Exit again = disqualified.`);
      // Re-request fullscreen after warning
      setTimeout(() => document.documentElement.requestFullscreen(), 2000);
    }
  }
});

// Tab visibility (catches Alt+Tab even IN fullscreen on some systems)
let tabSwitches = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    tabSwitches++;
    socket.emit('anticheat:tab_switch', { count: tabSwitches });
    // Tab switches alone don't disqualify — they compound with other signals
  }
});
```

Server-side: log every `anticheat:*` event to a separate audit table. If a dispute arises, you have a timeline.

```sql
create table anticheat_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id),
  user_id uuid references profiles(id),
  event_type text not null,   -- 'fullscreen_exit' | 'tab_switch' | 'large_paste' | 'disqualify'
  payload jsonb,
  occurred_at timestamptz default clock_timestamp()
);
```

---

#### Copy-Paste: Do NOT disable it entirely.

**Why not:**

Competitive programmers copy-paste constantly — legitimately:
- Copy a function they wrote 20 lines up to reuse below
- Duplicate a loop block and modify it
- Copy their own template they typed at the start of the match
- Fix a mistake by selecting and replacing

Disabling paste means they can't do any of this. The frustration is real and the backlash from the CP community will be immediate. "This platform is trash, can't even copy my own code" will be the first tweet. You'll lose the players you most want to keep — the serious competitive programmers.

Your college can do it because it's mandatory and grades are on the line. AlgoClash is optional and paid. Different contract.

**What ACTUALLY stops cheating:**

Fullscreen enforcement already closes the main cheating vector (AI tab). The secondary vector is pre-written solutions — code the player prepared beforehand. Here's how to handle that without destroying UX:

---

#### Paste Detection: Internal vs External (Phase 0)

**Critical clarification:** `onDidPaste` in Monaco fires for ALL Ctrl+V pastes — including when a player copies their own code from within the editor and repastes it. Internal copy also goes through the OS clipboard. So checking paste size alone flags legitimate internal copy-paste.

**Wrong fix:** Capping internal paste at 2 lines. A cheater just pastes 2 lines 30 times. A legitimate CP player copying their own 15-line helper function is blocked. Both lose.

**Right fix:** Track what content has actually been typed in this session. If the pasted content has already appeared in the editor before, it's internal — allow it. If it's brand new content that never existed in the editor, it's external — flag it.

```js
// Track every line the player has ever typed in this session
const editorHistory = new Set();

editor.onDidChangeModelContent(() => {
  const lines = editor.getValue().split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.length > 4) {  // ignore blank lines, braces, semicolons
      editorHistory.add(trimmed);
    }
  });
});

editor.onDidPaste((e) => {
  const pastedText = editor.getModel().getValueInRange(e.range);
  const pastedLines = pastedText.split('\n').map(l => l.trim()).filter(l => l.length > 4);

  if (pastedLines.length === 0) return;  // tiny paste, ignore

  // How much of this paste was never seen in the editor before?
  const externalLines = pastedLines.filter(line => !editorHistory.has(line));
  const externalRatio = externalLines.length / pastedLines.length;

  if (pastedLines.length >= 5 && externalRatio >= 0.7) {
    // 70%+ of a 5+ line paste is content never typed here → external source
    socket.emit('anticheat:external_paste', {
      total_lines: pastedLines.length,
      external_lines: externalLines.length,
      external_ratio: Math.round(externalRatio * 100),
      match_time_elapsed_ms: Date.now() - matchStartTime,
    });
    showSubtleWarning('Large paste detected and logged.');
  }
});
```

**What this allows:**
- Copying your own 20-line function and moving it elsewhere → internal, allowed
- Duplicating a block you just wrote → internal, allowed
- Monaco built-in duplicate line (Shift+Alt+Down) → no paste event at all, always fine

**What this flags:**
- Pasting a full solution from ChatGPT → external, flagged
- Pasting a pre-written template from another file → external, flagged
- Pasting 2 lines 30 times from external source → each paste checked; if new content each time, each flagged

**What gets reviewed post-tournament (not live):**
Any player with `anticheat:external_paste` AND (solved in <3 min OR first submission AC). That combination is the real red flag. Either signal alone is noise.

**The cheater's dilemma:** If someone pastes a pre-written 60-line solution, it registers as ~95% external. If they try to type it character by character to avoid detection, fullscreen enforcement will catch their 15+ tab-switches to read the code. Both vectors covered.

---

#### Complete Anti-Cheat Stack (Phase 0)

| Layer | What it catches | Response |
|---|---|---|
| Fullscreen enforcement | Tab switching, alt+tab, opening other windows | Warning #1, Warning #2, Disqualify |
| Tab visibility API | Alt+tab even without fullscreen exit (some browsers) | Logged only, compounds with other signals |
| External paste detection (history-based, ≥5 lines, ≥70% new content) | Pre-written solution paste from ChatGPT/external file | Flagged for post-tournament review |
| Submission timing | First submit AC in <2 min on a medium problem | Flagged for review |
| 2-submission cap | Guess-and-check brute force | Hard cap enforces it structurally |
| Test Run = sample only | No signal from hidden cases without real submission | By design |
| Problem randomization (future) | Same problem in multiple rounds | Use problem pools per difficulty, shuffle per match |

#### What is NOT worth doing at Phase 0

| Idea | Why not |
|---|---|
| Disable copy-paste entirely | Destroys legitimate UX, alienates serious CP players |
| Webcam proctoring | Massive privacy concern, complex infra, overkill for ₹149 entry |
| AI code detection | False positive rate is high; GPT-generated code looks like human code |
| IP address matching (detecting teammates) | VPNs trivially bypass it; not worth the complexity |
| Keystroke timing analysis (Sentinel) | Phase 3 feature — requires ML, too complex for Phase 0 |
| Blocking all browser extensions | Can't enforce from a web app |

#### The honest truth about cheating at T#1

At 64 players and ₹149 entry, the prize pool ($60 equivalent) isn't worth sophisticated cheating. The players willing to cheat at this scale are usually casual, not elite. Fullscreen enforcement catches 80% of the lazy cheaters. The remaining 20% who paste pre-written solutions would have to have prepared those solutions before seeing the problem — which requires either leaking the problem (your problem) or preparing solutions for every possible CP problem (not realistic).

The meta-point: **AlgoClash's real anti-cheat is the 2-submission cap + time pressure**. Even with a pre-written solution you still have to adapt it to the exact problem. 30 minutes, 2 tries, opponent's cursor ticking toward the bottom of their screen. The pressure is the anti-cheat.

---

### Global Announcements + Tournament Feed (Phase 0)

Every connected client — players mid-match, spectators, people watching the bracket page — receives live announcements as the tournament progresses. Like CS:GO killfeed. Like battle royale match notifications. The tournament feels alive even to people not currently in a match.

#### First Blood

32 matches start simultaneously in round 1. The **first match to complete** — the first player anywhere to submit AC — triggers a global "FIRST BLOOD" announcement. Full-screen banner, 3 seconds, then fades. Every player in every other match sees it mid-fight.

```
╔══════════════════════════════════════════════════╗
║         🩸  FIRST BLOOD                          ║
║         shubham_b  eliminated  garvit_99         ║
║         Round of 64  |  Solved in  8:42          ║
╚══════════════════════════════════════════════════╝
```

Psychologically devastating to players still solving. Motivating to spectators. The person who gets First Blood earns a permanent profile achievement and a shareable card.

#### Every match completion → global broadcast

After First Blood, every subsequent match that concludes gets a smaller announcement — a toast notification on all clients, stacked in a feed column on the bracket page.

```
[killfeed style, top-right corner of screen]

  priya_iitb  →  codekaushik    Round of 64  |  11:09
  ankit_nit   →  rohan_99       Round of 64  |  14:52
  deepak_cp   →  siddharth_v    Round of 64  |  19:31
  ...
```

Non-intrusive during active match — a small toast that auto-dismisses in 4 seconds. On the bracket page: a live scrolling feed column.

#### Round milestone announcements

```
🏆  ROUND OF 32 COMPLETE
32 coders remain. Round of 16 begins in 5 minutes.
```

Semi-finals and finals get progressively larger banners. Grand final: full-screen countdown for all spectators.

#### Champion announcement

```
╔══════════════════════════════════════════════════╗
║   👑  ALGOCLASH T#1 CHAMPION                     ║
║                                                  ║
║          shubham_b                               ║
║          64 entered.  1 remains.                 ║
║          ELO: 1,401  (+201 this tournament)      ║
╚══════════════════════════════════════════════════╝
```

Shown to every connected client. Spectators, eliminated players, the bracket page. Everyone watching the bracket page who never paid sees this. FOMO for T#2.

#### Implementation

Server maintains a `broadcast` Socket.io room. Every client joins on connect. Match end → server checks if First Blood has fired this round → emits accordingly.

```js
// Server state per round
const roundState = new Map();  // round_number → { firstBloodFired: false }

async function onMatchEnd(matchId, winnerId) {
  const bracket = await getBracketByMatch(matchId);
  const round = bracket.round;

  if (!roundState.get(round)) roundState.set(round, { firstBloodFired: false });
  const state = roundState.get(round);

  const winner = await getProfile(winnerId);
  const loser = await getProfile(bracket.player_one === winnerId ? bracket.player_two : bracket.player_one);
  const solveTime = Date.now() - bracket.started_at;

  if (!state.firstBloodFired) {
    state.firstBloodFired = true;
    io.to('broadcast').emit('global:first_blood', {
      winner: winner.username,
      loser: loser.username,
      round_label: getRoundLabel(round),  // 'Round of 64', 'Round of 32', etc.
      solve_time_ms: solveTime,
    });
    await grantAchievement(winnerId, 'first_blood');
  } else {
    io.to('broadcast').emit('global:match_complete', {
      winner: winner.username,
      loser: loser.username,
      round_label: getRoundLabel(round),
      solve_time_ms: solveTime,
    });
  }

  // Check if entire round is now done
  const pendingInRound = await countPendingBrackets(bracket.tournament_id, round);
  if (pendingInRound === 0) {
    io.to('broadcast').emit('global:round_complete', {
      round_label: getRoundLabel(round),
      players_remaining: Math.pow(2, 6 - round),  // 64-player bracket
    });
  }

  // Proceed with auto-advance
  await advanceBracket(bracket, winnerId);
}
```

```js
// Client — join broadcast room on connect
socket.emit('broadcast:join');

socket.on('global:first_blood', (data) => showFirstBloodBanner(data));
socket.on('global:match_complete', (data) => addToKillfeed(data));
socket.on('global:round_complete', (data) => showRoundBanner(data));
socket.on('global:champion', (data) => showChampionBanner(data));
```

Add to Socket.io events table:
```
Server → Client (broadcast room):
  global:first_blood    { winner, loser, round_label, solve_time_ms }
  global:match_complete { winner, loser, round_label, solve_time_ms }
  global:round_complete { round_label, players_remaining }
  global:champion       { username, elo, elo_gained }

Client → Server:
  broadcast:join        { }   ← on connect, everyone joins
```

---

### Viral & Brag Features (Phase 0)

All computed from data already being collected. No new logging needed. Extra work is presentation layer only.

#### 1. Live Public Bracket Page

`algoclash.com/tournament/t1` — no login required. Reads `brackets` table via Supabase realtime. Auto-updates as matches complete. Anyone can share this link. Players send it to friends during the tournament: "Watch me live."

Includes: tournament feed column (killfeed), bracket tree, live match count, time remaining.

#### 2. Shareable Match Result Card

After every win, one button generates a downloadable image card. Goes to WhatsApp. This is the distribution channel.

```
┌──────────────────────────────────────────┐
│  ⚔  AlgoClash T#1  —  Round of 32       │
│                                          │
│  shubham_b  defeated  garvit_99          │
│  Solved in 14:32  |  First try           │
│  ELO: 1,218  (+18)                       │
│                                          │
│  algoclash.com                           │
└──────────────────────────────────────────┘
```

Library: `html2canvas` or `dom-to-image`. ~30 lines of code.

#### 3. Post-Tournament Stat Card (the certificate)

Auto-generated after elimination or on winning. Downloadable. People put this on LinkedIn. Same effort as hackathon certificate — and people treat it the same way.

Dynamic tagline computed from match data:

| Scenario | Tagline |
|---|---|
| Champion | "64 entered. 1 remains." |
| Top 4 | "Survived 5 matches. AlgoClash T#1." |
| Survived red screen to win | "Saw red. Didn't stop." |
| Won on second submission | "Two tries. No regrets." |
| Eliminated round 1 | "Showed up. Next time." |
| First Blood | "Opened AlgoClash T#1." |

Even eliminated players get a card worth sharing. "Showed up." beats nothing.

#### 4. Achievements (computed post-match, no extra logging)

Stored in `profiles.achievements jsonb`. Shown as badges on public profile.

| Achievement | Trigger | Notes |
|---|---|---|
| **First Blood** | First AC in the entire tournament | One per tournament |
| **Flawless** | AC on first submission, no WA | Per match |
| **Clutch** | Won while opponent had ≥80% hidden cases | "Survived the red screen" |
| **Speedrunner** | Fastest solve in their round | Per round |
| **Underdog** | Beat someone with 50+ higher ELO | Per match |
| **Last Stand** | Won with 1 submission remaining after a WA | Per match |
| **T#1 Founding Player** | Played in first ever tournament | Permanent, forever rare |

```sql
alter table profiles add column achievements jsonb default '[]';
-- shape: [{ id: 'clutch', match_id: '...', earned_at: '...' }, ...]
```

#### 5. Public Player Profile

`algoclash.com/u/shubham` — shareable. Shows ELO, rank, tournament history, achievement badges, win/loss. This is the LinkedIn-post target. "Here's my AlgoClash profile." Link in bio.

#### 6. Permanent ELO Leaderboard

`algoclash.com/leaderboard` — public. Updates live during tournament. Even #64 has a public rank. Their name is on the board. That's the hackathon participation equivalent.

#### 7. "T#1 Founding Player" Badge

Anyone who played T#1 gets this badge forever. If AlgoClash hits 50,000 users in 2 years, "T#1 Founding Player" marks them as someone who was there at the start. Scarcity compounds over time. The earlier you play, the rarer your badge. No other platform offers this. You can.

#### Build effort (all Phase 0)

| Feature | Effort |
|---|---|
| Global announcement system | 1 day (Socket.io broadcast + client toasts) |
| Live bracket page | 1 day (Supabase realtime query + bracket tree render) |
| Match result share card | 1 day (`html2canvas` + card template) |
| ELO leaderboard page | 0.5 day (`profiles.elo` already exists) |
| Public player profile | 1 day (profiles + matches join) |
| Achievement computation | 1 day (post-match queries on existing tables) |
| Stat card + download | 0.5 day (same as share card, different template) |
| Founding Player badge | 0.5 day (flag set on tournament end) |
| **Total** | **~6.5 days** |

---
- Load test with 5 friends simultaneously in matches
- Check for memory leaks (Socket.io rooms not being cleaned up)
- Verify Piston API handles concurrent calls (it will at small scale)
- Set up UptimeRobot (free) to ping Supabase every 5 min (prevents free tier pausing)
- Test on mobile (students will use phones)
- Verify 2-submission cap per problem works (including CE exemption and 3-sec cooldown)
- Verify unlimited "Test Run" against sample cases works (doesn't consume submissions)

---

### Week 5 — Tournament Day Infra Upgrade
Spin up a **DigitalOcean Bangalore 2GB droplet** ($12/month) running self-hosted Piston.  
Cost for 3 days: ~₹250.

Why: Public Piston API will rate-limit under tournament burst load (60+ simultaneous submissions). Self-hosted = no rate limit. Shut down the droplet after tournament. Back to free Piston for practice mode.

**Total Phase 0 cost: ₹450 (Piston droplet ₹250 + Socket.io droplet ₹200, both tournament-day only)**

---

# PHASE 1 — TOURNAMENT #1
> Timeline: Tournament day | Investment: ₹5,000 (prize pool)

## Tournament Format — The 1v1 Bracket

This is single elimination. Every match is 1v1. Ghost Cursors active in every match. The bracket is a directed graph — each node is a match, each edge is "winner advances to next node."

```
64 players enter
      ↓
Round 1:       32 simultaneous 1v1 matches  [Easy problems,       30 min]
      ↓ 32 winners
Round 2:       16 simultaneous 1v1 matches  [Medium problems,     35 min]
      ↓ 16 winners
Quarterfinals:  8 simultaneous 1v1 matches  [Medium-Hard,         40 min]
      ↓ 8 winners
Semifinals:     4 simultaneous 1v1 matches  [Hard problems,       45 min]
      ↓ 4 winners
Finals:         2 simultaneous 1v1 matches  [Hard problems,       45 min]
      ↓ 2 winners
Grand Final:    1 match                     [Hard problems,       45 min] ← STREAMED
      ↓
Champion
```

**Why difficulty escalates per round:**
- Round 1 Easy = anyone can enter. Low barrier to join.
- Finals Hard = only real CP players survive. Earned, not bought.
- Players don't know what difficulty is coming next. Like Squid Game — they know there's a next round, not what it is. That uncertainty between rounds is psychological pressure.
- Problems are sealed and revealed only when the match starts. Countdown timer visible to spectators.

**Round progression:** Staggered, not synchronized. Next-round match starts the moment BOTH parent matches finish. Players who win early don't wait for the full round — they get called up faster. This keeps momentum and reduces dropout.

**Timeout rule:** If neither player solves the problem in the time limit, tiebreaker hierarchy kicks in (see tiebreaker section). Match never ends in limbo.

---

## Spectator Mode — The Marketing Machine

Spectator mode is not a feature. It is your entire go-to-market mechanism.

A college coding club puts this on a projector at their tech fest. 300 students watch the Grand Final live. Every one of those 300 students is a future user. Zero ad spend.

**What spectators see:**

```
┌──────────────────────────┬──────────────────────────┐
│  PLAYER A                │  PLAYER B                │
│  [code editor — hidden]  │  [code editor — hidden]  │
│                          │                          │
│  Cursor: Line 47         │  Cursor: Line 23         │
│  ████████░░  8/10 cases  │  ██████░░░░  6/10 cases  │
│  Submissions: 3          │  Submissions: 5          │
└──────────────────────────┴──────────────────────────┘
         ↑ Red Screen pulses here when either hits 80%
```

**Code visibility decision (important):**
Do NOT show the actual code to spectators. Show cursor line number + test case progress only.

Reasons:
- In-person viewing: crowd shouts advice = cheating
- Hiding the code makes it MORE dramatic ("how are they solving it?")
- Players feel safer competing knowing their approach isn't exposed live

Option for later: show code with a 60-second delay (like trading exchanges). Adds drama without enabling cheating. Phase 3 feature.

**Club Organizer View (the projector panel):**

The coding club that hosts gets a special dashboard:

```
ROUND 2 — 16 matches active

[A vs B  ████░░] [C vs D  ██░░░░] [E vs F  ██████] [G vs H  ░░░░░░]
[I vs J  ████░░] [K vs L  ██░░░░] [M vs N  ██████] [O vs P  ░░░░░░]
...
Click any match → full spectator view, fullscreen
```

Like a PUBG kill feed but for code submissions. The organizer puts the Grand Final on the main screen. Earlier rounds on side screens or they let people choose which match to watch.

This is what makes a college club say yes to hosting an AlgoClash event. They get a ready-made, visually impressive event that makes them look good.

---

## The Setup

**Prize structure:**
```
🥇 1st — ₹3,000
🥈 2nd — ₹1,500  
🥉 3rd — ₹500
Total pool: ₹5,000 (your investment)
```

**Entry fee:** ₹149  
**Format:** Single elimination bracket. **64 slots hard cap** (power of 2, clean bracket, realistic for first tournament). Close registration when full. Overflow goes on waitlist for T#2.  
**Match length:** 30 minutes each (sweet spot — 45 min causes dropoff by semis, 15 min restricts to trivial problems).  
**Tournament duration:** 6 rounds × ~32 min (match + 2 min buffer) = **~3.2 hours total**.  
**Bracket rounds:** 64 → 32 → 16 → 8 → 4 → 2 → 1 (6 rounds, log₂(64) = 6).  
**Round progression:** Staggered — next-round match starts as soon as both parent matches finish. No waiting for full round to complete.  
**Submission cap:** 2 submissions maximum per problem (hard cap, not cooldown). CE does not consume an attempt. 3-sec cooldown between submits prevents UI spam. Unlimited "Test Run" against sample cases for debugging.  
**Languages:** C++, Java, Python with time multipliers (see Language Support section).

## Where to Promote (Zero Budget)

In order of effectiveness:

1. **CP club presidents directly** — WhatsApp DM. "Run this as your club event. I handle tech. Your 5 top members get free wildcard slots." They promote it for you.
2. **CP India Telegram groups** — search "competitive programming India". Post tournament details. Free.
3. **Codeforces blog post** — Write about AlgoClash. CP community reads everything there.
4. **Your personal LinkedIn** — Real post. "I built a 1v1 coding battle platform. First tournament. ₹5,000 prize pool. Link in comments." Tag 10 friends.
5. **Unstop listing** — Post for free to get reach. Collect payment separately via Razorpay link. Unstop gets you eyeballs, not your money.

**Do NOT spend money on ads for Tournament #1.** If you can't get 34 paying users organically, paid ads won't fix the problem — the pitch or product will need rethinking.

## Financial Scenarios (64-slot cap)

**Fixed costs regardless of entries:**
- Prize pool: ₹5,000 (your capital)
- Piston self-hosted droplet (tournament day): ₹250
- Socket.io droplet upgrade (tournament day, paid DO instead of Fly free): ₹200
- Razorpay fee: 2.36% of revenue

### Pessimistic (25 entries — below break-even)
```
Revenue:     25 × ₹149 =  ₹3,725
Prize pool:              - ₹5,000
Razorpay (2.36%):        -    ₹88
Piston droplet:          -   ₹250
Socket.io droplet:       -   ₹200
─────────────────────────────────
Net:                     -₹1,813   ← loss, acceptable as "paid marketing"
Your ₹5,000 back:          ₹3,187  ← most recovered
```
**What this means:** Weak reach, not a product problem. Run Tournament #2 in 3 weeks with sharper promo.

### Realistic (45 entries)
```
Revenue:     45 × ₹149 =  ₹6,705
Prize pool:              - ₹5,000
Razorpay:                -   ₹158
Piston droplet:          -   ₹250
Socket.io droplet:       -   ₹200
─────────────────────────────────
Net:                     + ₹1,097
```
**What this means:** Break-even plus. Capital recovered. T#2 funded from revenue.

### Boom (64 entries — full house)
```
Revenue:     64 × ₹149 =  ₹9,536
Prize pool:              - ₹5,000
Razorpay:                -   ₹225
Piston droplet:          -   ₹250
Socket.io droplet:       -   ₹200
─────────────────────────────────
Net:                     + ₹3,861
```
**What this means:** Full tournament. Capital back + ₹3.8K profit + waitlist for T#2 already exists. Post the screenshots. Sell-out is the story.

**Why Socket.io droplet is non-negotiable on tournament day:** Fly.io free tier has 256MB RAM. 64 players × ~2 connections each (match + bracket viewer) = 128 concurrent socket connections. OOM kill happens around 150. You will lose the finals. Pay the ₹200.

## If Things Break on Tournament Day

**This is okay. Actually good.**

Screenshot the error. Screenshot the traffic. Note peak concurrent users. Post on LinkedIn:

> "AlgoClash Tournament #1 — 180 concurrent users. Our free-tier server melted at 160. We're fixing the infra. Tournament #2 in 3 weeks on proper servers."

This is proof of demand. Investors know the difference between "product broke because nobody wants it" and "product broke because too many people showed up." The second one is fundable.

---

# PHASE 2 — TRACTION ENGINE
> Timeline: Month 2–4 | Target: 200–500 active users

## Infra Upgrade (Fund with Tournament #1 profit)

Monthly cost: ~₹12,700/month

| Service | Cost |
|---|---|
| Supabase Pro | $25 = ₹2,075 |
| DigitalOcean Bangalore 4vCPU/8GB (Socket.io) | $48 = ₹3,984 |
| Judge0 API — RapidAPI Pro | $50 = ₹4,150 |
| Upstash Redis (matchmaking queue) | $10 = ₹830 |
| Resend (email — college .edu verify) | $20 = ₹1,660 |
| **Total** | **~₹12,700/month** |

No more free tiers. Real infra. Can handle 500 concurrent users now.

## What to Build in Phase 2

**Priority order:**

> **Note:** Ghost Cursor, Red Screen Alert, Opponent Submission Alerts, Live Progress Bar, Presence/Typing indicators, Victory/Defeat moments — **all moved to Phase 0**. These are no longer Phase 2 features. They ship with T#1 because the psychological presence of the opponent IS the product. See "The Arena Feel" section in Week 2.

Phase 2 focuses on what you build AFTER the arena feel is proven:

1. **Permanent ranked mode** — Not just tournaments. Players can queue anytime and get matched. This creates daily active users, not just tournament-day spikes.

2. **Dashboard wired up** — Real ELO, real match history, real win/loss. Players need to see their progress or they won't come back.

3. **Post-match replay** — Step through both players' submissions in chronological order. Show when Ghost Cursor lines jumped. Show the exact moment opponent hit 80% and your screen went red. Shareable clips.

4. **Daily Puzzle Rush** — 3-minute solo warm-up problem. Mobile-friendly. Keeps users coming back on days they can't commit to a full match.

5. **College leaderboard** — Username suffix `.iitb`, `.nit`, etc. or .edu email verification. Show top colleges by aggregate ELO. Institutional pride = viral sharing within colleges.

6. **Spectator mode (basic)** — Friends can watch ongoing matches with a 30-second delay (anti-cheat). See both editors side-by-side. This becomes the Caster Dashboard in Phase 3.

7. **Wildcard / Lucky Loser slot** — Handles odd registration counts without byes or refunds. If registration fills to an odd number (e.g. 65), the last registrant becomes the "Wildcard" and sits in spectator for round 1. After round 1 ends, the best loser (highest hidden_cases_passed → earliest timestamp tiebreak) gets one extra match against the Wildcard. Winner enters round 2 bracket. One Wildcard slot per tournament max — keeps bracket logic clean. Phase 0 stays power-of-2 hard cap only; this unlocks in Phase 2 once bracket engine is proven stable.

## Tournament Cadence — Bi-Weekly, Not Weekly

**Why not weekly:** Same 50-100 people can't pay ₹149 every week. ₹596/month entry fees causes fatigue and dropout by week 3. Also: weekly = no time to fix bugs or write new problems between events.

**Why not monthly:** 12 shots per year vs 26. Too slow to build momentum and compound revenue.

**The model: bi-weekly Grand Clash + always-on ranked mode**

```
Week 1:  Grand Clash tournament (paid entry)   ← revenue event
Week 2:  Free ranked mode only                 ← product improvement + problem writing
Week 3:  Grand Clash tournament (paid entry)   ← revenue event
Week 4:  Free ranked mode only                 ← bug fixing + promo for next event
```

Ranked mode keeps users on the platform every day. Tournament gives them something to train for.

**Pricing rotation (prevents fatigue, creates event hierarchy):**

| Tournament Type | Entry | Prize Pool | Frequency |
|---|---|---|---|
| Mini Clash | ₹49 | ₹1,000 | Occasional — low barrier, high volume |
| Grand Clash | ₹149 | ₹5,000–₹10,000 | Bi-weekly — main event |
| Mega Clash | ₹249 | ₹20,000+ | Monthly — special occasion, streamed |

The ₹49 Mini Clash is your funnel. Students who won't pay ₹149 for an unknown platform will pay ₹49. Once they play one match, feel the Ghost Cursor, survive the Red Screen — they pay ₹149 next time.

**Problem pool requirement for bi-weekly cadence:**
- Each tournament uses 6 unique problems (one per round, difficulty-matched)
- Bi-weekly = 12 problems per month consumed
- Need 30+ problems before starting. Build the Blitz Parser (Gemini Flash converts LeetCode problems to Blitz format) early — it gives you 5,000+ problems on demand. 2 weeks of work, saves you forever.

Tournament #2: ₹7,500 prize pool (₹149 entry, max 128 slots)
Tournament #3: ₹10,000 prize pool (₹199 entry, max 128 slots)

Each tournament funds the next. Prize pool grows as trust grows.

## Introduce Subscription (Month 3)

Once you have 200+ users who've played at least 3 matches, introduce:

```
Free Tier:
- 5 ranked matches per day
- Basic stats

Pro Tier — ₹199/month:
- Unlimited matches
- Post-match analysis
- Early tournament registration
- Profile badge
```

**Target:** 10% conversion. 200 active users → 20 paid → ₹3,980/month recurring.

That's not a lot. But it's proof the subscription model works. Each tournament + growing subscriber base compounds.

## Revenue at End of Phase 2

```
Monthly subscriptions (50 users × ₹199):  ₹9,950
Tournament #3 profit (estimated):          ₹15,000
─────────────────────────────────────────────────
Monthly total:                             ~₹25,000
Infra cost:                               -₹12,700
─────────────────────────────────────────────────
Monthly profit:                            ~₹12,300
```

---

# PHASE 3 — PLATFORM
> Timeline: Month 4–8 | Target: 500–2,000 users | Register company

## Company Registration

By Phase 3 you need:
- **Sole Proprietorship** — simplest, no CA needed, register with MSME portal. Free.
- **Bank account in company name** — for Razorpay, GST, invoicing
- **GST registration** — mandatory once revenue crosses ₹20L/year. Optional before.

This unlocks: proper Razorpay integration (auto-payment verification), Unstop paid events, college institutional contracts, white-label deals.

## What to Build in Phase 3

1. **Guilds / Houses** — College clubs create a guild. Internal leaderboard. Private practice rooms. Colleges compete against each other. This is the viral loop — institutional pride spreads through WhatsApp groups without you doing anything.

2. **Architect Mode (Visual Logic)** — The no-code flowchart battle mode from the pitch deck. Players connect logic nodes instead of typing code. This is the feature that gets streamed. Work with a drag-and-drop library (React Flow). This differentiates you from everything else.

3. **Caster Dashboard + Spectator Mode** — Full spectator view (designed in Phase 1 section). Two panels side by side: cursor line + test case progress bars. Code hidden by default. Red Screen fires for spectators too. Club organizer view shows all active matches simultaneously. Any match set to "public" = streamable on Twitch/YouTube. Phase 3.5: add 60-second code reveal delay for extra drama without enabling cheating.

4. **The Sentinel (Anti-cheat)** — Keystroke fingerprinting. If a user pastes a large block of code (no incremental typing before it), flag it. If submission timing is suspiciously fast for problem difficulty, flag it. Not perfect — just good enough to deter casual cheating.

5. **Self-host Judge0** — Replace Judge0 API with self-hosted Judge0 on DigitalOcean. Saves $50/month, handles more load, no rate limits.

## Infra at Phase 3

Monthly cost: ~₹19,700

| Service | Cost |
|---|---|
| Supabase Pro | $25 = ₹2,075 |
| DO 8vCPU/16GB — Judge0 self-hosted | $96 = ₹7,968 |
| DO 4vCPU/8GB — Socket.io server | $48 = ₹3,984 |
| DO Load Balancer | $12 = ₹996 |
| Upstash Redis | $10 = ₹830 |
| Resend | $20 = ₹1,660 |
| Sentry (error tracking) | $26 = ₹2,158 |
| **Total** | **~₹19,671/month** |

Handles 500 concurrent users comfortably. Nothing breaks.

## Revenue at End of Phase 3

```
Subscriptions (150 × ₹199):     ₹29,850/month
Tournaments (2/month, avg ₹20k): ₹40,000/month
White-label events (1/month):    ₹10,000/month
─────────────────────────────────────────────
Gross revenue:                   ₹79,850/month
Infra:                          -₹19,700/month
─────────────────────────────────────────────
Monthly profit:                  ~₹60,000/month
ARR (annualized):                ~₹7,20,000 (~$8,600)
```

This is when you have a real story for pre-seed investors.

---

# PHASE 4 — SEED ROUND
> Timeline: Month 8–14 | Target: 2,000–10,000 users | Raise: $300K–$500K

## What Investors Need to See

You need ALL of these before approaching:

| Metric | Target |
|---|---|
| Monthly Active Users | 2,000+ |
| Paid subscribers | 200+ |
| MRR (Monthly Recurring Revenue) | $2,000+ (~₹1,67,000) |
| Tournament history | 8+ successful events |
| Retention (D30) | 30%+ of users still active after 30 days |
| College partnerships | 10+ colleges officially using the platform |

## Who to Approach in India

**In order of accessibility:**

1. **100X.VC** — India-focused, invests ₹25L for 5% equity. Application-based. No warm intro needed. This is the most realistic first institutional money.

2. **Antler India** — Startup builder program. They co-found with you, give stipend + investment. Apply with working product.

3. **Angel investors on LinkedIn** — Indian angels who've invested in EdTech or Gaming. Look for investors in Unacademy, Chess.com, Codeforces-adjacent products.

4. **IIT/NIT alumni networks** — Your target users' colleges have strong alumni VC networks. An IIT alumnus who uses AlgoClash is your warm intro.

## The Fundraise Pitch (One Paragraph)

> "AlgoClash is the Chess.com of competitive programming — a 1v1 eSports arena for developers. In 8 months we've run 10 tournaments, built 2,200 active users across 40+ colleges, generating ₹1.8L/month with 35% D30 retention. The $4.2B EdTech market in India has no product at the intersection of CP and eSports. We're raising $400K to scale the matchmaking infrastructure, launch Architect Mode, and begin college institutional partnerships."

## What $400K Gets You

```
12 months of infra (scaled):       $30,000
One senior backend engineer:       $24,000
One designer:                      $12,000
Marketing / college partnerships:  $40,000
Legal / company ops:               $10,000
Buffer:                            $84,000
────────────────────────────────────────
Total:                            $200,000 (raise $400K, spend $200K in Y1)
```

## Infra at Phase 4 (What $400K Enables)

Monthly: ~$3,000 (~₹2,50,000)

- Multiple Socket.io instances behind load balancer (sticky sessions via Redis)
- Judge0 cluster (3-4 worker nodes) — handles 2,000 concurrent submissions
- Supabase Team plan or migrate to self-hosted Postgres on AWS
- AWS Mumbai for critical services (reliability > cost at this stage)
- Cloudflare WAF (protection against DDoS, bot abuse)
- Full Sentry + Datadog monitoring

Handles 10,000 concurrent users. Nothing breaks.

---

# PHASE 5 — THE BELT: INDIA TO JAPAN
> Timeline: Month 14–36 | Target: 200,000 users across 12+ countries | Raise: Series A → B

## The Real Vision

AlgoClash is not a coding tool. It is not an interview prep site. It is not a hackathon platform.

**AlgoClash is the FIFA World Cup of competitive programming.**

Chess.com built a global chess community so strong that entire countries have fan bases, national champions, and daily players who never played chess before they found the platform. That happened because Chess.com made chess feel like a sport, not a board game.

Competitive programming already IS a sport in Asia. It just has no arena worth fighting in. No national pride. No country representatives. No daily battles. No moment where Vietnam fights India and thousands watch.

That is what AlgoClash builds. Country by country. Community by community. Until every CS student in Asia knows their national ranking and has someone to fight.

---

## The Core Four: India → Vietnam, Korea, Japan, Singapore

Skip the noise. Focus on markets with real CP density, economic power, and zero dominant platform. These four capture 80% of Asian CP talent and 95% of spending power.

| Country | Why | CP Community Size | Entry Strategy |
|---|---|---|---|
| 🇮🇳 India | Starting point. 1.4B population, IIT/NIT culture, CodeChef built here. | ~500K active | Phase 0 — T#1, prove it works |
| 🇻🇳 Vietnam | IOI/ICPC superpowers. One of strongest CP cultures globally. 100M young population. | ~200K active | Phase 4 — Codeforces blog post, instant traction |
| 🇰🇷 South Korea | BOJ has millions. Gaming culture + CP = perfect alignment. Wealth. | ~300K active | Phase 5 — BOJ community post, Korean gaming cafés want to stream this |
| 🇯🇵 Japan | AtCoder: 500K users, prize money events normalized, organized market. | ~500K active | Phase 5 — AtCoder blog, Fukuoka Visa |
| 🇸🇬 Singapore | High-value, English, well-funded students, regional hub. Regional tournaments. | ~20K active | Phase 4 — regional hub for SE Asia tournaments |

**Why these four:**
- Vietnam: IOI/ICPC dominance means top talent already exists and trained. Zero friction to switch.
- Korea: Gaming culture makes eSports platforms a known commodity. BOJ's millions are ready.
- Japan: AtCoder proved the Japanese market pays for CP tournaments. Fukuoka Visa is the endgame.
- Singapore: Small but wealthy. Serves as the regional tournament hub for SE Asia (can market to Malaysia, Indonesia, Thailand from Singapore).

**Why not the rest:** Bangladesh, Sri Lanka, Nepal, Indonesia, Philippines, Thailand — they will come naturally once the platform is proven in the core four. Don't scatter capital. Go deep in four, the rest follows.

---

## What "Country Representatives" Means

Every country gets:

**1. National Leaderboard** — top ELO players in each country ranked publicly. `algoclash.com/countries/india`. Updated live. The #1 ranked Indian player carries a crown badge. Defended weekly.

**2. National Champion Title** — top ELO player per country at the end of each month = "National Champion [Month]." Permanent badge on profile forever. "India National Champion — May 2027." This is a LinkedIn headline. This goes in CVs.

**3. Country Flag on Profile** — set on signup, verified by IP + university email. Small flag next to username everywhere on the platform. In match rooms. In killfeed. In bracket trees.

**4. Country vs Country Stats** — win rate when Indian players fight Vietnamese players. Public. Tracked. Argued about in community forums. National pride is the viral engine.

**5. Continental Clashes (Phase 5)** — South Asia vs Southeast Asia vs East Asia. Bracket of national champions. Streamed. This is the event that gets on Twitch.

---

## Tournament Cadence at Scale

This is the endgame cadence. Not Day 1. Reached by Phase 5.

```
Daily:    Quick Clash  — 16 players, 15-min problems, ₹49 entry, ₹500 prize pool
          Free tier    — unlimited ranked 1v1, no prize, ELO only

Weekly:   Regional Clash — 64 players per region (South Asia / SE Asia / East Asia)
                           ₹149–$3 entry (local currency), $100 prize pool per region
                           Winners advance to Monthly Grand Clash

Monthly:  Grand Clash    — 128 players, global open, ₹199–$5 entry
                           $500 prize pool. National flags on bracket. Streamed.

Quarterly: Continental Championship — top 32 players per continent
                                       Invitation only (earned via Monthly rank)
                                       $2,000 prize pool. Caster Dashboard live.
                                       This is the event that gets tweeted globally.

Annual:   AlgoClash World Cup — top 64 players globally, one per country capped
                                  Invitation + qualification. $10,000 prize pool.
                                  Streamed on Twitch/YouTube. Sponsors pay for this.
```

Daily activity = retention. Weekly = habit. Monthly = event. Quarterly = season. Annual = religion.

---

## Expansion Playbook (Core Four Markets)

**Vietnam (Phase 4):**
1. Post on Codeforces blog: "I built AlgoClash 1v1 arena. Here's how it works." Link to T#1 results, Ghost Cursor demo, Red Screen video.
2. Vietnamese Codeforces community reads everything. Instant organic traffic.
3. Launch Vietnam-specific tournament: $50 prize pool, VND pricing. Run it within 2 weeks of blog post.
4. Codeforces Vietnam Discord + VNOJ Telegram will amplify. Zero paid ads.

**South Korea (Phase 5):**
1. Post on Baekjoon Online Judge (BOJ) community forums about AlgoClash's 1v1 format.
2. Korean gaming culture = instant interest. Gaming cafés want to host tournaments. Partner with one.
3. Launch Korea-specific tournament with KRW pricing. $100 prize pool.
4. BOJ users bridge to AlgoClash in droves. Gaming cafés become marketing distribution.

**Japan (Phase 5):**
1. Fukuoka Startup Visa application + AtCoder blog post (same timing).
2. Write about Ghost Cursor, Red Screen, roulette reveal — genuinely novel to them.
3. AtCoder has 500K users. Even 0.1% = 500 Japanese signups.
4. Japanese tournament on JPY pricing. $100 prize pool. Organized from Fukuoka.

**Singapore (Phase 4, run parallel to Vietnam):**
1. DM NUS/NTU CS club presidents directly: "Sponsor a regional SE Asia tournament."
2. Singapore is the hub. Market it to Malaysia, Indonesia, Thailand, Philippines from Singapore.
3. English content works for all of SE Asia. SGD pricing attracts; other countries see it as aspirational.
4. One tournament seeds all of SE Asia at once.

Cost per market activation: $50–100 prize pool + DM + 1 blog post. Zero ad spend. Platform reputation is the acquisition channel.

---

## Pricing: Core Four Markets

All sub-$4 entry. Prize pools denominated in USD for transparency. Local currency pricing removes friction. This is the structural advantage over any US-based competitor.

| Country | Quick Clash | Weekly Clash | Monthly Grand | Monthly Sub |
|---|---|---|---|---|
| India | ₹49 (~$0.60) | ₹149 (~$1.78) | ₹199 (~$2.38) | ₹199/mo |
| Vietnam | ₫15,000 (~$0.60) | ₫45,000 (~$1.80) | ₫60,000 (~$2.40) | ₫49,000/mo |
| South Korea | ₩900 (~$0.67) | ₩2,500 (~$1.85) | ₩3,500 (~$2.60) | ₩2,900/mo |
| Japan | ¥90 (~$0.60) | ¥280 (~$1.90) | ¥380 (~$2.56) | ¥380/mo |
| Singapore | S$1.00 (~$0.74) | S$3.50 (~$2.59) | S$5.00 (~$3.70) | S$5.99/mo |

Prize pools always in USD: a $500 quarterly pool = ₩680,000 to a Korean player = feels large and real. The arbitrage between local pricing and USD-denominated prizes is the revenue moat.

---

## Japan: Specific Steps (Unchanged, Still the Endgame)

**Step 1:** Codeforces blog post after T#1 results. AtCoder community reads Codeforces. Ghost Cursor + Red Screen is genuinely novel to them. One post = 500+ Japanese signups.

**Step 2:** Apply for Fukuoka Startup Visa once revenue crosses ₹1L/month.
- Requirements: viable running business, business plan, certified startup support recommendation
- 6-month visa, renewable. English support exists.
- Apply: startup.fukuoka.jp

**Step 3:** Localize for Japan.
- Japanese UI: one translator, not a team
- Problem set: AtCoder problems are publicly licensed
- Payment: Stripe Japan
- Partner with one Japanese university CS club — same playbook as India

**Step 4:** Japanese strategic investors.
- DeNA, CyberAgent, GREE — Japanese gaming companies that invest in eSports
- AtCoder Inc. — potential acqui-hire or deep partnership target
- B Dash Ventures after Japan traction

---

## South Korea: The Hidden Multiplier

Most blueprints skip Korea. Wrong. Korea may be bigger than Japan for AlgoClash.

- BOJ (Baekjoon Online Judge): millions of Korean CP users. No 1v1 battle mode.
- Korean gaming culture: entire country already watches eSports, already pays for competitive platforms, already has gaming cafés where tournaments run.
- Korean students compete globally on Codeforces but have no dedicated Korean platform.
- "Korea vs Japan" on AlgoClash's bracket = content that writes itself.

Entry point: post on BOJ community board. One Korean university CS club partnership. The rest compounds.

---

## The Series A Pitch at Phase 5

> "AlgoClash is the competitive programming arena for Asia. In 18 months we've run 20+ tournaments across 8 countries, built 50,000 active users from India to Vietnam to South Korea, and generated $15,000/month MRR. No platform has ever unified Asia's CP community. We're raising $2M to build the infrastructure for daily regional tournaments, country leaderboards, and the first AlgoClash World Cup — 64 national champions, $10,000 prize pool, streamed globally."

That is a fundable story. That is a story investors in gaming, edtech, and eSports all understand.

---

## Revenue at Phase 5 (Core Four Markets: India, Vietnam, Korea, Japan, Singapore)

```
Subscriptions (5,000 × avg $2.50/mo):     $12,500/month
Daily Quick Clashes (revenue share):        $3,000/month
Weekly Regional Clashes:                    $4,000/month
Monthly Grand Clashes:                      $5,000/month
Corporate white-label (hiring events):      $8,000/month
Sponsor logos on Continental Championship:  $5,000/quarter → $1,667/month
──────────────────────────────────────────────────────────
MRR:                                        ~$34,000/month (~₹28L/month)
ARR:                                        ~$408,000
```

Series A territory at $3M–5M raise, $15M–25M valuation.
Series B after World Cup Year 1: $10M–15M raise.

---

## The North Star (Updated)

> Chess.com has 100 million users because chess has national champions, daily games, and a community that argues about rankings. Competitive programming is harder than chess and has a larger student base in Asia. AlgoClash gives it the arena it deserves.

Every CS student in India to Japan should know their national rank on AlgoClash. Every college should have a club that trains for the Regional Clash. Every country should have a champion worth watching. That is the company.

---

# COMPETITOR LANDSCAPE
> Last researched: April 2026. Re-check every 3 months.

## What "Code Strike 2026" and similar Unstop events are

College events hosted on Unstop by individual colleges. Zero threat as products. They run once, generate a leaderboard, disappear. There are dozens of "Code Clash / Code Strike / Code Duel" events every semester. They compete for the same student attention but don't build a platform or community. If anything, they warm up the market — students who competed in a college coding event are primed to pay for a real persistent platform.

---

## Tier 1 — Direct Product Competitors (track monthly)

### [Codeforces CF-Blitz](https://codeforces.com/blog/entry/151678) — Biggest threat
Official Codeforces 1v1 mode. Already has Blitz Cup 2025 and Blitz Cup 2026 tournaments running with live streams. Millions of existing Codeforces users. Zero friction to try it.

**Their mechanic:** 40-minute match, shared problem queue, only ONE player can attempt a problem at a time (first to start it locks it for the other). Different from AlgoClash's "same problem, race" format.

**Why AlgoClash still wins:** CF-Blitz feels like Codeforces — academic, dry, no psychological UI. No Ghost Cursor, no Red Screen, no roulette reveal, no killfeed, no prize money, no shareable cards. Their users are already on Codeforces. AlgoClash targets students who find Codeforces intimidating but want the competitive feeling. Different emotional contract.

**What to watch:** If CF-Blitz adds prize pools, psychological UI, or India-specific tournaments — that's the signal to accelerate college partnerships aggressively.

---

### [CodeArena](https://codearena.co) — Closest feature match
Real-time 1v1, ELO, 9 languages, AI coaching, anti-cheat (tab switch + paste detection). Actively developed.

**Their pitch:** "Get better at coding interviews." Recruitment angle.
**AlgoClash's pitch:** "Fight someone in real time." eSports angle.

Different emotional hook. Same mechanic, completely different positioning. Their user pays to improve their resume. AlgoClash's user pays for the thrill of the duel.

**Gap:** No Ghost Cursor, no Red Screen, no tournament bracket, no prize money, no India pricing. No shareable moments. No founding player badge.

---

### [AlgoArena](https://algoarena.net) — Most feature-complete
1v1 battles, 10,000+ problems, 16 languages, AI voice interviewer, classroom mode, free tier.

**Threat:** Their problem library is massive. Students comparing platforms will notice. AlgoClash launches with 15 seeded problems — this is the most visible gap.

**Response:** AlgoClash's 15 problems are Blitz-format (no Alice/Bob stories, pure objectives) and specifically designed for tournament rounds with escalating difficulty. Quality over quantity. Add 5 problems per week post-T#1.

**Gap:** No tournament bracket, no prize money, no psychological pressure, no eSports feel, no India pricing.

---

### [CodinGame Clash of Code](https://www.codingame.com/multiplayer/clashofcode) — Oldest, largest
500,000+ registered users. Multiple modes (fastest, reverse, shortest). Up to 8 players.

**Why they're not a real threat:** 5-minute mini-games, not 30-minute duels. Different intent entirely. Their users want casual fun on a lunch break. AlgoClash users want a bracket tournament with prize money. Same sport, completely different format — like comparing a pickup basketball game to an NBA match.

**Opportunity:** Clash of Code users are already addicted to competitive coding. They're your easiest conversion. Post on CodinGame forums about AlgoClash T#1.

---

## Tier 2 — Simpler Tools (steal users from these, don't fear them)

| Platform | What it is | Their gap | Your move |
|---|---|---|---|
| [CPDuels](https://www.cpduels.com/) | Codeforces problems, 1v1 matchmaking, free | Side-project quality, no UI, no prize | Target their Codeforces community posts |
| [LeetBattle](https://chromewebstore.google.com/detail/leetbattle/kidgeaockeleejmeogfcaodagaigllkp) | Chrome extension for LeetCode 1v1 | Bolted onto LeetCode UI, no tournament, no prize | Post in their HN thread and Chrome Store reviews |
| [CF Battleground](https://cfbattleground.live/) | Free private rooms, Codeforces problems | Side project, no traction | No action needed |
| [SkillVersus](https://www.skillversus.xyz/) | Real-time 1v1 duels | Minimal web presence, no evidence of traction | Monitor only |

---

## The Moat — What Nobody Has

| Feature | CF-Blitz | CodeArena | AlgoArena | CodinGame | AlgoClash |
|---|---|---|---|---|---|
| Ghost Cursor (opponent line) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Red Screen (80% threshold) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Matchmaking roulette reveal | ❌ | ❌ | ❌ | ❌ | ✅ |
| Global killfeed + First Blood | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tournament bracket + prize money | ❌ | ❌ | ❌ | ❌ | ✅ |
| India-first pricing (₹149) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Shareable match result card | ❌ | ❌ | ❌ | ❌ | ✅ |
| Founding Player badge | ❌ | ❌ | ❌ | ❌ | ✅ |
| 2-submission cap (raises stakes) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Post-match analysis paywall | ❌ | ❌ | ❌ | ❌ | ✅ |
| Wildcard / Lucky Loser (Phase 2) | ❌ | ❌ | ❌ | ❌ | ✅ |

The coding part is not the moat. Everyone has the coding part. The psychological experience is the moat. Build the features nobody else has shipped, ship them by T#1, and make sure every player screenshots them and sends them to WhatsApp.

---

## Competitive Strategy by Phase

**Phase 0–1:** Don't announce AlgoClash in spaces where CF-Blitz or CodeArena already dominate. Go to spaces they haven't reached — college WhatsApp groups, CP club presidents, Telegram groups for Indian students. First-mover in India's college CP community is the beachhead.

**Phase 2:** When you have T#1 results and a player count, post a Codeforces blog entry. The CP community reads everything there. "I built a 1v1 arena with Ghost Cursors and prize money. Here's how T#1 went." This is how you pull CF-Blitz users.

**Phase 3:** If CF-Blitz adds prize pools → respond by doubling down on college institutional partnerships (guilds, team leaderboards). Community depth is the only moat that a large platform can't buy quickly.

**The line to remember:** CF-Blitz is Chess.com's puzzle mode. AlgoClash is Chess.com's live arena. Same game. Completely different experience.

---

# RISK SCENARIOS

## If Tournament #1 Gets < 25 Entries

**Diagnosis options (in order of likelihood):**
1. Prize pool not compelling enough → increase to ₹8,000 for Tournament #2
2. Wrong audience reached → go deeper into CP-specific channels (not generic college pages)
3. Platform looks unpolished → spend 1 week on UI before Tournament #2
4. Timing was off → avoid exam season (Jan, Apr-May, Oct-Nov)

**Action:** Don't panic. Run Tournament #2 within 6 weeks. Iterate on ONE variable at a time.

## If Platform Breaks at 100+ Users

**What will break first (in order):**
1. Fly.io free Socket.io server (256MB RAM) — OOM kill at ~150 connections
2. Public Piston API rate limiting — submissions start failing after ~30/minute burst
3. Supabase free tier connection limit — 20 direct connections max

**Fix order:**
1. Upgrade Socket.io to paid DO droplet ($24/month) — immediate fix
2. Tournament day: always use self-hosted Piston (₹250 droplet) — pre-planned
3. Upgrade Supabase to Pro ($25/month) — enables PgBouncer connection pooling

**The investor angle:** Screenshot the traffic spike. Screenshot the error. Post it publicly. "We had 140 concurrent users and our server melted. Here's the evidence." This is proof of demand. This is fundable.

## If a Competitor Launches

Realistic competitors in this space:
- **Codeforces** won't build this — they're academic, not eSport
- **LeetCode** won't build this — they're recruitment-focused
- **Indian startup** copies the idea — your moat is community and first-mover trust

If a well-funded competitor appears: focus on India depth (college partnerships, institutional leaderboards) before going wide. You can't be beaten on local community if you're already there.

## If Piston API Goes Down

Backup plan (2-hour migration):
- Sphere Engine API — free tier exists
- Self-host Piston on DO immediately (₹250/day, you already know how)
- Judge0 RapidAPI free tier as temporary fallback (50 calls/day — enough for a quick patch)

Always have your self-hosted Piston setup documented and ready to deploy in 30 minutes.

---

# COMPLETE FINANCIAL SUMMARY

## The Journey

| Phase | Monthly Infra | Monthly Revenue | Monthly Profit | Cumulative Users |
|---|---|---|---|---|
| Phase 0 (build) | ₹0 | ₹0 | ₹0 | 0 |
| Phase 1 (T#1) | ₹450 one-time | ₹3.7K–₹9.5K one-time | -₹1.8K to +₹3.8K | 25–64 |
| Phase 2 (traction) | ₹12,700 | ₹25,000 | ₹12,300 | 200–500 |
| Phase 3 (platform) | ₹19,700 | ₹79,850 | ₹60,000 | 500–2,000 |
| Phase 4 (seed) | ₹2,50,000 | ₹5,00,000+ | ₹2,50,000+ | 2,000–10,000 |
| Phase 5 (global) | ₹5,00,000 | ₹7,29,000+ | ₹2,00,000+ | 10,000–50,000 |

## Your ₹5,000

| Use | Amount |
|---|---|
| Prize pool (Tournament #1, your investment) | ₹5,000 |
| Infra (Phase 0 — tournament-day droplets) | ₹450 (Piston ₹250 + Socket.io ₹200; recoverable from entries if T#1 ≥ 37) |
| Marketing | ₹0 |
| Everything else | Free tiers |

**You do not need more than ₹5,000 to launch.** Everything after that is self-funded from tournament revenue.

---

# THE ONE-PAGE VERSION

```
Right now:     Build judge + match room + 1v1 bracket engine (4 weeks, ₹0)
               30 problems seeded. Ghost Cursor basic. Red Screen wired.
Month 1:       Tournament #1. 64-slot 1v1 bracket. ₹5,000 fixed prize pool.
               Difficulty escalates per round. Grand Final streamed if possible.
Month 2:       Fix what broke. Mini Clash ₹49 (funnel). Grand Clash #2 ₹149.
               Upgrade infra from T#1 profit. Bi-weekly cadence locked in.
Month 3:       Introduce ₹199/month subscription. Target 20 paid users.
               Start building Blitz Parser (Gemini Flash → problem pipeline).
Month 4–6:     Spectator mode + Club Organizer view. Guilds. College leaderboard.
               Daily Puzzle Rush. Approach one college tech-fest for partnership.
Month 6–8:     500 active users. 100 subscribers. ₹60K/month profit.
               Mega Clash ₹249 with ₹20K prize pool. Stream it on YouTube.
Month 8–12:    Approach 100X.VC / Antler with real numbers.
Month 12–18:   Raise $300K–500K. Hire 1 engineer. Scale to 10K users.
               Architect Mode (visual logic nodes). Sentinel anti-cheat.
Month 18–24:   Vietnam activated. Codeforces blog post = organic flood from VN CP community.
               Singapore launched as SE Asia regional hub.
               Weekly Regional Clashes: India vs Vietnam vs Korea (simulcast).
               AtCoder blog post. Fukuoka Startup Visa application.
Month 24–30:   South Korea (BOJ post) + Japan (AtCoder + Visa grant).
               Daily Quick Clashes across all five markets. Country flags live.
               National leaderboards per country. Monthly National Champion badges.
Year 3:        Quarterly Asia Championship (India vs Vietnam vs Korea vs Japan).
               Streamed on Twitch. Sponsored. $1,000+ prize pools.
               Series A: $2M–5M. "Chess.com for CP, Asia's got it."
Year 3+:       AlgoClash World Cup. 4 national champions (India, Vietnam, Korea, Japan).
               $5,000 prize pool. Every CS student in these markets knows AlgoClash.
```

---

*Last updated: April 2026. Built from scratch on ₹5,000 and a clear head.*
