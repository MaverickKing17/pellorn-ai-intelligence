import { useState, lazy, Suspense } from 'react';
import {
  Gauge, Users, Award, Briefcase, Cloud, ShieldAlert, FlaskConical, Box, Shield,
  Activity, FileText, Stethoscope, Radio, TrendingUp, Loader2, BadgeCheck, Archive, Workflow, MoreHorizontal, Scale,
  KeyRound, Plug, Network, Lock,
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
const GovernanceGraph = lazy(() => import('@/components/dashboard/GovernanceGraph'));
const ComplianceEncryption = lazy(() => import('@/components/dashboard/ComplianceEncryption'));

type TabDef = { id: string; label: string; icon: typeof Gauge; badge?: string };

// Core governance experience — always visible
const primaryTabs: TabDef[] = [
  { id: 'command-center', label: 'Command Center', icon: Gauge },
  { id: 'governance-graph', label: 'Governance Graph', icon: Network },
  { id: 'agent-registry', label: 'Agent Registry', icon: Users },
  { id: 'case-management', label: 'Case Management', icon: Scale, badge: '12' },
  { id: 'trust-score', label: 'Trust Score™', icon: Award },
  { id: 'executive-exposure', label: 'Executive Exposure', icon: Briefcase },
  { id: 'board-report', label: 'Board Report', icon: FileText },
];

// Operational / advanced capabilities — progressive disclosure
const tabGroups: { label: string; tabs: TabDef[] }[] = [
  {
    label: 'Assurance',
    tabs: [
      { id: 'agent-certification', label: 'Agent Certification', icon: BadgeCheck },
      { id: 'evidence-vault', label: 'Evidence Vault', icon: Archive },
      { id: 'governance-workflows', label: 'Governance Workflows', icon: Workflow },
      { id: 'policy-engine', label: 'Policy Enforcement', icon: ShieldAlert },
      { id: 'compliance-encryption', label: 'Compliance & Encryption', icon: Lock, badge: 'BYOK' },
    ],
  },
  {
    label: 'Monitoring',
    tabs: [
      { id: 'threat-feed', label: 'Live Threat Feed', icon: Radio },
      { id: 'behavioral-drift', label: 'Behavioral Drift', icon: Activity },
      { id: 'red-team', label: 'Red Team Sandbox', icon: FlaskConical },
      { id: 'digital-twin', label: 'Digital Twin', icon: TrendingUp, badge: 'Beta' },
      { id: 'model-inventory', label: 'Model Inventory', icon: Box },
      { id: 'vuln-audit', label: 'Vulnerability Audit', icon: Shield },
    ],
  },
  {
    label: 'Platform',
    tabs: [
      { id: 'azure-workspace', label: 'Azure Workspace', icon: Cloud },
      { id: 'entra-connector', label: 'Entra Connector', icon: KeyRound, badge: 'Preview' },
      { id: 'integration-center', label: 'Integration Center', icon: Plug },
      { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
    ],
  },
];

const allTabs = [...primaryTabs, ...tabGroups.flatMap(g => g.tabs)];



export default function Index() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'command-center': return <GovernanceCommandCenter />;
      case 'governance-graph': return <GovernanceGraph />;
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
      case 'compliance-encryption': return <ComplianceEncryption />;
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

  const activeLabel = allTabs.find(t => t.id === activeTab)?.label ?? 'Command Center';

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-60 pt-5 px-4 sm:px-6 pb-6">
        <nav aria-label="Dashboard sections" className="mb-6 border-b border-border">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
              {primaryTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? 'border-accent-teal text-foreground'
                        : 'border-transparent text-text-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && (
                      <span className="text-[11px] font-semibold tabular-nums bg-accent-amber/15 text-accent-amber px-1.5 rounded">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 pb-1.5">
              {tabGroups.map(group => {
                const groupActive = group.tabs.some(t => t.id === activeTab);
                return (
                  <div key={group.label} className="relative group">
                    <button
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                        groupActive
                          ? 'bg-surface-raised text-foreground'
                          : 'text-text-secondary hover:text-foreground hover:bg-surface-raised/60'
                      }`}
                    >
                      {group.label}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    <div className="absolute right-0 top-full pt-1 w-60 z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity">
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-1">
                        {group.tabs.map(t => {
                          const Icon = t.icon;
                          const isActive = activeTab === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setActiveTab(t.id)}
                              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] text-left ${
                                isActive ? 'bg-card text-foreground' : 'text-text-secondary hover:bg-card hover:text-foreground'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="flex-1">{t.label}</span>
                              {t.badge && <span className="text-[11px] text-text-muted">{t.badge}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
        <h2 className="sr-only">{activeLabel}</h2>

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
