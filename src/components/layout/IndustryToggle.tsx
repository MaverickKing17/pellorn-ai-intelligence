import { Building2, Home } from 'lucide-react';
import { useIndustry } from '@/context/IndustryContext';

export default function IndustryToggle() {
  const { industry, setIndustry } = useIndustry();
  const isRE = industry === 'real_estate';
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border bg-surface-raised/60 p-0.5"
      title="Dev: Toggle industry vertical"
    >
      <button
        onClick={() => setIndustry('financial')}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          !isRE ? 'bg-accent-teal/20 text-accent-teal' : 'text-text-secondary hover:text-foreground'
        }`}
      >
        <Building2 className="w-3 h-3" /> Financial
      </button>
      <button
        onClick={() => setIndustry('real_estate')}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          isRE ? 'bg-accent-amber/20 text-accent-amber' : 'text-text-secondary hover:text-foreground'
        }`}
      >
        <Home className="w-3 h-3" /> Real Estate
      </button>
    </div>
  );
}
