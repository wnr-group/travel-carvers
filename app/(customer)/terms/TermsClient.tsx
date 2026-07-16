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
    id: "booking",
    waypoint: "Departure",
    title: "1. Booking & Reservations",
    intro:
      "A booking is confirmed only once Travel Carvers issues written confirmation and the required deposit has cleared.",
    clauses: [
      {
        label: "1.1",
        body: "All bookings must be made by a traveller aged 18 or over, who accepts these terms on behalf of every person named on the booking.",
      },
      {
        label: "1.2",
        body: "A non-refundable deposit of 25% of the total package price is due at the time of booking, unless a different amount is stated on your quote.",
      },
      {
        label: "1.3",
        body: "The remaining balance is due 45 days before departure. Bookings made within 45 days of departure require payment in full.",
      },
      {
        label: "1.4",
        body: "It is the lead traveller's responsibility to check that names, dates and destinations on the confirmation match every traveller's passport exactly.",
      },
    ],
  },
  {
    id: "payments",
    waypoint: "Payment",
    title: "2. Payment Terms",
    clauses: [
      {
        label: "2.1",
        body: "We accept payment by major debit and credit cards, and bank transfer. A processing fee of up to 2% may apply to card payments.",
      },
      {
        label: "2.2",
        body: "Prices are quoted in the currency shown at checkout and are subject to change until a deposit is paid, after which your price is fixed unless clause 2.3 applies.",
      },
      {
        label: "2.3",
        body: "Surcharges may apply after booking only where required by currency fluctuation, fuel cost, or government-imposed taxes, and will never exceed 8% of the package price.",
      },
      {
        label: "2.4",
        body: "Failure to pay the balance by its due date may be treated as a cancellation by the traveller, and clause 3 will apply.",
      },
    ],
  },
  {
    id: "cancellations",
    waypoint: "Change of plan",
    title: "3. Cancellations & Refunds",
    notice: {
      kind: "warning",
      text: "Cancellation fees increase the closer you get to departure — review the schedule below before changing your plans.",
    },
    clauses: [
      {
        label: "3.1",
        body: "Cancellations must be submitted in writing by the lead traveller. The date we receive written notice is the effective cancellation date.",
      },
      {
        label: "3.2",
        body: "Cancellation charges, as a percentage of the total package price: 60+ days before departure — deposit only; 45–59 days — 50%; 15–44 days — 75%; 0–14 days — 100%.",
      },
      {
        label: "3.3",
        body: "Refunds are processed within 14 business days to the original payment method, less any non-recoverable third-party costs such as flights or permits.",
      },
      {
        label: "3.4",
        body: "If Travel Carvers cancels a trip for reasons other than force majeure, you will receive a full refund or the option to transfer funds to an alternative trip.",
      },
    ],
  },
  {
    id: "insurance",
    waypoint: "Protection",
    title: "4. Travel Insurance",
    clauses: [
      {
        label: "4.1",
        body: "Comprehensive travel insurance is mandatory for all Travel Carvers itineraries and must cover medical evacuation, trip cancellation, and personal belongings.",
      },
      {
        label: "4.2",
        body: "Proof of valid insurance must be provided no later than 14 days before departure. Travel Carvers may decline to carry travellers who cannot show proof of cover.",
      },
      {
        label: "4.3",
        body: "Travel Carvers is not a party to your insurance policy and is not responsible for claims, exclusions, or delays in settlement.",
      },
    ],
  },
  {
    id: "documents",
    waypoint: "Checkpoint",
    title: "5. Passports, Visas & Health",
    clauses: [
      {
        label: "5.1",
        body: "Travellers are responsible for holding a passport valid for at least six months beyond the return date, and for securing all visas required for their nationality.",
      },
      {
        label: "5.2",
        body: "Travel Carvers can advise on typical entry requirements but does not guarantee visa approval and accepts no liability for a denied entry.",
      },
      {
        label: "5.3",
        body: "Travellers must check current vaccination and health requirements for each destination with a licensed travel clinic before departure.",
      },
    ],
  },
  {
    id: "itinerary",
    waypoint: "Rerouting",
    title: "6. Itinerary Changes",
    clauses: [
      {
        label: "6.1",
        body: "Published itineraries are indicative. Travel Carvers may adjust routes, accommodation, or activity order where weather, safety, or local conditions require it.",
      },
      {
        label: "6.2",
        body: "Where a change is significant — a different destination, a lower category of accommodation, or a shift of more than two days — you will be notified as soon as reasonably possible with any available alternatives.",
      },
      {
        label: "6.3",
        body: "Minor changes made for operational reasons do not entitle travellers to compensation.",
      },
    ],
  },
  {
    id: "liability",
    waypoint: "Fine print",
    title: "7. Liability",
    notice: {
      kind: "info",
      text: "This section limits what Travel Carvers can be held responsible for. Read it alongside your insurance policy.",
    },
    clauses: [
      {
        label: "7.1",
        body: "Travel Carvers arranges services provided by independent third parties — airlines, hotels, guides, and transport operators — who are responsible for their own acts and omissions.",
      },
      {
        label: "7.2",
        body: "Our liability for a confirmed booking is limited to the total price paid for that booking, except where liability cannot be limited by law, such as death or personal injury caused by our negligence.",
      },
      {
        label: "7.3",
        body: "Travel Carvers is not liable for indirect or consequential loss, including missed connections, loss of enjoyment, or costs arising from a third-party supplier's failure.",
      },
    ],
  },
  {
    id: "force-majeure",
    waypoint: "Rough weather",
    title: "8. Force Majeure",
    clauses: [
      {
        label: "8.1",
        body: "Travel Carvers is not liable for failure to perform any obligation caused by events beyond reasonable control, including natural disaster, pandemic, war, civil unrest, or government restriction.",
      },
      {
        label: "8.2",
        body: "Where such an event affects your trip, we will work with you in good faith on rescheduling or crediting funds, but standard cancellation refunds do not apply.",
      },
    ],
  },
  {
    id: "conduct",
    waypoint: "Trail etiquette",
    title: "9. Traveller Conduct",
    clauses: [
      {
        label: "9.1",
        body: "Travellers must comply with the reasonable instructions of guides and local authorities, and respect the customs, environment, and wildlife of each destination.",
      },
      {
        label: "9.2",
        body: "Travel Carvers may remove a traveller from a trip, without refund, where their conduct endangers themselves, other travellers, or local staff.",
      },
    ],
  },
  {
    id: "media",
    waypoint: "Snapshots",
    title: "10. Photography & Media",
    clauses: [
      {
        label: "10.1",
        body: "Photographs or video taken by Travel Carvers staff during a trip may be used in our marketing materials unless you opt out in writing before departure.",
      },
      {
        label: "10.2",
        body: "Travellers retain ownership of their own photographs and are welcome to tag or share Travel Carvers in their own posts.",
      },
    ],
  },
  {
    id: "privacy",
    waypoint: "Your data",
    title: "11. Privacy",
    clauses: [
      {
        label: "11.1",
        body: "Personal information collected during booking is used only to plan, deliver, and support your trip, and is handled under our separate Privacy Policy.",
      },
      {
        label: "11.2",
        body: "Passport and payment details are shared with third-party suppliers only where necessary to deliver a confirmed service, such as flights or accommodation.",
      },
    ],
  },
  {
    id: "governing-law",
    waypoint: "Home base",
    title: "12. Governing Law & Complaints",
    clauses: [
      {
        label: "12.1",
        body: "These terms are governed by the laws of India, and any dispute will fall under the exclusive jurisdiction of the courts of Bengaluru, Karnataka.",
      },
      {
        label: "12.2",
        body: "Complaints during a trip should be raised with your guide or local representative immediately, so they can be resolved in real time wherever possible.",
      },
      {
        label: "12.3",
        body: "Unresolved complaints should be sent in writing within 28 days of your return date to hello@travelcarvers.com, and we will respond within 14 business days.",
      },
    ],
  },
];

export default function TermsClient() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([SECTIONS[0].id]));
  const [progress, setProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
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
            <span className="font-semibold text-white">Terms &amp; Conditions</span>
          </nav>

          <p className="font-mono text-xs tracking-[0.2em] uppercase text-brand-lightest mb-4">
            Ref. TC-TOS-2026 &middot; Effective 16 July 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] max-w-2xl">
            The terms that keep every trip on a steady path.
          </h1>
          <p className="mt-5 max-w-xl text-brand-lightest text-base sm:text-lg">
            Plain language on bookings, payments, cancellations and everything
            else that sits between you and the trail ahead. Twelve waypoints —
            read them in order, or jump straight to what matters to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Pill label="12 sections" />
            <Pill label="~6 min read" />
            <Pill label="Governed by Indian law" />
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
            <p className="text-sm text-[#5F7A5F] mb-5">
              Trace your way through the agreement.
            </p>
            <TrailNav activeId={activeId} onSelect={scrollToSection} progress={progress} />

            <div className="mt-8 rounded-xl border border-[#9DB89D]/50 p-4 bg-brand-tint-subtle">
              <p className="text-xs uppercase tracking-wide text-secondary-sage mb-1">Need help?</p>
              <p className="text-sm text-brand-dark font-medium">hello@travelcarvers.com</p>
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
            <p className="text-xl sm:text-2xl font-bold mb-2 text-brand-darkest">Ready to book with us?</p>
            <p className="text-slate-600 text-sm mb-5 max-w-xl">
              Confirm you've read the route above. This acknowledgement is kept
              with your booking record for your reference.
            </p>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-brand-dark"
              />
              <span className="text-sm text-slate-700">
                I have read and agree to the Travel Carvers Terms &amp; Conditions
                dated 16 July 2026.
              </span>
            </label>
            <button
              disabled={!accepted}
              className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${accepted
                  ? "bg-brand-dark text-white hover:bg-brand-darkest"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              Continue to booking
              <ArrowIcon className="w-4 h-4" />
            </button>
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

function PrintIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V3h12v6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M6 14h12v7H6z" />
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
