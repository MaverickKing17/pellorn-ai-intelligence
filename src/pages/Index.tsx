import { useState, lazy, Suspense } from 'react';
import {
  Gauge, Users, Award, Briefcase, Cloud, ShieldAlert, FlaskConical, Box, Shield,
  Activity, FileText, Stethoscope, Radio, TrendingUp, Loader2, BadgeCheck, Archive, Workflow, MoreHorizontal, Scale,
  KeyRound, Plug, Network,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import GovernanceCommandCenter from '@/components/dashboard/GovernanceCommandCenter';

const AgentRegistry = lazy(() => import('@/components/dashboard/AgentRegistry'));
const TrustScore = lazy(() => import('@/components/dashboard/TrustScore'));
const ExecutiveExposure = lazy(() => import('@/components/dashboard/ExecutiveExposure'));
const DigitalTwin = lazy(() => import('@/components/dashboard/DigitalTwin'));
const LiveThreatFeed = lazy(() => import('@/components/dashboard/LiveThreatFeed'));
const RedTeamSandbox = lazy(() => import('@/components/dashboard/RedTeamSandbox'));
const ModelInventory = lazy(() => import('@/components/dashboard/ModelInventory'));
const VulnerabilityAudit = lazy(() => import('@/components/dashboard/VulnerabilityAudit'));
const BehavioralDrift = lazy(() => import('@/components/dashboard/BehavioralDrift'));
const BoardReport = lazy(() => import('@/components/dashboard/BoardReport'));
const PolicyEnforcement = lazy(() => import('@/components/dashboard/PolicyEnforcement'));
const DiagnosticsPanel = lazy(() => import('@/components/dashboard/DiagnosticsPanel'));
const AzureWorkspace = lazy(() => import('@/components/dashboard/AzureWorkspace'));
const AgentCertification = lazy(() => import('@/components/dashboard/AgentCertification'));
const EvidenceVault = lazy(() => import('@/components/dashboard/EvidenceVault'));
const GovernanceWorkflows = lazy(() => import('@/components/dashboard/GovernanceWorkflows'));
const CaseManagement = lazy(() => import('@/components/dashboard/CaseManagement'));
const EntraConnector = lazy(() => import('@/components/dashboard/EntraConnector'));
const IntegrationCenter = lazy(() => import('@/components/dashboard/IntegrationCenter'));

const primaryTabs = [
  { id: 'command-center', label: 'Command Center', icon: Gauge },
  { id: 'agent-registry', label: 'Agent Registry', icon: Users },
  { id: 'agent-certification', label: 'Agent Certification', icon: BadgeCheck },
  { id: 'case-management', label: 'Case Management', icon: Scale, badge: '12' },
  { id: 'evidence-vault', label: 'Evidence Vault', icon: Archive, badge: 'NEW' },
  { id: 'governance-workflows', label: 'Governance Workflows', icon: Workflow, badge: 'NEW' },
  { id: 'trust-score', label: 'Trust Score™', icon: Award },
  { id: 'executive-exposure', label: 'Executive Exposure', icon: Briefcase },
  { id: 'digital-twin', label: 'Digital Twin', icon: TrendingUp, badge: 'BETA' },
  { id: 'threat-feed', label: 'Live Threat Feed', icon: Radio },
  { id: 'red-team', label: 'Red Team Sandbox', icon: FlaskConical },
  { id: 'behavioral-drift', label: 'Behavioral Drift', icon: Activity },
  { id: 'board-report', label: 'Board Report', icon: FileText },
  { id: 'azure-workspace', label: 'Azure Workspace', icon: Cloud },
  { id: 'policy-engine', label: 'Policy Enforcement', icon: ShieldAlert },
];

const moreTabs = [
  { id: 'entra-connector', label: 'Entra Connector', icon: KeyRound, badge: 'PREVIEW' },
  { id: 'integration-center', label: 'Integration Center', icon: Plug, badge: 'NEW' },
  { id: 'model-inventory', label: 'Model Inventory', icon: Box },
  { id: 'vuln-audit', label: 'Vulnerability Audit', icon: Shield },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
];



export default function Index() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'command-center': return <GovernanceCommandCenter />;
      case 'agent-registry': return <AgentRegistry />;
      case 'agent-certification': return <AgentCertification />;
      case 'case-management': return <CaseManagement />;
      case 'evidence-vault': return <EvidenceVault />;
      case 'governance-workflows': return <GovernanceWorkflows />;
      case 'trust-score': return <TrustScore />;
      case 'executive-exposure': return <ExecutiveExposure />;
      case 'digital-twin': return <DigitalTwin />;
      case 'azure-workspace': return <AzureWorkspace />;
      case 'entra-connector': return <EntraConnector />;
      case 'integration-center': return <IntegrationCenter />;
      case 'policy-engine': return <PolicyEnforcement />;
      case 'threat-feed': return <LiveThreatFeed />;
      case 'red-team': return <RedTeamSandbox />;
      case 'model-inventory': return <ModelInventory />;
      case 'vuln-audit': return <VulnerabilityAudit />;
      case 'behavioral-drift': return <BehavioralDrift />;
      case 'board-report': return <BoardReport />;
      case 'diagnostics': return <DiagnosticsPanel />;
      default: return <GovernanceCommandCenter />;
    }
  };

  const activeInMore = moreTabs.some(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-60 pt-4 px-4 pb-4">
        <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-hide items-center">
          {primaryTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const badge = (tab as { badge?: string }).badge;
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
                {badge && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider bg-accent-teal/10 text-accent-teal px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeInMore
                  ? 'bg-card border border-border text-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-card/50'
              }`}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              More
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg p-1 z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
              {moreTabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${
                      isActive ? 'bg-card text-foreground' : 'text-text-secondary hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
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
