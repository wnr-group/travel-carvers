"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Clause = {
  label: string;
  body: string;
};

type Section = {
  id: string;
  waypoint: string; // short label for the trail marker
  title: string;
  intro?: string;
  clauses: Clause[];
  notice?: { kind: "info" | "warning"; text: string };
};

const SECTIONS: Section[] = [
  {
    id: "introduction",
    waypoint: "Introduction",
    title: "1. Introduction",
    intro:
      "Travel Carvers is committed to protecting your personal data and respecting your privacy.",
    clauses: [
      {
        label: "1.1",
        body: "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (travelcarvers.com) or book travel services with us.",
      },
      {
        label: "1.2",
        body: "By using our website and services, you consent to the data practices described in this policy. If you do not agree with these practices, please discontinue use of our site.",
      },
    ],
  },
  {
    id: "collection",
    waypoint: "Data Collection",
    title: "2. Information We Collect",
    clauses: [
      {
        label: "2.1",
        body: "Personal Identification Info: We collect your name, email address, phone number, and billing/shipping details when you submit an inquiry, book a package, or subscribe to our newsletter.",
      },
      {
        label: "2.2",
        body: "Travel Details: We collect passport information, dietary requirements, health/medical conditions (only as necessary for safety), and special requests related to your tour bookings.",
      },
      {
        label: "2.3",
        body: "Automatically Collected Data: Our servers automatically capture technical info including your IP address, browser type, device information, operating system, and details about your browsing behavior on our website.",
      },
    ],
  },
  {
    id: "usage",
    waypoint: "Data Usage",
    title: "3. How We Use Your Information",
    clauses: [
      {
        label: "3.1",
        body: "To fulfill bookings and arrange travel itineraries with airlines, hotels, transport providers, and local guides.",
      },
      {
        label: "3.2",
        body: "To communicate with you regarding booking confirmations, updates, customer support requests, and promotional offers (where opted in).",
      },
      {
        label: "3.3",
        body: "To improve our website functionality, analyze user trends, optimize user interface, and ensure website security.",
      },
    ],
  },
  {
    id: "cookies",
    waypoint: "Cookies",
    title: "4. Cookies and Tracking",
    notice: {
      kind: "info",
      text: "You can adjust your browser settings to refuse cookies, but some parts of our website may not function correctly as a result.",
    },
    clauses: [
      {
        label: "4.1",
        body: "We use cookies to analyze web traffic, remember user choices, and track site performance. This helps us customize your browsing experience.",
      },
      {
        label: "4.2",
        body: "Third-party analytics tools (e.g. Google Analytics) may set tracking cookies on your device to gather aggregated behavior reports.",
      },
    ],
  },
  {
    id: "security",
    waypoint: "Data Security",
    title: "5. Data Security",
    clauses: [
      {
        label: "5.1",
        body: "We implement industry-standard encryption protocols (SSL/TLS) to secure data transmissions across our platform.",
      },
      {
        label: "5.2",
        body: "Access to your personal information is restricted to authorized employees and verified partners who require the details to execute tour bookings.",
      },
      {
        label: "5.3",
        body: "While we take rigorous precautions, no transmission method over the internet is 100% secure. We cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "third-parties",
    waypoint: "Third Parties",
    title: "6. Third-Party Services",
    clauses: [
      {
        label: "6.1",
        body: "Database & Backend: We use Supabase to securely host our databases. Your personal and travel details are encrypted and securely stored in their environments.",
      },
      {
        label: "6.2",
        body: "Email & Notifications: We use Mailgun (or equivalent email provider) to dispatch transactional receipts, newsletters, and confirmation messages. They handle your email address in accordance with their strict privacy terms.",
      },
      {
        label: "6.3",
        body: "Third-party service providers are prohibited from using your personal data for any purpose other than facilitating confirmed bookings.",
      },
    ],
  },
  {
    id: "rights",
    waypoint: "Your Rights",
    title: "7. Your Rights",
    clauses: [
      {
        label: "7.1",
        body: "You have the right to request access to the personal data we hold about you and receive a copy of it.",
      },
      {
        label: "7.2",
        body: "You have the right to request that we correct inaccurate information, restrict data processing, or delete your personal details (subject to legal record-keeping requirements).",
      },
      {
        label: "7.3",
        body: "You may opt out of marketing communications at any time by clicking the 'unsubscribe' link in our newsletters or contacting us directly.",
      },
    ],
  },
  {
    id: "children",
    waypoint: "Children's Privacy",
    title: "8. Children's Privacy",
    clauses: [
      {
        label: "8.1",
        body: "Our website is not intended for users under the age of 18. We do not knowingly collect personal data directly from minors.",
      },
      {
        label: "8.2",
        body: "Any information regarding minors (e.g. child passenger lists) must be provided exclusively by a parent or legal guardian during the booking process.",
      },
    ],
  },
  {
    id: "changes",
    waypoint: "Updates",
    title: "9. Changes to Privacy Policy",
    clauses: [
      {
        label: "9.1",
        body: "We reserve the right to update this policy as regulations or website functionalities evolve. Revised versions will be posted here immediately.",
      },
      {
        label: "9.2",
        body: "We recommend checking this page periodically to remain informed about how we safeguard your data.",
      },
    ],
  },
  {
    id: "contact",
    waypoint: "Contact Us",
    title: "10. Contact Us",
    clauses: [
      {
        label: "10.1",
        body: "For questions about this Privacy Policy or requests regarding your personal information, email us at privacy@travelcarvers.com.",
      },
      {
        label: "10.2",
        body: "Alternatively, you can call us at +91 98765 43210 or write to us at MG Road, Bengaluru, Karnataka 560001, India.",
      },
    ],
  },
];

export default function PrivacyClient() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([SECTIONS[0].id]));
  const [progress, setProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const articleRef = useRef<HTMLDivElement | null>(null);

  // Scroll-spy + reading progress
  useEffect(() => {
    const handleScroll = () => {
      const article = articleRef.current;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        Math.max(total, 1)
      );
      setProgress(Math.min(100, Math.round((scrolled / Math.max(total, 1)) * 100)));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setOpenIds((prev) => new Set(prev).add(id));
    setNavOpen(false);
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleSection = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenIds(new Set(SECTIONS.map((s) => s.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <div className="min-h-screen bg-white text-brand-darkest font-sans">
      {/* Reading progress rail */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand-lightest/40">
        <div
          className="h-full bg-gradient-to-r from-brand-darkest via-brand-dark to-brand-medium transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating mobile trail button */}
      <button
        onClick={() => setNavOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[150] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand-dark text-white shadow-lg active:scale-[0.98] transition-all"
      >
        <MapIcon className="w-4 h-4" />
        <span className="text-xs font-semibold">Route map</span>
      </button>

      {/* Mobile trail drawer */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] bg-brand-darkest/40" onClick={() => setNavOpen(false)}>
          <div
            className="absolute top-0 right-0 h-full w-72 max-w-[85%] bg-white shadow-2xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold mb-4">The route</p>
            <TrailNav
              activeId={activeId}
              onSelect={scrollToSection}
              progress={progress}
              compact
            />
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-brand-primary text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <MountainSkyline className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-lightest/80 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-white">Privacy Policy</span>
          </nav>

          <p className="font-mono text-xs tracking-[0.2em] uppercase text-brand-lightest mb-4">
            Ref. TC-PP-2026 &middot; Effective 16 July 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] max-w-2xl">
            Our commitment to safeguarding your travel data.
          </h1>
          <p className="mt-5 max-w-xl text-brand-lightest text-base sm:text-lg">
            Understand how we collect, handle, and secure your email, phone, and booking info. Ten sections mapping out your privacy rights.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Pill label="10 sections" />
            <Pill label="~5 min read" />
            <Pill label="GDPR & Data Protection Compliant" />
          </div>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-10 sm:h-14"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path d="M0,32 C240,60 480,0 720,20 C960,40 1200,10 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
        {/* Desktop trail sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-lg font-semibold mb-1">The route</p>
            <p className="text-sm text-secondary-sage mb-5">
              Trace your way through the policy.
            </p>
            <TrailNav activeId={activeId} onSelect={scrollToSection} progress={progress} />

            <div className="mt-8 rounded-xl border border-brand-light/50 p-4 bg-brand-tint-subtle">
              <p className="text-xs uppercase tracking-wide text-secondary-sage mb-1">Need help?</p>
              <p className="text-sm text-brand-dark font-medium">privacy@travelcarvers.com</p>
              <p className="text-sm text-secondary-sage">+91 98765 43210</p>
            </div>
          </div>
        </aside>

        {/* Articles */}
        <div ref={articleRef}>
          <div className="flex items-center justify-between mb-6 text-sm">
            <p className="text-secondary-sage">
              Reading{" "}
              <span className="font-semibold text-brand-dark">{progress}%</span>
            </p>
            <div className="flex gap-3">
              <button onClick={expandAll} className="text-brand-dark hover:underline underline-offset-4">
                Expand all
              </button>
              <span className="text-brand-light">/</span>
              <button onClick={collapseAll} className="text-brand-dark hover:underline underline-offset-4">
                Collapse all
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {SECTIONS.map((section, idx) => {
              const isOpen = openIds.has(section.id);
              return (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className="scroll-mt-24 rounded-2xl border border-brand-light/40 bg-white shadow-[0_1px_2px_rgba(27,77,27,0.05)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-start sm:items-center justify-between gap-4 text-left px-5 sm:px-7 py-5"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="flex-none w-9 h-9 rounded-full bg-brand-lightest text-brand-darkest font-semibold text-sm flex items-center justify-center">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">{section.title.replace(/^\d+\.\s/, "")}</h2>
                        <p className="text-xs uppercase tracking-[0.14em] text-secondary-sage mt-0.5">
                          {section.waypoint}
                        </p>
                      </div>
                    </div>
                    <ChevronIcon
                      className={`flex-none w-5 h-5 text-secondary-sage transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-7 pb-6 sm:pb-8">
                        {section.intro && (
                          <p className="text-brand-dark mb-4 leading-relaxed">{section.intro}</p>
                        )}

                        {section.notice && (
                          <div
                            className={`mb-5 rounded-lg px-4 py-3 text-sm flex gap-3 ${section.notice.kind === "warning"
                              ? "bg-brand-darkest text-white"
                              : "bg-brand-lightest/50 text-brand-darkest"
                              }`}
                          >
                            <span className="flex-none mt-0.5">
                              {section.notice.kind === "warning" ? (
                                <FlagIcon className="w-4 h-4" />
                              ) : (
                                <InfoIcon className="w-4 h-4" />
                              )}
                            </span>
                            <p>{section.notice.text}</p>
                          </div>
                        )}

                        <dl className="space-y-3">
                          {section.clauses.map((c) => (
                            <div key={c.label} className="flex gap-3">
                              <dt className="flex-none font-mono text-xs text-accent-light pt-0.5 w-9">
                                {c.label}
                              </dt>
                              <dd className="text-[15px] leading-relaxed text-brand-darkest/90">
                                {c.body}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Acceptance */}
          <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 px-6 sm:px-8 py-7 sm:py-8">
            <p className="text-xl sm:text-2xl font-bold mb-2 text-brand-darkest">Confirm Your Privacy Choices</p>
            <p className="text-slate-600 text-sm mb-5 max-w-xl">
              By continuing to use our booking services, you acknowledge that your information is handled in accordance with this Privacy Policy.
            </p>
            <div className="text-sm font-semibold text-brand-dark">
              Travel Carvers &mdash; Grooving Your Journey Safely.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Trail navigation (signature element) ---------------- */

function TrailNav({
  activeId,
  onSelect,
  progress,
  compact,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  progress: number;
  compact?: boolean;
}) {
  return (
    <nav className="relative pl-6">
      <div className="absolute left-[7px] top-1 bottom-1 w-[2px] bg-brand-lightest rounded-full" />
      <div
        className="absolute left-[7px] top-1 w-[2px] bg-gradient-to-b from-brand-darkest to-brand-medium rounded-full transition-all duration-300"
        style={{ height: `${progress}%` }}
      />
      <ul className={compact ? "space-y-4" : "space-y-3.5"}>
        {SECTIONS.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id} className="relative">
              <span
                className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 transition-colors ${active
                  ? "bg-brand-darkest border-brand-darkest"
                  : "bg-white border-brand-light"
                  }`}
              />
              <button
                onClick={() => onSelect(s.id)}
                className={`text-left text-sm leading-snug transition-colors ${active ? "text-brand-darkest font-semibold" : "text-secondary-sage hover:text-brand-dark"
                  }`}
              >
                {s.title.replace(/^\d+\.\s/, "")}
                <span className="block text-[11px] uppercase tracking-[0.12em] text-brand-light">
                  {s.waypoint}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------- Small presentational pieces ---------------- */

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 text-white/90">
      {label}
    </span>
  );
}

/* ---------------- Inline icons (no external deps) ---------------- */

function TrailMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <circle cx="20" cy="20" r="19" stroke="var(--logo-forest)" strokeWidth="1.5" />
      <path
        d="M9 26c3-6 6-3 9-9s6-3 9 3"
        stroke="var(--logo-sage)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="26" r="1.6" fill="var(--logo-forest-dark)" />
      <circle cx="27" cy="20" r="1.6" fill="var(--logo-forest-dark)" />
    </svg>
  );
}

function MountainSkyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 300" className={className} preserveAspectRatio="xMidYMax slice">
      <path d="M0,300 L120,140 L220,230 L340,90 L470,230 L600,120 L720,220 L800,180 L800,300 Z" fill="var(--logo-pastel)" />
      <path d="M0,300 L180,210 L300,260 L420,170 L560,260 L680,190 L800,240 L800,300 Z" fill="var(--logo-sage-light)" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 3v18" strokeLinecap="round" />
      <path d="M5 4h11l-2 3 2 3H5" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}
