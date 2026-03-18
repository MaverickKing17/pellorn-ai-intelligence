import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const agents = [
  { name: 'Retail Banking Assistant', version: 'v2.4.1', provider: 'Azure OpenAI (Canada Central)', date: '2026-03-10', lastAudit: '2026-03-10', risk: 'LOW RISK', riskColor: 'text-accent-teal', status: 'ACTIVE', statusColor: 'text-accent-teal' },
  { name: 'Claims Processing Engine', version: 'v1.9.0', provider: 'Anthropic (AWS Canada)', date: '2026-03-15', lastAudit: '2026-03-15', risk: 'MEDIUM RISK', riskColor: 'text-accent-amber', status: 'ACTIVE', statusColor: 'text-accent-teal' },
  { name: 'Underwriting Risk Model', version: 'v4.0.2', provider: 'Internal (On-Premise)', date: '2026-02-28', lastAudit: '2026-02-28', risk: 'HIGH RISK', riskColor: 'text-accent-red', status: 'REVIEW REQUIRED', statusColor: 'text-accent-amber' },
  { name: 'Fraud Detection Agent', version: 'v1.1.0', provider: 'Google Vertex AI', date: '2026-03-12', lastAudit: '2026-03-12', risk: 'LOW RISK', riskColor: 'text-accent-teal', status: 'ACTIVE', statusColor: 'text-accent-teal' },
];

const riskScores = [
  { label: 'Operational Resilience', value: 94, color: 'bg-accent-teal' },
  { label: 'Data Governance', value: 88, color: 'bg-accent-blue' },
  { label: 'Third-Party Risk', value: 91, color: 'bg-accent-blue' },
];

export default function ModelInventory() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-foreground">Enterprise Model Inventory</h2>
          <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-8">
            <Plus className="w-3 h-3 mr-1" /> Register Agent
          </Button>
        </div>
        <p className="text-xs text-text-secondary mb-4">OSFI E-21 compliant registry of all deployed AI agents and models.</p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-widest text-text-secondary">
                <th className="text-left py-2 pr-4">Agent</th>
                <th className="text-left py-2 pr-4 hidden md:table-cell">Provider / Region</th>
                <th className="text-left py-2 pr-4 hidden sm:table-cell">Last Audit</th>
                <th className="text-left py-2 pr-4">Risk Tier</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface-raised/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-foreground">{a.name} <span className="text-text-muted-custom text-[10px] bg-surface-raised px-1.5 py-0.5 rounded ml-1">{a.version}</span></div>
                    <div className="text-[10px] text-text-secondary mt-0.5 hidden md:hidden">◆ {a.provider}</div>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary hidden md:table-cell">{a.provider}</td>
                  <td className="py-3 pr-4 text-text-secondary hidden sm:table-cell">{a.lastAudit}</td>
                  <td className="py-3 pr-4"><span className={`font-semibold uppercase tracking-wider text-[10px] ${a.riskColor}`}>{a.risk}</span></td>
                  <td className="py-3 pr-4"><span className={`font-semibold uppercase tracking-wider text-[10px] ${a.statusColor}`}>{a.status}</span></td>
                  <td className="py-3"><ChevronRight className="w-4 h-4 text-text-muted-custom" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model Risk Assessment */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-1">Model Risk Assessment</h3>
          <p className="text-[11px] text-text-secondary mb-4">Automated OSFI E-21 scoring for your entire AI portfolio.</p>
          <div className="space-y-3">
            {riskScores.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary uppercase tracking-wider">{s.label}</span>
                  <span className="text-xs font-bold text-foreground">{s.value}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Statistics */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-1">Inventory Statistics</h3>
          <p className="text-[11px] text-text-secondary mb-4">Live counts across your agent portfolio.</p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Agents" value="12" color="text-foreground" />
            <StatCard label="High Risk" value="1" color="text-accent-red" />
            <StatCard label="Pending Audit" value="2" color="text-accent-amber" />
            <StatCard label="Compliant" value="9" color="text-accent-teal" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-surface-raised border border-border rounded-lg p-4 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
