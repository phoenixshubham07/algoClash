import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export const OnboardingPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Auto-fill a starting suggestion from Google name if available
  useEffect(() => {
    const fetchOAuthData = async () => {
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const googleName = session.user.user_metadata?.full_name || '';
          if (googleName) {
            setDisplayName(googleName);
            // Suggest username
            const cleaned = googleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
            setUsername(`${cleaned}_${Math.floor(100 + Math.random() * 900)}`);
          }
        }
      }
    };
    fetchOAuthData();
  }, []);

  const handleUsernameChange = (val) => {
    // Keep it clean alphanumeric and underscores
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    setErrorMsg('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) {
      setErrorMsg('All authorization fields are required.');
      return;
    }

    if (username.length < 3) {
      setErrorMsg('Username must contain at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let isUnique = true;
      setIsCheckingUsername(true);

      // Verify username uniqueness in Supabase if connected
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          // Check if username is taken by another user
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .neq('id', session.user.id);

          if (!error && data && data.length > 0) {
            isUnique = false;
          }
        }
      }

      setIsCheckingUsername(false);

      if (!isUnique) {
        setErrorMsg('IDENTIFIER EXPIRED: Username already taken.');
        setIsSubmitting(false);
        return;
      }

      // Save profile metadata inside Supabase Auth user metadata for permanent tableless cloud storage
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { error } = await supabase.auth.updateUser({
            data: {
              username: username,
              display_name: displayName,
              avatar_icon: selectedAvatar
            }
          });

          if (error) {
            console.warn("Supabase user metadata update failed.", error.message);
          }

          // Also attempt database table write (silent fallback if table doesn't exist)
          try {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              username: username,
              display_name: displayName,
              avatar_icon: selectedAvatar,
              updated_at: new Date().toISOString()
            });
          } catch (e) {
            // Ignore DB errors
          }
        }
      }

      // Save to active session cache
      localStorage.setItem('algoclash_username', username);
      localStorage.setItem('algoclash_display_name', displayName);
      localStorage.setItem('algoclash_avatar', selectedAvatar);

      // Save to persistent local registry
      localStorage.setItem(
        'algoclash_registry_' + username.toLowerCase(),
        JSON.stringify({ username, displayName, avatarId: selectedAvatar })
      );

      // Force route to dashboard
      window.location.href = '/dashboard';

    } catch (err) {
      console.error(err);
      setErrorMsg('SYSTEM ERROR: Could not sync profile state.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#020203',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <InteractiveBackground />

      {/* Cyber overlay grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundImage: 'linear-gradient(rgba(3, 3, 4, 0.95) 50%, rgba(0, 0, 0, 1) 100%), linear-gradient(90deg, rgba(0, 242, 254, 0.007) 1px, transparent 1px), linear-gradient(rgba(244, 63, 94, 0.007) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        opacity: 0.85,
        pointerEvents: 'none'
      }}></div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* LOGO AREA */}
        <div style={{ textAlign: 'center' }}>
          <LogoWordmark fontSize="24px" />
          <p style={{ fontSize: '9px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', marginTop: '4px', letterSpacing: '0.15em' }}>
            [ INITIALIZE COMBATANT IDENTITY ]
          </p>
        </div>

        {/* CONTAINER GLASS CARD */}
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(2, 2, 3, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 242, 254, 0.15)',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.05)',
          padding: '36px 32px',
          clipPath: 'polygon(0% 0%, 94% 0%, 100% 24px, 100% 100%, 6% 100%, 0% calc(100% - 24px))',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '45px', backgroundColor: 'var(--accent-cyan)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '45px', backgroundColor: 'var(--accent-crimson)' }}></div>

          <form onSubmit={profileSaved => handleProfileSubmit(profileSaved)} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Display Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                DISPLAY NAME (NICKNAME)
              </label>
              <input 
                type="text" 
                maxLength={20}
                placeholder="Enter combat name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
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
                TACTICAL USERNAME (UNIQUE & ALPHANUMERIC)
              </label>
              <input 
                type="text" 
                maxLength={18}
                placeholder="e.g. agent_zero"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
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

            {/* Avatar Badge Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                SELECT CYBERNETIC AVATAR BADGE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {AVATARS.map(avatar => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    style={{
                      padding: '12px 6px',
                      backgroundColor: selectedAvatar === avatar.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                      border: selectedAvatar === avatar.id ? `1px solid ${avatar.color}` : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.3s',
                      boxShadow: selectedAvatar === avatar.id ? `0 0 10px ${avatar.glow}` : 'none'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{avatar.icon}</span>
                    <span style={{ fontSize: '8px', color: selectedAvatar === avatar.id ? avatar.color : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error messaging */}
            {errorMsg && (
              <div style={{
                color: 'var(--accent-crimson)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
                backgroundColor: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid var(--accent-crimson)',
                padding: '8px',
                borderRadius: '4px'
              }}>
                🚨 {errorMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent-cyan)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                clipPath: 'polygon(0% 0%, 95% 0%, 100% 10px, 100% 100%, 5% 100%, 0% calc(100% - 10px))',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.15)',
                transition: 'all 0.3s',
                marginTop: '10px'
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
              {isSubmitting ? 'SYNCHRONIZING PROFILE...' : 'INITIALIZE SYSTEM ACCOUNT'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
