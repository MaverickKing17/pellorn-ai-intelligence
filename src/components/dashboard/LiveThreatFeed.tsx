import { Search, Download, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import InterceptionGateway from './InterceptionGateway';
import GuardrailExecution from './GuardrailExecution';
import AgentBehaviorStream from './AgentBehaviorStream';
import RightSidebar from './RightSidebar';
import { useAuth } from '@/hooks/useAuth';

export default function LiveThreatFeed() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {/* Auth Banner */}
      {!user && (
        <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-amber" />
            <div>
              <p className="text-sm font-semibold text-foreground">Authentication Required</p>
              <p className="text-xs text-text-secondary">Please sign in to bind your industry profile and unlock live audit actions.</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-accent-red hover:bg-accent-red/80 text-foreground text-xs h-8">
            <Link to="/auth">Sign In Now</Link>
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] bg-card border border-border rounded-lg flex items-center px-3 gap-2">
          <Search className="w-4 h-4 text-text-muted-custom" />
          <input
            type="text"
            placeholder="Search security events..."
            className="w-full bg-transparent text-xs text-foreground placeholder:text-text-muted-custom outline-none py-2.5"
          />
        </div>
        <Button variant="outline" size="sm" className="border-border text-text-secondary text-xs h-10">
          All Categories ▾
        </Button>
        <Button variant="outline" size="sm" className="border-border text-text-secondary text-xs h-10">
          All Compliance ▾
        </Button>
        <Button variant="outline" size="sm" className="border-border text-foreground text-xs h-10">
          <Download className="w-3 h-3 mr-1" /> Export Audit
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <InterceptionGateway />
          <GuardrailExecution />
          <AgentBehaviorStream />
        </div>
        <div className="lg:col-span-1">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
