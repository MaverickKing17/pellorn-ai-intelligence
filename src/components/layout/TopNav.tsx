import { Shield, Menu, Power, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIndustry } from '@/context/IndustryContext';
import { useAuth } from '@/hooks/useAuth';
import ExitStrategyButton from '@/components/dashboard/ExitStrategyButton';

interface TopNavProps {
  onMenuToggle: () => void;
}

export default function TopNav({ onMenuToggle }: TopNavProps) {
  const { config } = useIndustry();
  const { user, signOut } = useAuth();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden text-text-secondary hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <Shield className="w-6 h-6 text-accent-teal" />
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-foreground leading-none">Bastion Audit</h1>
          <p className="text-[10px] uppercase tracking-widest text-text-secondary">{config.brandTagline}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        {config.complianceBadges.map(b => (
          <span
            key={b.label}
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              b.status === 'compliant'
                ? 'border-accent-teal/30 text-accent-teal bg-accent-teal/10'
                : 'border-accent-amber/30 text-accent-amber bg-accent-amber/10'
            }`}
          >
            {b.label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">Security Health</span>
          <span className="text-sm font-bold text-foreground">100.0%</span>
          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full w-full bg-accent-teal rounded-full" />
          </div>
        </div>

        <Button
          size="sm"
          className="bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30 text-[10px] uppercase tracking-wider font-semibold h-7 px-3"
        >
          <Power className="w-3 h-3 mr-1" />
          Live Kill-Switch
        </Button>

        {user ? (
          <>
            <span className="hidden md:inline text-[10px] uppercase tracking-wider text-text-secondary truncate max-w-[160px]">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-border text-text-secondary hover:text-foreground h-7 text-xs"
            >
              <LogOut className="w-3 h-3 mr-1" /> Sign Out
            </Button>
          </>
        ) : (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border text-text-secondary hover:text-foreground h-7 text-xs"
          >
            <Link to="/auth">
              <LogIn className="w-3 h-3 mr-1" /> Sign In
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
