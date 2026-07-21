'use client';

import { useState } from 'react';
import { Share2, Mail } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

// Custom SVG Icons for brands
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.44H7.078v-3.487h3.047V9.43c0-3.014 1.792-4.68 4.533-4.68 1.313 0 2.686.235 2.686.235v2.966h-1.513c-1.49 0-1.955.928-1.955 1.881v2.26h3.328l-.532 3.487h-2.796v8.44C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  // Build an absolute, shareable URL once. Prefer the configured public app URL
  // so it is correct during SSR and first paint; fall back to the current origin.
  const [shareUrl] = useState<string>(() => {
    const path = `/packages/${slug}`;
    const base =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    return base ? `${base.replace(/\/$/, '')}${path}` : path;
  });

  const trackShare = (platform: string) => {
    // Emit a real analytics event when a tracker is present (GA gtag or GTM
    // dataLayer); silently no-op otherwise so this works with or without one.
    if (typeof window === 'undefined') return;
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'share', { method: platform, content_type: 'package', item_id: slug });
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'share', method: platform, content_type: 'package', item_id: slug });
    }
  };

  const whatsappMessage = encodeURIComponent(`Check out this amazing tour package: *${title}* ➔ ${shareUrl}`);
  const whatsappLink = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const emailSubject = encodeURIComponent(`Amazing Tour Package: ${title}`);
  const emailBody = encodeURIComponent(`Hi,\n\nI found this incredible tour package and wanted to share it with you:\n\n${title}\nLink: ${shareUrl}\n\nLet me know what you think!`);
  const emailLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="flex flex-col gap-3 py-4 border-t border-brand-light/50 w-full mt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Share2 className="w-4 h-4 text-brand-medium" />
        <span>Share This Package</span>
      </div>
      <div className="flex items-center gap-3 w-full">
        {/* WhatsApp Share */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare('whatsapp')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-share-whatsapp hover:bg-share-whatsapp-dark text-white shadow-sm hover:shadow transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon />
        </a>

        {/* Facebook Share */}
        <a
          href={facebookLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare('facebook')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-share-facebook hover:bg-share-facebook-dark text-white shadow-sm hover:shadow transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>

        {/* Email Share */}
        <a
          href={emailLink}
          onClick={() => trackShare('email')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-sage hover:bg-brand-dark text-white shadow-sm hover:shadow transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
          title="Share via Email"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
