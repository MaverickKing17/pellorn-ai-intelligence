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
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('financial');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = mode === 'signin' ? 'Sign In — Bastion Audit' : 'Create Account — Bastion Audit';
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Shield className="w-7 h-7 text-accent-teal" />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">Bastion Audit</h1>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">
              Enterprise Security Gateway
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
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
                    className="mt-1"
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
                className="mt-1"
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
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-accent-teal text-background hover:bg-accent-teal/90">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="w-full"
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-[10px] text-text-secondary text-center mt-6 uppercase tracking-widest">
          Your industry vertical is bound to your account on signup
        </p>
      </div>
    </div>
  );
}
