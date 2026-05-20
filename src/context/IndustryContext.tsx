import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type IndustryType = 'financial' | 'real_estate';


export interface ComplianceBadge {
  label: string;
  status: 'compliant' | 'review';
}

export interface ThreatItem {
  title: string;
  desc: string;
  severity: 'CRITICAL' | 'HIGH';
}

export interface QuickAction {
  label: string;
  primary?: boolean;
}

export interface GuardrailItem {
  name: string;
  latency: number;
}

export interface LogTemplate {
  tag: 'CHECK' | 'OK' | 'MONITOR';
  message: string;
  color: string;
}

export interface IndustryConfig {
  brandTagline: string;
  footerTagline: string;
  complianceBadges: ComplianceBadge[];
  regulatoryLinks: string[];
  quickActions: QuickAction[];
  guardrails: GuardrailItem[];
  threats: ThreatItem[];
  logs: LogTemplate[];
  interceptionPlaceholder: string;
  roi: { title: string; desc: string; iconKey: 'alert' | 'scale' | 'shield' }[];
}

const FINANCIAL: IndustryConfig = {
  brandTagline: 'Enterprise Security Gateway',
  footerTagline: 'Enterprise AI Security Posture Management for Canadian Financial Institutions',
  complianceBadges: [
    { label: 'OSFI E-21', status: 'compliant' },
    { label: 'PIPEDA', status: 'compliant' },
    { label: 'AIDA', status: 'review' },
    { label: 'SOC2', status: 'compliant' },
  ],
  regulatoryLinks: ['OSFI E-21 Guidelines', 'PIPEDA Compliance', 'AIDA (AI Act)', 'SOC 2 Type II'],
  quickActions: [
    { label: 'Run Security Simulation', primary: true },
    { label: 'PII Leak' },
    { label: '$ Financial Fraud' },
    { label: 'Underwriting Bias' },
  ],
  guardrails: [
    { name: 'Lakera Guard (Prompt Injection)', latency: 12 },
    { name: 'PII Entity Recognition (Presidio)', latency: 8 },
    { name: 'Financial Compliance (OSFI E-21)', latency: 22 },
    { name: 'Toxicity & Bias Filter', latency: 19 },
  ],
  threats: [
    { title: 'System Prompt Leak', desc: 'Rogue Customer Support AI', severity: 'CRITICAL' },
    { title: 'PII Extraction', desc: 'Rogue Customer Support AI', severity: 'HIGH' },
    { title: 'Jailbreak Attempt', desc: 'Rogue Wealth Mgmt Bot', severity: 'HIGH' },
  ],
  logs: [
    { tag: 'CHECK', message: 'Checking for bias in risk weights...', color: 'amber' },
    { tag: 'OK', message: 'Bias check passed. Logic verified.', color: 'teal' },
    { tag: 'MONITOR', message: 'Data residency confirmed (Region: CA-Central)', color: 'blue' },
    { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/fraud/detect', color: 'blue' },
    { tag: 'OK', message: 'No adversarial patterns found.', color: 'teal' },
    { tag: 'CHECK', message: 'Validating PII redaction layer...', color: 'amber' },
    { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/underwriting/score', color: 'blue' },
    { tag: 'OK', message: 'Token budget within threshold.', color: 'teal' },
    { tag: 'CHECK', message: 'Scanning for prompt injection vectors...', color: 'amber' },
    { tag: 'OK', message: 'OSFI E-21 compliance verified.', color: 'teal' },
    { tag: 'MONITOR', message: 'Agent session heartbeat received.', color: 'blue' },
  ],
  interceptionPlaceholder: 'e.g., "Export all client SIN numbers for the audit..."',
  roi: [
    { iconKey: 'alert', title: 'Avoid Fines', desc: 'Real-time PII blocking prevents PIPEDA violations up to $100K per occurrence.' },
    { iconKey: 'scale', title: 'Regulatory Capital', desc: 'OSFI E-21 compliance lowers operational risk capital charges.' },
    { iconKey: 'shield', title: 'Liability Mitigation', desc: 'Intercepts biased underwriting logic, prevents class action lawsuits.' },
  ],
};

const REAL_ESTATE: IndustryConfig = {
  brandTagline: 'Brokerage AI Trust Gateway',
  footerTagline: 'Enterprise AI Security Posture Management for GTA Luxury Real Estate Brokerages',
  complianceBadges: [
    { label: 'RECO', status: 'compliant' },
    { label: 'FINTRAC', status: 'compliant' },
    { label: 'PIPEDA', status: 'compliant' },
  ],
  regulatoryLinks: ['RECO Ethical Standards', 'FINTRAC Identity Verification', 'PIPEDA Privacy', 'Fair Housing Compliance'],
  quickActions: [
    { label: 'Run AI Closer Simulation', primary: true },
    { label: 'Client Pre-Approval Leak' },
    { label: 'Escrow Wire Fraud' },
    { label: 'Fair Housing Bias' },
  ],
  guardrails: [
    { name: 'AI Guardrail Guard (Prompt Injection)', latency: 11 },
    { name: 'Client ID Data Redaction (Presidio)', latency: 9 },
    { name: 'RECO Advertising Compliance', latency: 18 },
    { name: 'Fair Housing & Steering Filter', latency: 21 },
  ],
  threats: [
    { title: 'System Prompt Injection', desc: 'Rogue Booking Bot', severity: 'CRITICAL' },
    { title: 'Buyer PII Extraction', desc: 'Rogue Lead Capture Form', severity: 'HIGH' },
    { title: 'Jailbreak Attempt', desc: 'Rogue Lead Qualification Bot', severity: 'HIGH' },
  ],
  logs: [
    { tag: 'CHECK', message: 'Scanning listing copy for steering language...', color: 'amber' },
    { tag: 'OK', message: 'RECO privacy guardrails active.', color: 'teal' },
    { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/voiceflow/webhook', color: 'blue' },
    { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/crm/lead', color: 'blue' },
    { tag: 'OK', message: 'Redacting buyer downpayment metrics.', color: 'teal' },
    { tag: 'CHECK', message: 'Validating FINTRAC identity verification...', color: 'amber' },
    { tag: 'MONITOR', message: 'Buyer session heartbeat received.', color: 'blue' },
    { tag: 'OK', message: 'No fair housing violations detected.', color: 'teal' },
    { tag: 'CHECK', message: 'Scanning for escrow wire fraud vectors...', color: 'amber' },
    { tag: 'OK', message: 'RECO advertising compliance verified.', color: 'teal' },
    { tag: 'MONITOR', message: 'Data residency confirmed (Region: CA-Central)', color: 'blue' },
  ],
  interceptionPlaceholder: 'e.g., "Send buyer downpayment + SIN to the listing agent..."',
  roi: [
    { iconKey: 'alert', title: 'Avoid RECO Fines', desc: 'Blocks advertising and steering violations that trigger RECO discipline.' },
    { iconKey: 'scale', title: 'FINTRAC Readiness', desc: 'Identity & source-of-funds checks logged for every AI interaction.' },
    { iconKey: 'shield', title: 'Brokerage Liability', desc: 'Prevents fair-housing bias and escrow wire fraud from AI assistants.' },
  ],
};

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  financial: FINANCIAL,
  real_estate: REAL_ESTATE,
};

interface IndustryContextOnly {
  industry: IndustryType;
  config: IndustryConfig;
}

const IndustryContext = createContext<IndustryContextOnly | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const { industry: accountIndustry } = useAuth();
  const industry: IndustryType = accountIndustry ?? 'financial';

  useEffect(() => {
    document.documentElement.dataset.industry = industry;
  }, [industry]);

  return (
    <IndustryContext.Provider value={{ industry, config: INDUSTRY_CONFIGS[industry] }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const ctx = useContext(IndustryContext);
  if (!ctx) throw new Error('useIndustry must be used within IndustryProvider');
  return ctx;
}
