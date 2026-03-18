import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

const driftData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 17 + i);
  const baseline = 50;
  let activity = baseline + Math.random() * 15 - 7;
  if (i === 14) activity = 85; // Unusual API Query Volume
  if (i === 21) activity = 82; // PII Probe Detected
  return {
    date: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`,
    activity: Math.round(activity),
    baseline,
  };
});

const anomalyEvents = [
  { timestamp: '2026-03-03 14:22:11', agent: 'Underwriting Risk Model', event: 'Unusual API Query Volume', severity: 'CRITICAL', delta: '+348%', action: 'Session flagged for review' },
  { timestamp: '2026-03-10 09:14:44', agent: 'Underwriting Risk Model', event: 'PII Probe Detected', severity: 'CRITICAL', delta: '+290%', action: 'Session terminated' },
];

export default function BehavioralDrift() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-bold text-foreground mb-1">Agent Behavioral Drift Analysis</h2>
        <p className="text-xs text-text-secondary mb-4">Real-time deviation from established behavioral baselines across your AI agent fleet.</p>

        <div className="flex flex-wrap gap-3 mb-4">
          <select className="bg-surface-raised border border-border text-xs text-foreground rounded-lg px-3 py-2 outline-none">
            <option>Underwriting Risk Model ▾</option>
          </select>
          <select className="bg-surface-raised border border-border text-xs text-foreground rounded-lg px-3 py-2 outline-none">
            <option>Last 30 days ▾</option>
          </select>
        </div>

        <h3 className="text-sm font-bold text-foreground mb-3">30-Day Drift Chart — Activity Score vs. Baseline</h3>
        <div className="flex gap-4 mb-2 text-[10px] text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent-teal/40" /> Baseline envelope</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent-teal" /> Live activity</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-red" /> Anomaly event</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={driftData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162, 83%, 34%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162, 83%, 34%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(207, 29%, 40%)' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(207, 29%, 40%)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(210, 53%, 17%)', border: '1px solid hsl(207, 48%, 22%)', borderRadius: '8px', fontSize: '11px', color: 'hsl(210, 27%, 93%)' }}
              />
              <ReferenceLine y={50} stroke="hsl(162, 83%, 34%)" strokeDasharray="5 5" strokeOpacity={0.4} />
              <Area type="monotone" dataKey="baseline" stroke="none" fill="hsl(162, 83%, 34%)" fillOpacity={0.08} />
              <Area type="monotone" dataKey="activity" stroke="hsl(162, 83%, 34%)" strokeWidth={2} fill="url(#tealGrad)" />
              <ReferenceDot x={driftData[14]?.date} y={85} r={6} fill="hsl(0, 79%, 58%)" stroke="none" />
              <ReferenceDot x={driftData[21]?.date} y={82} r={6} fill="hsl(0, 79%, 58%)" stroke="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Event Log */}
      <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-widest text-text-secondary">
              <th className="text-left py-2 pr-4">Timestamp</th>
              <th className="text-left py-2 pr-4">Agent</th>
              <th className="text-left py-2 pr-4">Event Type</th>
              <th className="text-left py-2 pr-4">Severity</th>
              <th className="text-left py-2 pr-4">Baseline Delta</th>
              <th className="text-left py-2">Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {anomalyEvents.map((e, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 pr-4 text-text-secondary font-mono">{e.timestamp}</td>
                <td className="py-3 pr-4 text-foreground font-semibold">{e.agent}</td>
                <td className="py-3 pr-4 text-foreground">{e.event}</td>
                <td className="py-3 pr-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-red bg-accent-red/10 px-2 py-0.5 rounded-full">{e.severity}</span>
                </td>
                <td className="py-3 pr-4 text-accent-amber font-semibold">{e.delta}</td>
                <td className="py-3 text-text-secondary">{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drift Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Anomalies This Month" value="3" color="text-accent-red" />
        <SummaryCard label="Avg Baseline Deviation" value="12.4%" color="text-accent-amber" />
        <SummaryCard label="Sessions Terminated" value="1" color="text-accent-red" />
        <SummaryCard label="Current Risk Score" value="67/100" color="text-accent-amber" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
