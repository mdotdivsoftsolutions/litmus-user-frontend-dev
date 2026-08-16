import Link from "next/link";

interface FooterNavColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

export function FooterNavColumn({ title, links }: FooterNavColumnProps) {
  return (
    <div>
      <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">{title}</h4>
      <div className="space-y-2 text-xs text-slate-500">
        {links.map((link, i) => (
          <Link 
            key={i} 
            href={link.href} 
            className="block hover:text-brand-primary hover:translate-x-1 transition-all"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
