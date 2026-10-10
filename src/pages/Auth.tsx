import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Building2, Home, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { IndustryType } from '@/context/IndustryContext';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, signInDemo } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('financial');
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const initialRecovery =
    searchParams.get('recovery') === '1' ||
    (typeof window !== 'undefined' && window.location.hash.includes('type=recovery'));
  const [recovery, setRecovery] = useState<boolean>(initialRecovery);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Recovery callback: listen for PASSWORD_RECOVERY and surface link errors.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const qErr = searchParams.get('error_description') || hash.get('error_description');
    if (qErr && (initialRecovery || searchParams.get('recovery') === '1')) {
      setRecoveryError('This reset link is invalid or has expired. Please request a new one.');
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecovery(true);
        setRecoveryError(null);
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = recovery
      ? 'Reset Password — Pellorn'
      : mode === 'signin' ? 'Sign In — Pellorn' : 'Create Account — Pellorn';
  }, [mode, recovery]);

  useEffect(() => {
    // Never navigate away while the password-reset form is in use.
    if (recovery) return;
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate, recovery]);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth?recovery=1`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('If an account exists for that email, a reset link has been sent.');
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');
    setSubmitting(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        throw new Error('Your reset link is invalid or has expired. Please request a new one.');
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      await supabase.auth.signOut();
      setNewPassword('');
      setConfirmPassword('');
      setRecovery(false);
      setMode('signin');
      window.history.replaceState(null, '', '/auth');
      toast.success('Password updated. Please sign in with your new password.');
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'mt-1 transition-all duration-200 focus-visible:border-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:shadow-[0_0_0_4px_hsl(var(--accent-teal)/0.12)]';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, industry },
          },
        });
        if (error) throw error;
        toast.success('Account created. You can sign in now.');
        setMode('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
      {/* Radial glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, hsl(var(--accent-teal) / 0.18), transparent 70%), radial-gradient(ellipse 40% 30% at 50% 90%, hsl(var(--accent-teal) / 0.08), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--accent-teal)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-teal)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Shield className="w-7 h-7 text-accent-teal drop-shadow-[0_0_12px_hsl(var(--accent-teal)/0.6)]" />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">Pellorn</h1>
            <p className="text-[11px] uppercase tracking-widest text-text-secondary mt-1">
              AI Governance &amp; Intelligence
            </p>
          </div>
        </div>

        {/* Gradient border wrapper */}
        <div
          className="relative rounded-2xl p-[1px]"
          style={{
            background:
              'linear-gradient(140deg, hsl(var(--accent-teal) / 0.5), hsl(var(--border) / 0.3) 40%, hsl(var(--accent-teal) / 0.35))',
          }}
        >
          <div
            className="rounded-2xl p-6 bg-card/70 backdrop-blur-xl"
            style={{
              boxShadow:
                '0 30px 80px -30px hsl(var(--accent-teal) / 0.25), 0 0 0 1px hsl(var(--border) / 0.4) inset',
            }}
          >
            {recovery ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Set a new password</h2>
                  <p className="text-xs text-text-secondary mt-1">Choose a password of at least 8 characters.</p>
                </div>
                {recoveryError && (
                  <p role="alert" className="text-xs text-destructive">{recoveryError}</p>
                )}
                <div>
                  <Label htmlFor="newPassword" className="text-xs">New password</Label>
                  <PasswordInput id="newPassword" autoComplete="new-password" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} required minLength={8} className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-xs">Confirm new password</Label>
                  <PasswordInput id="confirmPassword" autoComplete="new-password" value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} required minLength={8} className={inputCls} />
                </div>
                {mode === 'signin' && (
                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={() => { setForgot(true); setResetSent(false); }}
                    className="text-xs font-medium text-accent-teal hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-accent-teal text-background hover:bg-accent-teal/90">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update password
                </Button>
                <button type="button" onClick={() => { setRecovery(false); setRecoveryError(null); window.history.replaceState(null, '', '/auth'); }}
                  className="w-full text-xs text-text-secondary hover:text-foreground">
                  Back to sign in
                </button>
              </form>
            ) : forgot ? (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Reset your password</h2>
                  <p className="text-xs text-text-secondary mt-1">Enter your account email and we'll send you a reset link.</p>
                </div>
                {resetSent ? (
                  <p role="status" className="text-xs text-accent-teal">
                    Request accepted. If an account exists for {email}, check your inbox for a reset link.
                  </p>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="resetEmail" className="text-xs">Email</Label>
                      <Input id="resetEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
                    </div>
                    {mode === 'signin' && (
                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={() => { setForgot(true); setResetSent(false); }}
                    className="text-xs font-medium text-accent-teal hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-accent-teal text-background hover:bg-accent-teal/90">
                      {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Send reset link
                    </Button>
                  </>
                )}
                <button type="button" onClick={() => { setForgot(false); setResetSent(false); }}
                  className="w-full text-xs text-text-secondary hover:text-foreground">
                  Back to sign in
                </button>
              </form>
            ) : (<>
            <div className="flex gap-1 mb-6 p-1 bg-surface-raised/60 rounded-full">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  mode === 'signin' ? 'bg-accent-teal/20 text-accent-teal' : 'text-text-secondary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  mode === 'signup' ? 'bg-accent-teal/20 text-accent-teal' : 'text-text-secondary'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      className="mt-1 transition-all duration-200 focus-visible:border-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:shadow-[0_0_0_4px_hsl(var(--accent-teal)/0.12)]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Industry Vertical</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIndustry('financial')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                          industry === 'financial'
                            ? 'border-accent-teal bg-accent-teal/10 text-accent-teal'
                            : 'border-border text-text-secondary hover:text-foreground'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" /> Financial
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndustry('real_estate')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                          industry === 'real_estate'
                            ? 'border-accent-amber bg-accent-amber/10 text-accent-amber'
                            : 'border-border text-text-secondary hover:text-foreground'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" /> Real Estate
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="mt-1 transition-all duration-200 focus-visible:border-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:shadow-[0_0_0_4px_hsl(var(--accent-teal)/0.12)]"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-xs">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 transition-all duration-200 focus-visible:border-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:shadow-[0_0_0_4px_hsl(var(--accent-teal)/0.12)]"
                />
              </div>

              {mode === 'signin' && (
                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={() => { setForgot(true); setResetSent(false); }}
                    className="text-xs font-medium text-accent-teal hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-accent-teal text-background hover:bg-accent-teal/90 shadow-[0_8px_24px_-8px_hsl(var(--accent-teal)/0.6)]">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>


            <Button
              type="button"
              variant="outline"
              onClick={() => {
                signInDemo();
                navigate('/', { replace: true });
              }}
              className="group w-full mt-5 border-accent-teal/50 text-accent-teal bg-accent-teal/[0.04] hover:bg-accent-teal/10 hover:text-accent-teal hover:border-accent-teal font-semibold uppercase tracking-[0.18em] text-xs transition-all duration-300 hover:shadow-[0_0_0_1px_hsl(var(--accent-teal)/0.4),0_0_24px_hsl(var(--accent-teal)/0.35)]"
            >
              Try Demo — Instant Guest Access
            </Button>
            </>)}
          </div>
        </div>

        <p className="text-[11px] text-text-secondary/80 text-center mt-6 uppercase tracking-[0.28em] font-medium">
          Your industry vertical is bound to your account on signup
        </p>
      </div>
    </div>
  );
}
