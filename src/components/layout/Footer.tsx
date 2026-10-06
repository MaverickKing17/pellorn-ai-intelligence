import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIndustry } from '@/context/IndustryContext';

export default function Footer() {
  const { config } = useIndustry();
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-accent-teal" />
            <span className="text-sm font-bold text-foreground">Pellorn</span>
          </div>
          <p className="text-xs text-text-secondary">{config.footerTagline}</p>
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-text-secondary mb-3">Regulatory Frameworks</h4>
          <ul className="space-y-1.5 text-xs text-accent-blue">
            {config.regulatoryLinks.map(link => (
              <li key={link} className="hover:underline cursor-pointer">{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-text-secondary mb-3">Security Resources</h4>
          <ul className="space-y-1.5 text-xs text-accent-blue">
            <li className="hover:underline cursor-pointer">Threat Intelligence</li>
            <li className="hover:underline cursor-pointer">Incident Response</li>
            <li className="hover:underline cursor-pointer">AI Risk Framework</li>
            <li className="hover:underline cursor-pointer">Documentation</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-text-secondary mb-3">Enterprise Support</h4>
          <p className="text-xs text-text-secondary mb-3">24/7 SOC team support for critical incidents</p>
          <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-8">
            Contact SOC Team
          </Button>
        </div>
      </div>
    </footer>
  );
}
