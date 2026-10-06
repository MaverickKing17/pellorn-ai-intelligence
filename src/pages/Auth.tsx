import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Home, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  useEffect(() => {
    document.title = mode === 'signin' ? 'Sign In — Pellorn' : 'Create Account — Pellorn';
  }, [mode]);

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

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

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error('Google sign-in failed');
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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 transition-all duration-200 focus-visible:border-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:shadow-[0_0_0_4px_hsl(var(--accent-teal)/0.12)]"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-accent-teal text-background hover:bg-accent-teal/90 shadow-[0_8px_24px_-8px_hsl(var(--accent-teal)/0.6)]">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="my-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] uppercase tracking-widest text-text-secondary">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              className="w-full gap-2 bg-background/40 hover:bg-background/70 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.8 35.5 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                signInDemo();
                navigate('/', { replace: true });
              }}
              className="group w-full mt-2 border-accent-teal/50 text-accent-teal bg-accent-teal/[0.04] hover:bg-accent-teal/10 hover:text-accent-teal hover:border-accent-teal font-semibold uppercase tracking-[0.18em] text-xs transition-all duration-300 hover:shadow-[0_0_0_1px_hsl(var(--accent-teal)/0.4),0_0_24px_hsl(var(--accent-teal)/0.35)]"
            >
              Try Demo — Instant Guest Access
            </Button>
          </div>
        </div>

        <p className="text-[11px] text-text-secondary/80 text-center mt-6 uppercase tracking-[0.28em] font-medium">
          Your industry vertical is bound to your account on signup
        </p>
      </div>
    </div>
  );
}
