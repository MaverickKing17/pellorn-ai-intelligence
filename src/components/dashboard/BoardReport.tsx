import { FileText, Download, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const threatBreakdown = [
  { month: 'Oct', 'Prompt Injection': 180, 'PII Leakage': 90, Jailbreak: 45, 'Tool Misuse': 30 },
  { month: 'Nov', 'Prompt Injection': 220, 'PII Leakage': 110, Jailbreak: 60, 'Tool Misuse': 25 },
  { month: 'Dec', 'Prompt Injection': 250, 'PII Leakage': 85, Jailbreak: 55, 'Tool Misuse': 40 },
  { month: 'Jan', 'Prompt Injection': 310, 'PII Leakage': 130, Jailbreak: 70, 'Tool Misuse': 50 },
  { month: 'Feb', 'Prompt Injection': 380, 'PII Leakage': 150, Jailbreak: 80, 'Tool Misuse': 35 },
  { month: 'Mar', 'Prompt Injection': 420, 'PII Leakage': 140, Jailbreak: 75, 'Tool Misuse': 45 },
];

const frameworks = [
  { name: 'OSFI E-21', sub: 'AI Model Governance', status: 'COMPLIANT', score: 96, color: 'bg-accent-teal', detail: 'Next audit: Apr 15, 2026' },
  { name: 'PIPEDA', sub: 'Data Protection', status: 'COMPLIANT', score: 98, color: 'bg-accent-teal', detail: 'Last reviewed: Mar 10, 2026' },
  { name: 'AIDA (AI Act)', sub: 'Federal AI Legislation', status: 'UNDER REVIEW', score: 81, color: 'bg-accent-amber', detail: '2 controls pending' },
  { name: 'SOC 2 Type II', sub: 'Security & Availability', status: 'COMPLIANT', score: 94, color: 'bg-accent-blue', detail: 'Certified: Jan 2026' },
];

export default function BoardReport() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-accent-blue" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Executive Security Report</h2>
              <p className="text-xs text-text-secondary">March 2026 • Global Enterprise • Canadian Banking Infrastructure</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border text-foreground text-xs h-8">
            <Download className="w-3 h-3 mr-1" /> Export PDF
          </Button>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Threats Blocked" value="1,847" sub="▲ +23% vs last month" subColor="text-accent-red" />
          <MetricCard label="Compliance Score" value="94.2%" sub="▲ +2.1% this week" subColor="text-accent-teal" />
          <MetricCard label="Financial Risk Avoided" value="$2.3M" sub="CAD • Est. breach cost avoided" subColor="text-accent-amber" />
          <MetricCard label="Agents Monitored" value="14" sub="Across 3 departments" subColor="text-accent-blue" />
        </div>
      </div>

      {/* Compliance Posture */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Compliance Posture by Framework</h3>
        <div className="space-y-4">
          {frameworks.map((f, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-40 flex-shrink-0">
                <p className="text-xs font-semibold text-foreground">{f.name}</p>
                <p className="text-[10px] text-text-secondary">{f.sub}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${
                f.status === 'COMPLIANT' ? 'bg-accent-teal/10 text-accent-teal' : 'bg-accent-amber/10 text-accent-amber'
              }`}>
                {f.status}
              </span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.score}%` }} />
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-foreground">{f.score}%</span>
                <p className="text-[10px] text-text-secondary">{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Narrative */}
        <div className="bg-card border border-border rounded-xl p-5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> AI Narrative
          </span>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            In March 2026, Bastion intercepted <span className="text-foreground font-semibold">1,847 security events</span> across <span className="text-foreground font-semibold">14 active AI agents</span> deployed within Global Enterprise's Canadian banking infrastructure. The most significant threat category was <span className="text-foreground font-semibold">prompt injection attempts</span> targeting the Retail Banking Assistant, representing 43% of all blocked events. The Underwriting Risk Model flagged <span className="text-foreground font-semibold">3 behavioral anomalies</span> requiring manual review, one of which triggered an automated session termination under the Circuit Breaker protocol.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Overall compliance posture improved 2.1% month-over-month, with OSFI E-21 and PIPEDA frameworks maintaining full certification. Estimated financial risk avoided: <span className="text-foreground font-semibold">$2.3M CAD</span>.
          </p>
          <Button variant="outline" size="sm" className="border-border text-text-secondary text-xs h-8">
            <RefreshCw className="w-3 h-3 mr-1" /> Regenerate Summary
          </Button>
        </div>

        {/* Monthly Threat Breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Monthly Threat Breakdown — Last 6 Months</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatBreakdown}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(207, 29%, 40%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(207, 29%, 40%)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(210, 53%, 17%)', border: '1px solid hsl(207, 48%, 22%)', borderRadius: '8px', fontSize: '11px', color: 'hsl(210, 27%, 93%)' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Prompt Injection" fill="hsl(0, 79%, 58%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="PII Leakage" fill="hsl(34, 82%, 54%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Jailbreak" fill="hsl(211, 79%, 57%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Tool Misuse" fill="hsl(246, 72%, 67%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor: string }) {
  return (
    <div className="bg-surface-raised border border-border rounded-lg p-4">
      <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className={`text-[10px] ${subColor} mt-1`}>{sub}</p>
    </div>
  );
}
