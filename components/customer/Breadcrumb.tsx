import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  tone?: 'default' | 'light';
}

export default function Breadcrumb({ items, tone = 'default' }: BreadcrumbProps) {
  const isLight = tone === 'light';

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        isLight
          ? 'text-xs text-white/70'
          : 'mx-auto max-w-7xl px-5 pt-5 text-xs text-slate-700 sm:px-8'
      }
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className={`h-3 w-3 ${isLight ? 'text-white/40' : 'text-slate-300'}`}
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={isLight ? 'transition-colors hover:text-white' : 'hover:text-brand-dark'}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={`font-medium ${isLight ? 'text-white' : 'text-brand-dark'}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
