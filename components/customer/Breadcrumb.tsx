import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-5 text-xs text-slate-700 sm:px-8">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="h-3 w-3 text-slate-300" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-dark">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-brand-dark">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
