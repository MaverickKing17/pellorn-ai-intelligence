import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { IndustryType } from '@/context/IndustryContext';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  industry: IndustryType | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [industry, setIndustry] = useState<IndustryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (!sess?.user) {
        setIndustry(null);
      } else {
        // Defer DB call to avoid deadlock
        setTimeout(() => fetchIndustry(sess.user.id), 0);
      }
    });

    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        fetchIndustry(sess.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchIndustry = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('industry')
      .eq('id', userId)
      .maybeSingle();
    setIndustry((data?.industry as IndustryType) ?? 'financial');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIndustry(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, industry, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
