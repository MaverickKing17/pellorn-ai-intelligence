import { useState, lazy, Suspense } from 'react';
import { Radio, FlaskConical, Box, Shield, Activity, FileText, ShieldAlert, Loader2, Stethoscope, Cloud } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import LiveThreatFeed from '@/components/dashboard/LiveThreatFeed';

const RedTeamSandbox = lazy(() => import('@/components/dashboard/RedTeamSandbox'));
const ModelInventory = lazy(() => import('@/components/dashboard/ModelInventory'));
const VulnerabilityAudit = lazy(() => import('@/components/dashboard/VulnerabilityAudit'));
const BehavioralDrift = lazy(() => import('@/components/dashboard/BehavioralDrift'));
const BoardReport = lazy(() => import('@/components/dashboard/BoardReport'));
const PolicyEnforcement = lazy(() => import('@/components/dashboard/PolicyEnforcement'));
const DiagnosticsPanel = lazy(() => import('@/components/dashboard/DiagnosticsPanel'));
const AzureWorkspace = lazy(() => import('@/components/dashboard/AzureWorkspace'));

const tabs = [
  { id: 'threat-feed', label: 'Live Threat Feed', icon: Radio },
  { id: 'policy-engine', label: 'Policy Enforcement', icon: ShieldAlert, badge: 'NEW' },
  { id: 'azure-workspace', label: 'Azure Workspace', icon: Cloud, badge: 'NEW' },
  { id: 'red-team', label: 'Red Team Sandbox', icon: FlaskConical },
  { id: 'model-inventory', label: 'Model Inventory', icon: Box },
  { id: 'vuln-audit', label: 'Vulnerability Audit', icon: Shield },
  { id: 'behavioral-drift', label: 'Behavioral Drift', icon: Activity },
  { id: 'board-report', label: 'Board Report', icon: FileText },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('threat-feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'threat-feed': return <LiveThreatFeed />;
      case 'policy-engine': return <PolicyEnforcement />;
      case 'red-team': return <RedTeamSandbox />;
      case 'model-inventory': return <ModelInventory />;
      case 'vuln-audit': return <VulnerabilityAudit />;
      case 'behavioral-drift': return <BehavioralDrift />;
      case 'board-report': return <BoardReport />;
      case 'diagnostics': return <DiagnosticsPanel />;
      default: return <LiveThreatFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-60 pt-4 px-4 pb-4">
        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-card border border-border text-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-card/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider bg-accent-teal/10 text-accent-teal px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-text-secondary" /></div>}>
          {renderTab()}
        </Suspense>
      </main>

      <div className="lg:ml-60">
        <Footer />
      </div>
    </div>
  );
}
