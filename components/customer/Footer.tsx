'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { usePublicSiteSettings } from '@/lib/hooks/useSiteSettings';
import { useNavCategories } from '@/lib/hooks/useNavCategories';
import { useCategories } from '@/lib/hooks/useCategories';
import { useDestinations } from '@/lib/hooks/useDestinations';
import AllCategoriesModal from '@/components/customer/AllCategoriesModal';

interface FooterLink {
  label: string;
  href: string;
}

const MAX_FOOTER_CATEGORIES = 6;
const MAX_FOOTER_DESTINATIONS = 6;

const QUICK_LINKS: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Packages', href: '/packages' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Visa Services', href: '/visa' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const FacebookIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.44H7.078v-3.487h3.047V9.43c0-3.014 1.792-4.68 4.533-4.68 1.313 0 2.686.235 2.686.235v2.966h-1.513c-1.49 0-1.955.928-1.955 1.881v2.26h3.328l-.532 3.487h-2.796v8.44C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const InstagramIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LinkedinIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const TwitterIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type SocialKey = 'facebook_url' | 'instagram_url' | 'twitter_url' | 'linkedin_url';

/** Social channels, in display order. Each maps to a site-settings column and
 *  is only rendered when the admin has set a URL for it. */
const SOCIAL_DEFS: { key: SocialKey; label: string; Icon: IconType }[] = [
  { key: 'facebook_url', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram_url', label: 'Instagram', Icon: InstagramIcon },
  { key: 'twitter_url', label: 'Twitter', Icon: TwitterIcon },
  { key: 'linkedin_url', label: 'LinkedIn', Icon: LinkedinIcon },
];

interface ContactItem {
  Icon: IconType;
  label: string;
  value: string;
  href?: string;
}


function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      {children}
    </h3>
  );
}

function FooterNavLink({ link }: { link: FooterLink }) {
  return (
    <Link
      href={link.href}
      className="group inline-flex items-center gap-1.5 text-sm text-white/75 transition-all duration-300 hover:text-white hover:translate-x-1"
    >
      <span className="text-white/40 group-hover:text-amber-400 transition-colors">›</span>
      <span>{link.label}</span>
    </Link>
  );
}

function ExploreRow({
  label,
  links,
  isLoading,
  viewAll,
  onViewAll,
}: {
  label: string;
  links: FooterLink[];
  isLoading: boolean;
  viewAll: FooterLink;
  onViewAll?: () => void;
}) {
  const viewAllClasses =
    'ml-1 text-xs font-bold uppercase tracking-wider text-amber-300 transition-colors hover:text-amber-200';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:w-28">
        {label}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {isLoading ? (
          <span className="sr-only">Loading {label.toLowerCase()}</span>
        ) : (
          links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/85 transition-colors hover:border-amber-400/60 hover:bg-white/15 hover:text-white"
            >
              {link.label}
            </Link>
          ))
        )}

        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="h-7 w-24 animate-pulse rounded-full bg-white/10"
            />
          ))}

        {onViewAll ? (
          <button type="button" onClick={onViewAll} className={viewAllClasses}>
            {viewAll.label} →
          </button>
        ) : (
          <Link href={viewAll.href} className={viewAllClasses}>
            {viewAll.label} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Contact details + social links are admin-managed (Admin → Settings) and read
  // from the single site-settings row, so the footer stays in sync with them.
  const { data: siteSettings } = usePublicSiteSettings();

  const socialLinks = SOCIAL_DEFS
    .map(({ key, label, Icon }) => ({ label, Icon, href: siteSettings?.[key]?.trim() ?? '' }))
    .filter((link) => link.href.length > 0);

  const contactDetails: ContactItem[] = ([
    siteSettings?.contact_phone
      ? {
          Icon: Phone,
          label: 'Phone',
          value: siteSettings.contact_phone,
          href: `tel:${siteSettings.contact_phone.replace(/[^\d+]/g, '')}`,
        }
      : null,
    siteSettings?.contact_email
      ? {
          Icon: Mail,
          label: 'Email',
          value: siteSettings.contact_email,
          href: `mailto:${siteSettings.contact_email}`,
        }
      : null,
    siteSettings?.address
      ? { Icon: MapPin, label: 'Office', value: siteSettings.address }
      : null,
    { Icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
  ] as (ContactItem | null)[]).filter((item): item is ContactItem => item !== null);

  // The same categories the navbar shows, so the two menus never drift apart.
  const { data: navCategories, isLoading: categoriesLoading } = useNavCategories();
  const { data: destinations, isLoading: destinationsLoading } = useDestinations();

  const { data: allCategories } = useCategories();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoryLinks: FooterLink[] = (navCategories ?? [])
    .slice(0, MAX_FOOTER_CATEGORIES)
    .map((category) => ({
      label: category.name,
      href: `/categories/${category.slug}`,
    }));

  // Real destination pages, not the query-string filter the old hardcoded list used.
  const destinationLinks: FooterLink[] = (destinations ?? [])
    .slice(0, MAX_FOOTER_DESTINATIONS)
    .map((destination) => ({
      label: destination.name,
      href: `/destinations/${destination.slug}`,
    }));

  return (
    <footer aria-labelledby="footer-heading" className="bg-brand-footer text-white relative overflow-hidden border-t border-white/10">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          
          {/* ---------------- Column 1: Company Info (4 Cols) ---------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Link href="/" className="mb-4 inline-flex items-center gap-3 group" aria-label="Travel Carvers home">
                <Image
                  src="/logo.png"
                  alt="Travel Carvers"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/50 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <span className="text-xl font-black text-white tracking-wide">Travel Carvers</span>
                  <p className="text-[11px] text-white/70 font-medium">Explore Your Next Adventure</p>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-white/80 font-medium max-w-sm mt-3">
                Crafting unforgettable journeys across India and the world. From dreamy beaches to soaring mountains, we design travel experiences tailored precisely to your soul.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-3">Connect With Us</p>
              <ul className="flex items-center gap-2.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-brand-accent hover:text-brand-forest shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------------- Column 2: Quick Links (4 Cols) ---------------- */}
          <nav aria-label="Quick links" className="lg:col-span-4">
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="flex flex-col gap-2.5 mt-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------- Column 3: Contact (4 Cols) ---------------- */}
          <div className="lg:col-span-4">
            <ColumnHeading>Get In Touch</ColumnHeading>
            <ul className="flex flex-col gap-3 text-xs text-white/80 mt-2 font-medium">
              {contactDetails.map(({ Icon, label, value, href }) => (
                <li key={value} className="flex items-start gap-2.5">
                  <Icon className="h-3.5 w-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-white/50">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="hover:text-white transition-colors underline decoration-white/30"
                      >
                        {value}
                      </a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* -------- Explore band: a taste of what we run, not the whole index -------- */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Explore
          </p>

          <div className="flex flex-col gap-4">
            <ExploreRow
              label="Categories"
              links={categoryLinks}
              isLoading={categoriesLoading}
              viewAll={{ label: 'All categories', href: '/packages' }}
              onViewAll={() => setShowAllCategories(true)}
            />
            <ExploreRow
              label="Destinations"
              links={destinationLinks}
              isLoading={destinationsLoading}
              viewAll={{ label: 'All destinations', href: '/destinations' }}
            />
          </div>
        </div>
      </div>

      {/* ---------------- Bottom Bar ---------------- */}
      <div className="border-t border-white/10 bg-brand-footer-deep">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8 py-6 text-xs text-white/70 sm:flex-row sm:justify-between font-medium">
          <p>
            &copy; {currentYear} Travel Carvers. All Rights Reserved. Crafted with care for global explorers.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>

      {/* Portals to <body>, so the dark footer's stacking context doesn't trap it. */}
      <AllCategoriesModal
        open={showAllCategories}
        categories={allCategories ?? []}
        onClose={() => setShowAllCategories(false)}
      />
    </footer>
  );
}