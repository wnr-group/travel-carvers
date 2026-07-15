'use client';

import { useState, type ComponentType, type SyntheticEvent, type SVGProps } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';


interface FooterLink {
  label: string;
  href: string;
}

const QUICK_LINKS: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Packages', href: '/packages' },
  { label: 'India Tours', href: '/packages?region=india' },
  { label: 'International Tours', href: '/packages?region=international' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const POPULAR_DESTINATIONS: FooterLink[] = [
  'Bali',
  'Thailand',
  'Vietnam',
  'Singapore',
  'Malaysia',
  'Dubai',
  'Europe',
  'Kashmir',
].map((name) => ({ label: name, href: `/packages?destination=${name.toLowerCase()}` }));


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

const YoutubeIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface SocialLink {
  label: string;
  href: string;
  Icon: IconType;
}

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
];

interface ContactItem {
  Icon: IconType;
  label: string;
  value: string;
  href?: string;
}

const CONTACT_DETAILS: ContactItem[] = [
  { Icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { Icon: Mail, label: 'Email', value: 'info@travelcarvers.com', href: 'mailto:info@travelcarvers.com' },
  { Icon: MapPin, label: 'Office', value: 'MG Road, Bengaluru, Karnataka 560001, India' },
  { Icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{children}</h3>
  );
}

function FooterNavLink({ link }: { link: FooterLink }) {
  return (
    <Link
      href={link.href}
      className="rounded text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
    >
      {link.label}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault(); // No backend yet — never reload the page.

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setEmail('');
    toast.success('Thanks for subscribing! Check your inbox to confirm.');
  };

  return (
    <footer aria-labelledby="footer-heading" className="bg-gradient-brand-navbar shadow-lg sticky text-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ---------------- Column 1: Company ---------------- */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-3" aria-label="Travel Carvers home">
              <Image
                src="/logo.png"
                alt="Travel Carvers"
                width={48}
                height={48}
                className="h-12 w-auto object-contain brightness-110"
              />
              <span className="text-xl font-bold text-white">Travel Carvers</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">
              Crafting unforgettable journeys across India and the world. From dreamy beaches to
              soaring mountains, we design travel experiences made just for you.
            </p>

            <ul className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-brand-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Column 2: Quick Links ---------------- */}
          <nav aria-label="Quick links">
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------- Column 3: Popular Destinations ---------------- */}
          <nav aria-label="Popular destinations">
            <ColumnHeading>Popular Destinations</ColumnHeading>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {POPULAR_DESTINATIONS.map((link) => (
                <li key={link.href}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------- Column 4: Newsletter + Contact ---------------- */}
          <div>
            <ColumnHeading>Newsletter</ColumnHeading>
            <p className="mb-3 text-sm text-white/70">
              Get travel inspiration and exclusive deals in your inbox.
            </p>

            <form onSubmit={handleSubscribe} noValidate className="mb-8">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@example.com"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 transition focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/40"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-darkest px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light active:scale-[0.99]"
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {error && (
                <p id="newsletter-error" role="alert" className="mt-2 text-xs text-red-300">
                  {error}
                </p>
              )}
            </form>

            <ColumnHeading>Contact</ColumnHeading>
            <ul className="flex flex-col gap-3">
              {CONTACT_DETAILS.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3 text-sm text-white/70">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden="true" />
                  {href ? (
                    <a
                      href={href}
                      className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
                    >
                      <span className="sr-only">{label}: </span>
                      {value}
                    </a>
                  ) : (
                    <span>
                      <span className="sr-only">{label}: </span>
                      {value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------- Bottom bar ---------------- */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>
            &copy; {currentYear} Travel Carvers. All Rights Reserved.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
            >
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
