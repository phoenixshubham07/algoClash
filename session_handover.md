# Session Handover & deployment Playbook: AlgoClash

This document outlines the current state of the application, completed codebase changes, and the exact steps you need to perform from your end to complete the database migration and deploy the backend server to Fly.io.

---

## 1. Current State of the Codebase

### Frontend (Done & Verified)
* Custom image profile picture uploads are fully integrated with HTML Canvas compression (128x128 JPEG) on onboarding and settings panels.
* Dynamic cyberpunk rendering supports base64 image strings.
* Web app compiles cleanly via `npm run build` in 351ms.

### Backend (Implemented & Connected)
* Supabase JS Client integration is completed in `backend/server.js`.
* Resilient dual sandbox mode fallback: the server falls back automatically to local in-memory states if connection details are missing or database tables do not exist in the schema.
* Keystroke multipliers, 2-submission attempt caps, tiebreakers, anti-cheat channels, and spectator broadcasts are fully integrated and active.
* Node dependencies and [fly.toml](file:///Users/phoenix/Documents/algoclash/backend/fly.toml) configuration files are prepared.

---

## 2. Step-by-Step Guide for Your Setup (Fly.io & Supabase)

### Step 1: Run Supabase SQL Migrations
Since the backend tables do not exist in your Supabase schema yet, go to your **Supabase Dashboard → SQL Editor → New Query**, copy-paste the SQL script below, and click **Run**:

```sql
-- 1. Extend Profiles with Dueling Metrics
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS elo INT DEFAULT 1200;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wins INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS losses INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]';

-- 2. Create Problems Table
CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  test_cases JSONB NOT NULL,
  hidden_cases JSONB NOT NULL,
  time_limit_ms INT DEFAULT 3000,
  comparator TEXT DEFAULT 'exact',
  tags TEXT[],
  reference_solutions JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_one UUID REFERENCES profiles(id),
  player_two UUID REFERENCES profiles(id),
  problem_id TEXT REFERENCES problems(id),
  winner UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active',
  player_one_elo_before INT,
  player_two_elo_before INT,
  player_one_elo_after INT,
  player_two_elo_after INT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- 4. Create Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  user_id UUID REFERENCES profiles(id),
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  verdict TEXT NOT NULL,
  hidden_cases_passed INT DEFAULT 0,
  hidden_cases_total INT DEFAULT 0,
  execution_time_ms INT,
  memory_used_kb INT,
  submitted_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS idx_submissions_match ON submissions(match_id, submitted_at);

-- 5. Create Anti-Cheat Events Table
CREATE TABLE IF NOT EXISTS anticheat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  payload JSONB,
  occurred_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- 6. Create Brackets Table
CREATE TABLE IF NOT EXISTS brackets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID,
  round INT NOT NULL,
  slot INT NOT NULL,
  match_id UUID REFERENCES matches(id),
  player_one UUID REFERENCES profiles(id),
  player_two UUID REFERENCES profiles(id),
  winner UUID REFERENCES profiles(id),
  next_bracket_id UUID REFERENCES brackets(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 7. Seed the initial problem (Max Product of 3)
INSERT INTO problems (id, title, description, difficulty, test_cases, hidden_cases, time_limit_ms, comparator, tags) 
VALUES (
  'prod-product-of-3',
  'Max Product of 3',
  'Blitz Format:\n\nGiven an integer array nums, find three numbers whose product is maximum and return the maximum product.\n\nInput Constraints:\n- 3 <= nums.length <= 10^4\n- -1000 <= nums[i] <= 1000\n\nInput Format:\nFirst line: n (array size)\nSecond line: n integers separated by space\n\nOutput Format:\nA single integer representing the maximum product.',
  'easy',
  '[{"input": "5\n1 2 3 4 5", "output": "60"}, {"input": "3\n-10 -10 5", "output": "500"}]'::jsonb,
  '[{"input": "4\n1 10 -5 1", "output": "10"}, {"input": "6\n-1 -2 -3 -4 0 5", "output": "60"}, {"input": "5\n1 2 3 4 -10", "output": "24"}, {"input": "5\n-100 -98 1 2 3", "output": "29400"}, {"input": "3\n-1 -2 -3", "output": "-6"}, {"input": "4\n0 0 0 0", "output": "0"}, {"input": "5\n-10 -10 -10 1 2", "output": "200"}, {"input": "5\n1 1 1 1 1", "output": "1"}, {"input": "4\n-1 -1 -1 5", "output": "5"}, {"input": "3\n10 10 10", "output": "1000"}]'::jsonb,
  3000,
  'exact',
  ARRAY['greedy', 'math']
) ON CONFLICT (id) DO NOTHING;
```

---

### Step 2: Configure Local Environment Variables
Create a file named `.env` in the `backend/` directory containing your Supabase service role keys (needed for secure backend queries):
```env
PORT=3001
SUPABASE_URL=https://uvzyrfskgxokpoqiacyh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

---

### Step 3: Deploy Backend Server to Fly.io
Follow these terminal commands from your local machine to configure and deploy the Node socket backend:

1. **Install flyctl** (if not already installed):
   - **macOS**:
     ```bash
     brew install flyctl
     ```
     *(Or via curl: `curl -L https://fly.io/install.sh | sh`)*
   - **Windows (PowerShell)**:
     ```powershell
     pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
     ```

2. **Login to Fly.io**:
   ```bash
   fly auth login
   ```

3. **Initialize App Configuration**:
   Navigate into the backend directory and launch the app setup (select **No** to deploying immediately when prompted, as secrets must be set first):
   ```bash
   cd backend
   fly launch --no-deploy
   ```

4. **Set Production Secrets**:
   Copy-paste the Supabase credentials from your dashboard into your Fly app's secret vault:
   ```bash
   fly secrets set SUPABASE_URL="https://uvzyrfskgxokpoqiacyh.supabase.co" SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

6. **Verify Server Status**:
   ```bash
   fly status
   ```
   *Your server will now be live on `https://algoclash-backend.fly.dev`!*

---

### Step 4: Configure Vercel Frontend Environment Variables
When deploying the frontend to Vercel, you must provide the production URL of your socket backend.
1. Go to your **Vercel Dashboard → project settings → Environment Variables**.
2. Add the following key:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://algoclash-backend.fly.dev` (replace with your actual Fly.io app domain from Step 3)
3. Re-deploy the Vercel site for changes to apply.

---

### Step 5: Configure Supabase OAuth Redirect URLs
To prevent 404 errors during Google OAuth redirection in production:
1. Go to your **Supabase Dashboard → Authentication → URL Configuration**.
2. Ensure your Vercel deployment URL (e.g. `https://algoclash.vercel.app/` or `https://algoclash.com/`) is added to the **Redirect URLs** list.
3. If missing, login attempts from your deployed Vercel domain will fail to route back correctly.
