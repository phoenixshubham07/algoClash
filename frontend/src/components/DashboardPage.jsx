import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberButton } from './CyberButton';
import { InteractiveBackground } from './InteractiveBackground';
import { supabase } from '../supabaseClient';
import { LogoWordmark } from './LogoWordmark';

const AVATARS = [
  { id: 'toxic_code', name: 'TOXIC_CODE', icon: '☣️', color: 'var(--accent-cyan)', glow: 'rgba(0, 242, 254, 0.4)' },
  { id: 'neon_skull', name: 'NEON_SKULL', icon: '💀', color: 'var(--accent-crimson)', glow: 'rgba(244, 63, 94, 0.4)' },
  { id: 'matrix_eye', name: 'MATRIX_EYE', icon: '🔮', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { id: 'mech_drone', name: 'MECH_DRONE', icon: '🤖', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'volt_strike', name: 'VOLT_STRIKE', icon: '⚡', color: 'var(--accent-yellow)', glow: 'rgba(255, 215, 0, 0.4)' },
  { id: 'biotic_core', name: 'BIOTIC_CORE', icon: '🧬', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
];

const RECENT_DUELS = [
  { id: 1, rival: 'xX_CodeGhost_Xx', outcome: 'VICTORY', delta: '+24 ELO', lang: 'C++', time: '3m 45s', date: '2 HOURS AGO' },
  { id: 2, rival: 'ZeroCool', outcome: 'VICTORY', delta: '+18 ELO', lang: 'Python', time: '5m 12s', date: '4 HOURS AGO' },
  { id: 3, rival: 'BitSlayer', outcome: 'DEFEAT', delta: '-12 ELO', lang: 'Java', time: '8m 04s', date: '1 DAY AGO' },
  { id: 4, rival: 'cyber_sam', outcome: 'VICTORY', delta: '+22 ELO', lang: 'C++', time: '2m 19s', date: '2 DAYS AGO' },
  { id: 5, rival: 'hack_overflow', outcome: 'VICTORY', delta: '+15 ELO', lang: 'Python', time: '4m 30s', date: '2 DAYS AGO' },
];

const LEADERBOARD = [
  { rank: 1, name: 'master_coder', rating: '2,120 ELO', status: 'online', color: 'var(--accent-cyan)' },
  { rank: 2, name: 'null_pointer', rating: '1,980 ELO', status: 'busy', color: 'var(--accent-crimson)' },
  { rank: 3, name: 'shubham_barik', rating: '1,840 ELO', status: 'online', color: 'var(--accent-yellow)' },
  { rank: 4, name: 'cyber_ninja', rating: '1,750 ELO', status: 'offline', color: 'var(--text-muted)' },
  { rank: 5, name: 'algo_lord', rating: '1,690 ELO', status: 'online', color: 'var(--accent-cyan)' },
];

export const DashboardPage = () => {
  // Active User Profile
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarId, setAvatarId] = useState('toxic_code');
  const [sessionUser, setSessionUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Tabs / Navigation
  const [isEditing, setIsEditing] = useState(false); // false = stats dashboard, true = settings

  // Settings Edit State
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editAvatarId, setEditAvatarId] = useState('toxic_code');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [systemLogs, setSystemLogs] = useState([
    '⚡ [INIT] CORE CONSOLE SECURED.',
    '🟢 [SYS] WELCOME TO THE DUEL COMMAND DECK.'
  ]);

  // Load and check profile on mount
  useEffect(() => {
    const checkProfileAndLoad = async () => {
      let currentUsername = localStorage.getItem('algoclash_username');
      let currentDisplayName = localStorage.getItem('algoclash_display_name');
      let currentAvatar = localStorage.getItem('algoclash_avatar') || 'toxic_code';

      let isSupabaseLoaded = false;
      let sessionUserInstance = null;

      // 1. If Supabase is connected, check active cloud session and load profile metadata
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          sessionUserInstance = session.user;
          setSessionUser(session.user);
          
          // First try reading from user metadata (which is cloud-persistent and database tableless)
          const meta = session.user.user_metadata;
          if (meta && meta.username && meta.display_name) {
            currentUsername = meta.username;
            currentDisplayName = meta.display_name;
            currentAvatar = meta.avatar_icon || 'toxic_code';
            isSupabaseLoaded = true;
          } else {
            // Fallback: Try fetching profile from Supabase profiles table if it exists
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!error && profileData) {
                currentUsername = profileData.username;
                currentDisplayName = profileData.display_name;
                currentAvatar = profileData.avatar_icon;
                isSupabaseLoaded = true;
              }
            } catch (e) {
              // Silence DB table error
            }
          }
        }
      }

      // 2. If mock user or local storage session, try to retrieve from persistent profile registry
      if (!isSupabaseLoaded && currentUsername) {
        const registryData = localStorage.getItem('algoclash_registry_' + currentUsername.toLowerCase());
        if (registryData) {
          const parsed = JSON.parse(registryData);
          currentUsername = parsed.username || currentUsername;
          currentDisplayName = parsed.displayName || currentDisplayName;
          currentAvatar = parsed.avatarId || currentAvatar;
        }
      }

      // Cache current session details in active local storage keys
      if (currentUsername) localStorage.setItem('algoclash_username', currentUsername);
      if (currentDisplayName) localStorage.setItem('algoclash_display_name', currentDisplayName);
      localStorage.setItem('algoclash_avatar', currentAvatar);

      // If missing vital profile details (username or display name), force route to setup page
      if (!currentUsername || !currentDisplayName) {
        window.location.href = '/setup-profile';
        return;
      }

      setUsername(currentUsername);
      setDisplayName(currentDisplayName);
      setAvatarId(currentAvatar);
      
      setSystemLogs(prev => [
        ...prev,
        `📡 [SESSION] WELCOME BACK, OPERATOR: ${currentDisplayName.toUpperCase()}`,
        `⚙️ [BADGE] CYBER_AVATAR: ${currentAvatar.toUpperCase()}`,
        isSupabaseLoaded ? '🛡️ [CLOUD] SYNCHRONIZED CLOUD DATABASE PROFILE.' : '💽 [LOCAL] OPERATING WITH SANDBOX STORAGE FALLBACK.'
      ]);
      setProfileLoading(false);
    };

    checkProfileAndLoad();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('algoclash_username');
    localStorage.removeItem('algoclash_display_name');
    localStorage.removeItem('algoclash_avatar');
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  };

  const handleOpenSettings = () => {
    setEditDisplayName(displayName);
    setEditUsername(username);
    setEditAvatarId(avatarId);
    setSettingsError('');
    setSettingsSuccess('');
    setIsEditing(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!editDisplayName.trim() || !editUsername.trim()) {
      setSettingsError('All fields must contain valid character data.');
      return;
    }

    setIsSavingSettings(true);
    setSettingsError('');
    setSettingsSuccess('');

    try {
      let isUnique = true;

      // Verify unique username in database if username changed
      if (editUsername !== username && supabase && supabase.auth && sessionUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', editUsername)
          .neq('id', sessionUser.id);

        if (!error && data && data.length > 0) {
          isUnique = false;
        }
      }

      if (!isUnique) {
        setSettingsError('Identifier collision: Username already in use.');
        setIsSavingSettings(false);
        return;
      }

      // Upsert profile in Supabase Auth user metadata
      if (supabase && supabase.auth && sessionUser) {
        const { error } = await supabase.auth.updateUser({
          data: {
            username: editUsername,
            display_name: editDisplayName,
            avatar_icon: editAvatarId
          }
        });

        if (error) {
          console.warn("Supabase user metadata update failed.", error.message);
        }

        // Also attempt database table update (silent fallback)
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: sessionUser.id,
              username: editUsername,
              display_name: editDisplayName,
              avatar_icon: editAvatarId,
              updated_at: new Date().toISOString()
            });
        } catch (e) {
          // Ignore DB error
        }
      }

      // Cache locally in active session keys
      localStorage.setItem('algoclash_username', editUsername);
      localStorage.setItem('algoclash_display_name', editDisplayName);
      localStorage.setItem('algoclash_avatar', editAvatarId);

      // Save to persistent local registry
      localStorage.setItem(
        'algoclash_registry_' + editUsername.toLowerCase(),
        JSON.stringify({ username: editUsername, displayName: editDisplayName, avatarId: editAvatarId })
      );

      setUsername(editUsername);
      setDisplayName(editDisplayName);
      setAvatarId(editAvatarId);

      setSettingsSuccess('Handshake verified: Profile updated successfully.');
      setSystemLogs(prev => [
        ...prev,
        `⚙️ [PROFILE_UPDATE] SYSTEM ALIAS SYNCED: ${editDisplayName.toUpperCase()}`
      ]);

      // Route back to dashboard after brief success display
      setTimeout(() => {
        setIsEditing(false);
      }, 1200);

    } catch (err) {
      setSettingsError('System fault: Could not synchronize updates.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmation !== 'OVERWRITE') {
      setSettingsError('Safety key mismatch. Please type "OVERWRITE" to proceed.');
      return;
    }

    try {
      if (supabase && supabase.auth && sessionUser) {
        // Delete profile row in Supabase database
        await supabase.from('profiles').delete().eq('id', sessionUser.id);
        await supabase.auth.signOut();
      }

      // Wipe local storage completely
      localStorage.clear();
      window.location.href = '/';

    } catch (err) {
      setSettingsError('Account termination failed. Please try again.');
    }
  };

  if (profileLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#020203',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', sans-serif"
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '0.25em' }}>
            ⚡ DECRYPTING SECURE CREDENTIAL CORE...
          </span>
          <div style={{ height: '2px', width: '220px', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '40%', backgroundColor: 'var(--accent-cyan)', position: 'absolute', animation: 'splash-ping 1.2s infinite ease-in-out' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const currentAvatarInfo = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020203',
      color: '#f8fafc',
      padding: '40px 24px',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <InteractiveBackground />

      {/* Grid overlay */}
      <div className="grid-bg" style={{ opacity: 0.85 }}></div>
      <div className="scanlines"></div>

      {/* Decals */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.03) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '500px', height: '500px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.02) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER SECTION */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogoWordmark fontSize="18px" />
              <span style={{ fontSize: '8px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-yellow)', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.1em' }}>
                COMMAND_CENTER
              </span>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px', opacity: 0.8 }}>
              LOC: STAGING_SYS // PORT_NODE_ACTIVE // LATENCY: 14MS
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <CyberButton 
              variant={isEditing ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={isEditing ? () => setIsEditing(false) : handleOpenSettings}
            >
              {isEditing ? '← RETURN TO COMMAND PANEL' : '⚙️ ACC_SETTINGS'}
            </CyberButton>
            <CyberButton variant="ghost" size="sm" onClick={handleLogout}>
              LOGOUT
            </CyberButton>
          </div>
        </header>

        {/* MAIN PANEL CONTENT */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start"
            >
              
              {/* LEFT COLUMN: IDENTITY & OPERATIONS */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* IDENTITY PROFILE CARD */}
                <div style={{
                  position: 'relative',
                  backgroundColor: 'rgba(2, 2, 3, 0.82)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${currentAvatarInfo.color}`,
                  padding: '24px',
                  borderRadius: '4px',
                  boxShadow: `0 0 16px ${currentAvatarInfo.glow}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px'
                }}>
                  {/* Cyber Corner Decals */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderLeft: `2px solid ${currentAvatarInfo.color}`, borderTop: `2px solid ${currentAvatarInfo.color}` }}></div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRight: `2px solid ${currentAvatarInfo.color}`, borderBottom: `2px solid ${currentAvatarInfo.color}` }}></div>

                  {/* Avatar Icon Wrapper */}
                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: `2px solid ${currentAvatarInfo.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '38px',
                    boxShadow: `inset 0 0 15px ${currentAvatarInfo.glow}, 0 0 15px ${currentAvatarInfo.glow}`
                  }}>
                    {currentAvatarInfo.icon}
                  </div>

                  <div>
                    <h2 className="font-display glow-cyan text-white text-lg font-black tracking-wide uppercase">
                      {displayName}
                    </h2>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      @{username}
                    </span>
                  </div>

                  {/* Level & Rank Info */}
                  <div style={{
                    width: '100%',
                    borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--accent-yellow)' }}>RANK: SPECIALIST</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>LVL 4</span>
                    </div>

                    {/* XP Progress Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)' }}>
                        <span>SYSTEM XP PROGRESS</span>
                        <span>780 / 1000</span>
                      </div>
                      <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '78%', height: '100%', backgroundColor: currentAvatarInfo.color, boxShadow: `0 0 8px ${currentAvatarInfo.color}` }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'flex-start', textAlign: 'left', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    <div>REGION: AMER_EAST</div>
                    <div>SECTOR: HUD_GRID_6</div>
                  </div>
                </div>

                {/* ARENA DEPLOYMENT ACTION */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      ⚠️ DEPLOYMENT PROTOCOL
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Queue status clear. Prepare for high-stakes 1v1 algorithmic combat.
                  </p>

                  <CyberButton variant="primary" size="md" onClick={() => window.location.href = '/'} style={{ width: '100%' }}>
                    ENTER BATTLEFIELD
                  </CyberButton>
                </div>

              </div>

              {/* CENTER COLUMN: METRICS & RECENT DUELS */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* COMBAT RECORDS */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '4px',
                  position: 'relative'
                }}>
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>// COMBAT_STATS.DAT</span>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>COM_LINK: ACTIVE</span>
                  </div>

                  {/* Grid showing ELO and stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>RATING (ELO)</span>
                      <span className="glow-cyan text-xl md:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                        1,540
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>WIN / LOSS</span>
                      <span className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                        14 / 2
                      </span>
                      <span style={{ fontSize: '8.5px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)' }}>(87.5% WR)</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>ACCURACY</span>
                      <span className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                        94.2%
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>AVG SPEED</span>
                      <span className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                        248ms
                      </span>
                      <span style={{ fontSize: '8.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PER PASS</span>
                    </div>
                  </div>
                </div>

                {/* RECENT DUELS TABLE */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '4px',
                  position: 'relative'
                }}>
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>// RECENT_COMBAT_HISTORY.LOG</span>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>TACTICAL_FEED</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <th className="pb-3 font-normal">RIVAL</th>
                          <th className="pb-3 font-normal">OUTCOME</th>
                          <th className="pb-3 font-normal">DELTA</th>
                          <th className="pb-3 font-normal">LANG</th>
                          <th className="pb-3 font-normal text-right">DURATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_DUELS.map(duel => (
                          <tr 
                            key={duel.id} 
                            style={{ 
                              borderBottom: '1px solid rgba(255,255,255,0.02)',
                              color: '#fff'
                            }}
                            className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                          >
                            <td className="py-3 font-bold">{duel.rival}</td>
                            <td className="py-3">
                              <span style={{ 
                                color: duel.outcome === 'VICTORY' ? 'var(--accent-cyan)' : 'var(--accent-crimson)',
                                textShadow: duel.outcome === 'VICTORY' ? '0 0 8px rgba(0, 242, 254, 0.3)' : 'none'
                              }}>
                                {duel.outcome}
                              </span>
                            </td>
                            <td className="py-3" style={{ color: duel.outcome === 'VICTORY' ? 'var(--accent-cyan)' : 'var(--accent-crimson)' }}>
                              {duel.delta}
                            </td>
                            <td className="py-3 text-slate-400">{duel.lang}</td>
                            <td className="py-3 text-right text-slate-500">{duel.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: TELEMETRY, LEADERBOARD, & SERVERS */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* SERVER NODES DIAGNOSTICS */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '4px'
                }}>
                  <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', paddingBottom: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      // NODE_DIAGNOSTICS
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-slate-400">droplet-us-east</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-white">9MS [STABLE]</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-slate-400">droplet-eu-west</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span className="text-white">34MS [HIGH_LOAD]</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-slate-400">droplet-ap-south</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-white">12MS [STABLE]</span>
                      </div>
                    </div>

                    {/* Server capacity bars */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '9px', color: 'var(--text-secondary)' }}>
                      <div>QUEUE_SIZE: 14</div>
                      <div>ACTIVE_DUELS: 82</div>
                    </div>
                  </div>
                </div>

                {/* LIVE LEADERBOARD */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '4px'
                }}>
                  <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      // MASTER_LEADERBOARD
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {LEADERBOARD.map(player => (
                      <div 
                        key={player.rank} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingBottom: '6px',
                          borderBottom: '1px solid rgba(255,255,255,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{player.rank}</span>
                          <span style={{ color: player.name === username ? 'var(--accent-cyan)' : '#fff', fontWeight: player.name === username ? 'bold' : 'normal' }}>
                            {player.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{player.rating}</span>
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ 
                              backgroundColor: player.status === 'online' ? '#10b981' : player.status === 'busy' ? '#f43f5e' : '#6b7280' 
                            }}
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TELEMETRY FEED */}
                <div style={{
                  backgroundColor: 'rgba(2, 2, 3, 0.7)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '4px'
                }}>
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>// SYSTEM_TELEMETRY.LOG</span>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>LIVE</span>
                  </div>

                  <div style={{
                    height: '92px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255,255,255,0.02)',
                    padding: '8px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    overflowY: 'auto'
                  }}>
                    {systemLogs.map((log, idx) => (
                      <div key={idx} style={{ color: log.includes('🚨') ? 'var(--accent-crimson)' : log.includes('🛡️') || log.includes('🟢') ? 'var(--accent-cyan)' : '#94a3b8' }}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: 'rgba(2, 2, 3, 0.82)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '36px 40px',
                clipPath: 'polygon(0% 0%, 97% 0%, 100% 20px, 100% 100%, 3% 100%, 0% calc(100% - 20px))',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.15em' }}>
                  [ ACCESS_SETTINGS / PROFILE_TUNING ]
                </span>
              </div>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Inputs Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  
                  {/* Nickname Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                      DISPLAY NAME (NICKNAME)
                    </label>
                    <input 
                      type="text" 
                      maxLength={20}
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>

                  {/* Username Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                      TACTICAL USERNAME (UNIQUE)
                    </label>
                    <input 
                      type="text" 
                      maxLength={18}
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: 'var(--accent-cyan)',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>

                </div>

                {/* Avatar Badge Re-selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    SELECT ACTIVE CYBERNETIC BADGE
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {AVATARS.map(avatar => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setEditAvatarId(avatar.id)}
                        style={{
                          padding: '10px 4px',
                          backgroundColor: editAvatarId === avatar.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                          border: editAvatarId === avatar.id ? `1px solid ${avatar.color}` : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.3s',
                          boxShadow: editAvatarId === avatar.id ? `0 0 8px ${avatar.glow}` : 'none'
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{avatar.icon}</span>
                        <span style={{ fontSize: '8px', color: editAvatarId === avatar.id ? avatar.color : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                          {avatar.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status prompts */}
                {settingsError && (
                  <div style={{ color: 'var(--accent-crimson)', fontSize: '11px', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(244,63,94,0.05)', border: '1px solid var(--accent-crimson)', padding: '8px', borderRadius: '4px' }}>
                    🚨 {settingsError}
                  </div>
                )}
                {settingsSuccess && (
                  <div style={{ color: 'var(--accent-cyan)', fontSize: '11px', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(0,242,254,0.05)', border: '1px solid var(--accent-cyan)', padding: '8px', borderRadius: '4px' }}>
                    🟢 {settingsSuccess}
                  </div>
                )}

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--accent-cyan)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      clipPath: 'polygon(0% 0%, 95% 0%, 100% 8px, 100% 100%, 5% 100%, 0% calc(100% - 8px))',
                      boxShadow: '0 0 10px rgba(0, 242, 254, 0.12)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-cyan)';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#fff';
                    }}
                  >
                    {isSavingSettings ? 'SYNCING TUNING...' : 'COMMIT CHANGES'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      clipPath: 'polygon(0% 0%, 95% 0%, 100% 8px, 100% 100%, 5% 100%, 0% calc(100% - 8px))',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#fff';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>

              {/* DANGER ZONE */}
              <div style={{ marginTop: '24px', borderTop: '1px solid rgba(244, 63, 94, 0.15)', paddingTop: '20px' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                  ⚠️ DANGER_ZONE.SECURE
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: '14px' }}>
                  Deletions are permanent. Removing this profile will wipe your dueling record history and detach OAuth bindings from the core matchmaking databases.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmation('');
                    setSettingsError('');
                    setShowDeleteModal(true);
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                    border: '1px solid var(--accent-crimson)',
                    color: 'var(--accent-crimson)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    clipPath: 'polygon(0% 0%, 95% 0%, 100% 6px, 100% 100%, 5% 100%, 0% calc(100% - 6px))',
                    transition: 'all 0.3s',
                    boxShadow: '0 0 10px rgba(244, 63, 94, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-crimson)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.05)';
                    e.currentTarget.style.color = 'var(--accent-crimson)';
                  }}
                >
                  TERMINATE COMBATANT PROFILE (DELETE ACC)
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ACCOUNT DELETION MODAL OVERLAY */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#050202',
                border: '1px solid var(--accent-crimson)',
                boxShadow: '0 0 30px rgba(244, 63, 94, 0.18)',
                padding: '30px',
                clipPath: 'polygon(0% 0%, 94% 0%, 100% 16px, 100% 100%, 6% 100%, 0% calc(100% - 16px))',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative'
              }}
            >
              {/* Top Warning Stripes */}
              <div className="hazard-stripes-crimson" style={{ height: '6px', position: 'absolute', top: 0, left: 0, right: 0 }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-crimson)' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <span className="font-display" style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '0.1em' }}>
                  PROFILE WIPE PROTOCOL
                </span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                This will initiate server-wide account removal. Your username, stats, and profile bindings will be wiped. This action is irreversible.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                  CONFIRM BY TYPING "OVERWRITE" BELOW:
                </label>
                <input
                  type="text"
                  placeholder="OVERWRITE"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '4px',
                    color: 'var(--accent-crimson)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    outline: 'none',
                    textAlign: 'center',
                    letterSpacing: '0.2em'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-crimson)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(244, 63, 94, 0.3)'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleDeleteAccountConfirm}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: deleteConfirmation === 'OVERWRITE' ? 'var(--accent-crimson)' : 'transparent',
                    border: '1px solid var(--accent-crimson)',
                    color: deleteConfirmation === 'OVERWRITE' ? '#000' : 'var(--accent-crimson)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    cursor: deleteConfirmation === 'OVERWRITE' ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s'
                  }}
                >
                  CONFIRM WIPE
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  ABORT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
