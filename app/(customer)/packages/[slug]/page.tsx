"use client";

import React, { useEffect, useRef, useState } from "react";
import { LeadFormModal } from "@/components/customer/LeadFormModal";



const pkg = {
    title: "Ladakh High Passes Circuit",
    tagline:
        "Eight days along the world's highest motorable passes, past monasteries that have watched the same peaks for a thousand years.",
    location: "Leh, Ladakh, India",
    duration: "8 Days / 7 Nights",
    rating: 4.8,
    reviewCount: 214,
    groupSize: "6–12 travelers",
    startingPrice: 68500,
    cover: "https://picsum.photos/seed/ladakh-hero/1800/1000",
};

const highlights = [
    "Cross Khardung La and Tanglang La — two of the highest motorable passes on earth",
    "Overnight camp on the shores of Pangong Tso as the lake changes colour at dusk",
    "Visit Thiksey and Diskit monasteries, still active after five centuries",
    "Sand dunes and double-humped Bactrian camels in the Nubra Valley",
    "Guided acclimatisation days built in — no altitude gambling",
];

const bestTime = "Mid-May through late September, once the high passes are clear of snow.";

type Day = {
    n: number;
    title: string;
    place: string;
    altitude: number; // metres
    desc: string;
};

const itinerary: Day[] = [
    { n: 1, title: "Arrive in Leh", place: "Leh", altitude: 3500, desc: "Land at Leh and do nothing on purpose. A short walk to the market in the evening is the only plan — your lungs need the day." },
    { n: 2, title: "Leh acclimatisation & monasteries", place: "Leh", altitude: 3500, desc: "Shanti Stupa at sunrise, then Shey and Thiksey monasteries. Still no big elevation gain — today is about patience." },
    { n: 3, title: "Leh to Nubra via Khardung La", place: "Nubra Valley", altitude: 5359, desc: "Climb to Khardung La, one of the highest motorable passes in the world, then drop into the sand dunes of Nubra." },
    { n: 4, title: "Nubra to Pangong via Shyok", place: "Pangong Tso", altitude: 4225, desc: "A quieter back route along the Shyok river, arriving at Pangong Tso in time to watch the lake turn five shades of blue." },
    { n: 5, title: "Pangong to Tso Moriri via Chushul", place: "Tso Moriri", altitude: 4522, desc: "A long, remote drive through the Changthang plateau — wild asses, wetland birds, and almost no other vehicles." },
    { n: 6, title: "Tso Moriri exploration", place: "Tso Moriri", altitude: 4522, desc: "A rest day at the highest of the great lakes. Optional short walk to Korzok village and its 300-year-old gompa." },
    { n: 7, title: "Tso Moriri to Leh via Tanglang La", place: "Leh", altitude: 5328, desc: "The last big climb, over Tanglang La, before a long descent back into the Indus valley and a hot shower." },
    { n: 8, title: "Departure", place: "Leh", altitude: 3500, desc: "Transfer to Leh airport. Take the mountains home with you." },
];

const inclusions = [
    "7 nights accommodation (boutique hotels + 2 nights fixed camps)",
    "All meals — breakfast, packed lunch, dinner",
    "Private 4x4 transport with an experienced high-altitude driver",
    "Inner Line Permits for restricted areas",
    "Certified trip leader for the full circuit",
    "Oxygen cylinder and first-aid kit carried in-vehicle",
];

const exclusions = [
    "Flights to and from Leh",
    "Travel insurance (mandatory, not included)",
    "Personal expenses and alcoholic beverages",
    "Tips for driver and crew",
    "Anything not listed under inclusions",
];

const pricingTiers = [
    { label: "Adult", sub: "12 yrs and above", price: 68500 },
    { label: "Child", sub: "5–11 yrs, sharing with adult", price: 51900 },
    { label: "Infant", sub: "Under 5 yrs", price: 8500 },
];

const addOns = [
    { label: "Private vehicle upgrade (no sharing)", price: 22000 },
    { label: "Extra night in Leh, pre-trip", price: 4200 },
    { label: "Professional trek photographer, full trip", price: 15000 },
];

const cancellationPolicy = [
    { window: "30+ days before departure", refund: "90% refund" },
    { window: "15–29 days before departure", refund: "50% refund" },
    { window: "7–14 days before departure", refund: "25% refund" },
    { window: "Within 7 days", refund: "No refund" },
];

const documentsNeeded = [
    "Government-issued photo ID (passport for foreign nationals)",
    "2 passport-size photographs, for Inner Line Permits",
    "Valid travel insurance certificate",
    "Medical fitness declaration (provided at booking)",
];

const faqs = [
    { q: "Is altitude sickness a real risk on this route?", a: "Yes, and we plan around it rather than pretend it isn't there. Two full acclimatisation days are built into the itinerary before any major pass, oxygen is carried in every vehicle, and your trip leader is trained to recognise early symptoms." },
    { q: "Do I need prior trekking experience?", a: "No technical trekking is involved — this is a road circuit with short walks at each stop. Reasonable fitness for walking at altitude is enough." },
    { q: "What's the accommodation actually like?", a: "Boutique hotels in Leh and Nubra, and fixed-tent camps with proper beds (not backpacking tents) at Pangong and Tso Moriri. Bathrooms are attached throughout." },
    { q: "Can the itinerary flex for weather or road closures?", a: "The high passes can close on short notice. Your trip leader carries a pre-agreed contingency route, and any change is explained on the ground, not sprung on you." },
    { q: "Is this a good fit for solo travellers?", a: "Very much so — most groups are a mix of solo travellers and small pairs. Single-supplement pricing is available on request." },
];

const reviews = [
    { name: "Priya N.", rating: 5, date: "Aug 2025", text: "Khardung La at sunrise, then Pangong at dusk on the same trip — I still think about the colour of that lake. The acclimatisation days meant nobody in our group got sick." },
    { name: "Daniel W.", rating: 5, date: "Jul 2025", text: "Our driver knew every switchback by name. Tso Moriri was the highlight — barely another vehicle in sight for two days." },
    { name: "Meera K.", rating: 4, date: "Jun 2025", text: "Genuinely well organised. Only note is the Nubra to Pangong day is long — pack snacks and a good playlist." },
    { name: "Arjun S.", rating: 5, date: "Sep 2024", text: "Went solo and left with four new friends. The camp at Pangong under a full sky of stars alone was worth the altitude headache on day one." },
];

const ratingBreakdown = [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
];

const gallery = [
    { src: "https://picsum.photos/seed/ladakh-1/900/700", alt: "Khardung La pass road" },
    { src: "https://picsum.photos/seed/ladakh-2/900/1100", alt: "Pangong Tso at dusk" },
    { src: "https://picsum.photos/seed/ladakh-3/900/700", alt: "Thiksey monastery" },
    { src: "https://picsum.photos/seed/ladakh-4/900/700", alt: "Nubra Valley sand dunes" },
    { src: "https://picsum.photos/seed/ladakh-5/900/1100", alt: "Tso Moriri camp at night" },
    { src: "https://picsum.photos/seed/ladakh-6/900/700", alt: "Prayer flags over the valley" },
];

const similarPackages = [
    { title: "Spiti Valley Monastery Trail", duration: "7 Days", price: 54900, img: "https://picsum.photos/seed/spiti/700/500" },
    { title: "Zanskar River Rafting Expedition", duration: "6 Days", price: 61200, img: "https://picsum.photos/seed/zanskar/700/500" },
    { title: "Markha Valley Trek", duration: "9 Days", price: 72800, img: "https://picsum.photos/seed/markha/700/500" },
];

const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions" },
    { id: "gallery", label: "Gallery" },
    { id: "pricing", label: "Pricing" },
    { id: "info", label: "Additional Info" },
    { id: "faqs", label: "FAQs" },
    { id: "reviews", label: "Reviews" },
    { id: "similar", label: "Similar Packages" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* --------------------------- Icons ----------------------------- */

const Icon = {
    chevron: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    star: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
            <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.8 5.9 21.2l1.5-6.9-5.2-4.7 6.9-.7L12 2.5z" />
        </svg>
    ),
    clock: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    users: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
            <circle cx="9" cy="8" r="3" />
            <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
            <path d="M16 4.5a3 3 0 010 6" strokeLinecap="round" />
            <path d="M17 14c3 .3 5 2.6 5 6" strokeLinecap="round" />
        </svg>
    ),
    pin: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
            <path d="M12 21s7-6.7 7-12a7 7 0 10-14 0c0 5.3 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.4" />
        </svg>
    ),
    check: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} {...p}>
            <path d="M4 12.5l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    x: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} {...p}>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
    ),
    plane: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
            <path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 00-3 0v4.5l-8 5v2l8-2.5V17l-2.5 1.8V20l3.5-1 3.5 1v-1.2L12 17v-4l9 2.5z" />
        </svg>
    ),
    shield: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
            <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        </svg>
    ),
    close: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
            <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
        </svg>
    ),
};

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* =============================== Page =============================== */

export default function PackageDetailsPage() {
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [isSticky, setIsSticky] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [guests, setGuests] = useState(2);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const navSentinel = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = navSentinel.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleTabsScroll = () => {
        const el = tabsContainerRef.current;
        if (!el) return;

        // Show left arrow if scrolled right
        setShowLeftArrow(el.scrollLeft > 5);

        // Show right arrow if not scrolled to the end
        const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
        setShowRightArrow(!isEnd);
    };

    useEffect(() => {
        handleTabsScroll();
        // Delay checking to ensure mount layout measurements are ready
        const timer = setTimeout(handleTabsScroll, 300);
        window.addEventListener("resize", handleTabsScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleTabsScroll);
        };
    }, []);

    const goTo = (id: TabId) => {
        setActiveTab(id);
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const total = guests * pkg.startingPrice;

    return (
        <div className="min-h-screen bg-[#F4F1EA] font-body text-[15px] text-[--foreground]">
            <FontLoader />

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-5 text-xs text-slate-700 sm:px-8">
                <ol className="flex items-center gap-1.5">
                    <li>Home</li>
                    <Icon.chevron className="h-3 w-3 text-slate-300" />
                    <li>Destinations</li>
                    <Icon.chevron className="h-3 w-3 text-slate-300" />
                    <li>Ladakh</li>
                    <Icon.chevron className="h-3 w-3 text-slate-300" />
                    <li className="font-medium text-brand-dark">{pkg.title}</li>
                </ol>
            </nav>

            {/* Hero */}
            <header className="relative mx-auto mt-4 max-w-7xl px-5 sm:px-8">
                <div className="relative h-[52vh] min-h-[340px] w-full overflow-hidden rounded-2xl sm:h-[62vh]">
                    <img src={pkg.cover} alt={pkg.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 overlay-brand-primary" />
                    <div className="absolute inset-x-0 bottom-0 p-6 pb-16 sm:p-10 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <Icon.pin className="h-3.5 w-3.5" /> {pkg.location}
                        </span>
                        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
                            {pkg.title}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{pkg.tagline}</p>
                    </div>
                </div>

                {/* Boarding-pass stat stub, overlapping hero */}
                <div className="ticket relative z-10 mx-auto -mt-8 grid grid-cols-2 gap-x-4 gap-y-6 max-w-4xl rounded-xl border border-brand-light bg-white px-6 py-5 shadow-[0_12px_40px_-15px_rgba(27,77,27,0.35)] sm:mx-6 sm:px-8 sm:flex sm:flex-nowrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-0">
                    <Stat icon={<Icon.clock className="h-4 w-4" />} label="Duration" value={pkg.duration} />
                    <TicketDivider />
                    <Stat
                        icon={<Icon.star className="h-4 w-4 fill-current text-amber-400" />}
                        label="Rating"
                        value={`${pkg.rating} · ${pkg.reviewCount} reviews`}
                    />
                    <TicketDivider />
                    <Stat icon={<Icon.users className="h-4 w-4" />} label="Group size" value={pkg.groupSize} />
                    <TicketDivider />
                    <Stat label="From" value={<span className="font-mono text-lg text-brand-darkest">{money(pkg.startingPrice)}</span>} sub="per adult" />
                </div>
            </header>

            <div ref={navSentinel} />

            {/* Sticky tab nav */}
            <div className={`sticky top-0 z-40 border-b border-brand-light/70 bg-white/90 backdrop-blur-md transition-shadow ${isSticky ? "shadow-sm" : ""}`}>
                <div className="relative mx-auto max-w-7xl">
                    <div
                        ref={tabsContainerRef}
                        onScroll={handleTabsScroll}
                        className="overflow-x-auto px-5 sm:px-8 scrollbar-hide"
                    >
                        <div className="flex min-w-max gap-1 py-1 px-12 sm:px-0">
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => goTo(t.id)}
                                    className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors ${activeTab === t.id ? "text-brand-darkest font-semibold" : "text-slate-700 hover:text-brand-dark"
                                        }`}
                                >
                                    {t.label}
                                    {activeTab === t.id && (
                                        <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-dark" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Visual fade-out and arrow indicator on mobile to suggest swiping left */}
                    {showLeftArrow && (
                        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-2 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none sm:hidden z-10 w-16">
                            <Icon.chevron className="w-5 h-5 text-brand-dark animate-pulse rotate-180" />
                        </div>
                    )}
                    {/* Visual fade-out and arrow indicator on mobile to suggest swiping right */}
                    {showRightArrow && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-2 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden z-10 w-16">
                            <Icon.chevron className="w-5 h-5 text-brand-dark animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            {/* Body: content + sidebar */}
            <div ref={sectionRef} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-10 sm:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
                    <main className="min-w-0">
                        {activeTab === "overview" && <Overview />}
                        {activeTab === "itinerary" && <Itinerary />}
                        {activeTab === "inclusions" && <Inclusions />}
                        {activeTab === "gallery" && <Gallery onOpen={setLightbox} />}
                        {activeTab === "pricing" && <Pricing />}
                        {activeTab === "info" && <AdditionalInfo />}
                        {activeTab === "faqs" && <FAQs open={openFaq} setOpen={setOpenFaq} />}
                        {activeTab === "reviews" && <Reviews />}
                        {activeTab === "similar" && <SimilarPackages />}
                    </main>

                    {/* Booking sidebar */}
                    <aside className="hidden lg:block">
                        <BookingCard guests={guests} setGuests={setGuests} total={total} onBookNow={() => setIsLeadFormOpen(true)} />
                    </aside>
                </div>
            </div>

            {/* Mobile sticky CTA */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-brand-light bg-white/95 px-5 py-3 backdrop-blur-md lg:hidden">
                <div>
                    <p className="text-[11px] text-slate-700">From</p>
                    <p className="font-mono text-lg font-semibold text-brand-darkest">{money(pkg.startingPrice)}</p>
                </div>
                <button
                    onClick={() => setIsLeadFormOpen(true)}
                    className="rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 active:scale-[0.98] cursor-pointer"
                >
                    Reserve Your Spot
                </button>
            </div>
            <div className="h-16 lg:hidden" />

            {/* Lead Form Modal */}
            <LeadFormModal
                isOpen={isLeadFormOpen}
                onClose={() => setIsLeadFormOpen(false)}
                packageId={pkg.title.toLowerCase().replace(/\s+/g, '-')}
                packageTitle={pkg.title}
            />

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
                    onClick={() => setLightbox(null)}
                >
                    <button className="absolute right-6 top-6 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
                        <Icon.close className="h-7 w-7" />
                    </button>
                    <img
                        src={gallery[lightbox].src}
                        alt={gallery[lightbox].alt}
                        className="max-h-[85vh] max-w-full rounded-lg object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

/* --------------------------- Small pieces --------------------------- */

function Stat({ icon, label, value, sub }: { icon?: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) {
    return (
        <div className="flex items-center gap-2.5">
            {icon && <span className="text-brand-medium">{icon}</span>}
            <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-600">{label}</p>
                <p className="text-sm font-semibold text-brand-darkest">{value}</p>
                {sub && <p className="text-[11px] text-slate-600">{sub}</p>}
            </div>
        </div>
    );
}

function TicketDivider() {
    return <span className="hidden h-8 w-px bg-brand-light/70 sm:block" />;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-medium">{eyebrow}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-brand-darkest sm:text-3xl">{title}</h2>
        </div>
    );
}

/* ------------------------------ Tabs -------------------------------- */

function Overview() {
    return (
        <div className="space-y-10">
            <div>
                <SectionHeading eyebrow="The Trip" title="Overview" />
                <p className="max-w-2xl leading-relaxed text-slate-800">{pkg.tagline}</p>
            </div>

            <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-brand-darkest">Highlights</h3>
                <ul className="space-y-3">
                    {highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand-dark">
                                <Icon.check className="h-3 w-3" />
                            </span>
                            <span className="text-sm leading-relaxed text-slate-800">{h}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-xl border border-brand-light/70 bg-brand-tint-subtle p-5">
                <h3 className="font-display text-base font-semibold text-brand-darkest">Best time to go</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{bestTime}</p>
            </div>
        </div>
    );
}

function Itinerary() {
    const minAlt = Math.min(...itinerary.map((d) => d.altitude)) - 400;
    const maxAlt = Math.max(...itinerary.map((d) => d.altitude)) + 300;
    const w = 800, h = 220, padX = 24, topPad = 26, bottomPad = 34;
    const usableH = h - topPad - bottomPad;
    const step = (w - padX * 2) / (itinerary.length - 1);
    const points = itinerary.map((d, i) => {
        const x = padX + i * step;
        const y = topPad + usableH - ((d.altitude - minAlt) / (maxAlt - minAlt)) * usableH;
        return { x, y, day: d };
    });
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const fillPath = `${linePath} L${points[points.length - 1].x},${h - bottomPad + 10} L${points[0].x},${h - bottomPad + 10} Z`;

    return (
        <div>
            <SectionHeading eyebrow="Day by Day" title="Itinerary" />

            {/* Signature: elevation skyline of the actual route */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-brand-light/70 bg-gradient-to-b from-brand-lightest/40 to-white p-4 sm:p-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-600">Elevation profile · metres above sea level</p>
                <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="skyline-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6B8E6B" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#6B8E6B" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    <path d={fillPath} fill="url(#skyline-fill)" />
                    <path d={linePath} fill="none" stroke="#2D5F2D" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle cx={p.x} cy={p.y} r={5} fill="#FFFFFF" stroke="#1B4D1B" strokeWidth={2} />
                            <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-brand-darkest" fontSize="11" fontWeight={600}>
                                {p.day.altitude.toLocaleString()}m
                            </text>
                            <text x={p.x} y={h - bottomPad + 26} textAnchor="middle" className="fill-slate-400" fontSize="11">
                                Day {p.day.n}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <ol className="space-y-4">
                {itinerary.map((d) => (
                    <li key={d.n} className="flex gap-4 rounded-xl border border-brand-light/60 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-darkest font-mono text-sm font-semibold text-white">
                            {String(d.n).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h3 className="font-display text-base font-semibold text-brand-darkest">{d.title}</h3>
                                <span className="inline-flex items-center gap-1 rounded-full bg-brand-lightest px-2 py-0.5 font-mono text-[11px] font-medium text-brand-dark">
                                    <Icon.pin className="h-3 w-3" /> {d.place} · {d.altitude.toLocaleString()}m
                                </span>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{d.desc}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

function Inclusions() {
    return (
        <div>
            <SectionHeading eyebrow="What You Get" title="Inclusions & Exclusions" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-brand-light/70 p-5">
                    <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Included</h3>
                    <ul className="space-y-2.5">
                        {inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
                                <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                    <h3 className="mb-3 font-display text-base font-semibold text-slate-700">Not included</h3>
                    <ul className="space-y-2.5">
                        {exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <Icon.x className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Gallery({ onOpen }: { onOpen: (i: number) => void }) {
    return (
        <div>
            <SectionHeading eyebrow="In Pictures" title="Gallery" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                    <button
                        key={i}
                        onClick={() => onOpen(i)}
                        className={`group overflow-hidden rounded-xl bg-slate-100 ${i === 1 || i === 4 ? "row-span-2" : ""}`}
                    >
                        <img
                            src={g.src}
                            alt={g.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function Pricing() {
    return (
        <div>
            <SectionHeading eyebrow="Cost Breakdown" title="Pricing" />
            <div className="overflow-hidden rounded-xl border border-brand-light/70">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-brand-tint-subtle text-left text-xs uppercase tracking-wide text-slate-700">
                            <th className="px-5 py-3 font-medium">Category</th>
                            <th className="px-5 py-3 font-medium">Details</th>
                            <th className="px-5 py-3 text-right font-medium">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-light/60">
                        {pricingTiers.map((t) => (
                            <tr key={t.label}>
                                <td className="px-5 py-4 font-medium text-brand-darkest">{t.label}</td>
                                <td className="px-5 py-4 text-slate-700">{t.sub}</td>
                                <td className="px-5 py-4 text-right font-mono font-semibold text-brand-darkest">{money(t.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="mb-3 mt-8 font-display text-base font-semibold text-brand-darkest">Optional add-ons</h3>
            <div className="space-y-2.5">
                {addOns.map((a) => (
                    <div key={a.label} className="flex items-center justify-between rounded-lg border border-brand-light/60 px-4 py-3 text-sm">
                        <span className="text-slate-800">{a.label}</span>
                        <span className="font-mono font-medium text-brand-dark">+{money(a.price)}</span>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-slate-600">Prices are per person, in INR, and exclude flights and travel insurance.</p>
        </div>
    );
}

function AdditionalInfo() {
    return (
        <div className="space-y-10">
            <div>
                <SectionHeading eyebrow="Fine Print" title="Additional Information" />
                <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Cancellation policy</h3>
                <div className="overflow-hidden rounded-xl border border-brand-light/70">
                    {cancellationPolicy.map((c, i) => (
                        <div
                            key={c.window}
                            className={`flex items-center justify-between px-5 py-3.5 text-sm ${i % 2 ? "bg-brand-tint-subtle" : ""}`}
                        >
                            <span className="text-slate-800">{c.window}</span>
                            <span className="font-mono font-medium text-brand-darkest">{c.refund}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Documents required</h3>
                <ul className="space-y-2.5">
                    {documentsNeeded.map((d, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
                            <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                            {d}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function FAQs({ open, setOpen }: { open: number | null; setOpen: (i: number | null) => void }) {
    return (
        <div>
            <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
            <div className="divide-y divide-brand-light/60 rounded-xl border border-brand-light/70 bg-white">
                {faqs.map((f, i) => {
                    const isOpen = open === i;
                    return (
                        <div key={i}>
                            <button
                                onClick={() => setOpen(isOpen ? null : i)}
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                                <span className="text-sm font-medium text-brand-darkest">{f.q}</span>
                                <Icon.chevron className={`h-4 w-4 shrink-0 text-brand-medium transition-transform ${isOpen ? "rotate-90" : ""}`} />
                            </button>
                            {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-800">{f.a}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Reviews() {
    return (
        <div>
            <SectionHeading eyebrow="Traveler Voices" title="Reviews" />

            <div className="mb-8 flex flex-col gap-6 rounded-xl border border-brand-light/70 p-5 sm:flex-row sm:items-center sm:gap-10">
                <div className="text-center sm:text-left">
                    <p className="font-display text-4xl font-semibold text-brand-darkest">{pkg.rating}</p>
                    <div className="mt-1 flex justify-center gap-0.5 text-amber-400 sm:justify-start">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Icon.star key={i} className="h-4 w-4" />
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{pkg.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-3 text-xs text-slate-700">
                            <span className="w-8 shrink-0">{r.stars} star</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-gradient-brand-primary" style={{ width: `${r.pct}%` }} />
                            </div>
                            <span className="w-8 shrink-0 text-right">{r.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-5">
                {reviews.map((r, i) => (
                    <div key={i} className="rounded-xl border border-brand-light/60 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-brand-darkest">{r.name}</p>
                            <span className="text-xs text-slate-600">{r.date}</span>
                        </div>
                        <div className="mt-1 flex gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i2) => (
                                <Icon.star key={i2} className={`h-3.5 w-3.5 ${i2 < r.rating ? "" : "text-slate-200"}`} />
                            ))}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-800">{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SimilarPackages() {
    return (
        <div>
            <SectionHeading eyebrow="Keep Exploring" title="Similar Packages" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similarPackages.map((s) => (
                    <div key={s.title} className="group overflow-hidden rounded-xl border border-brand-light/60">
                        <div className="aspect-[4/3] overflow-hidden">
                            <img src={s.img} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-display text-sm font-semibold text-brand-darkest">{s.title}</h3>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-slate-700">{s.duration}</span>
                                <span className="font-mono text-sm font-semibold text-brand-dark">{money(s.price)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* --------------------------- Booking sidebar -------------------------- */

function BookingCard({ guests, setGuests, total, onBookNow }: { guests: number; setGuests: (n: number) => void; total: number; onBookNow: () => void }) {
    return (
        <div className="ticket sticky top-24 rounded-2xl border border-brand-light bg-white p-6 shadow-[0_20px_50px_-20px_rgba(27,77,27,0.3)]">
            <p className="text-xs uppercase tracking-wide text-slate-600">Starting from</p>
            <p className="mt-1 font-mono text-3xl font-semibold text-brand-darkest">
                {money(pkg.startingPrice)}
                <span className="ml-1 text-sm font-normal text-slate-600">/ adult</span>
            </p>

            <div className="my-5 border-t border-dashed border-brand-light" />

            <label className="mb-1.5 block text-xs font-medium text-slate-700">Travellers</label>
            <div className="flex items-center justify-between rounded-lg border border-brand-light/70 px-3 py-2">
                <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest"
                >
                    –
                </button>
                <span className="font-mono text-sm font-medium text-brand-darkest">{guests}</span>
                <button
                    onClick={() => setGuests(Math.min(12, guests + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest"
                >
                    +
                </button>
            </div>

            <div className="my-5 border-t border-dashed border-brand-light" />

            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Estimated total</span>
                <span className="font-mono text-base font-semibold text-brand-darkest">{money(total)}</span>
            </div>

            <button
                onClick={onBookNow}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
                Reserve Your Spot
            </button>

            <div className="mt-4 space-y-2 text-xs text-slate-700">
                <p className="flex items-center gap-2">
                    <Icon.shield className="h-3.5 w-3.5 text-brand-medium" /> Free cancellation up to 30 days out
                </p>
                <p className="flex items-center gap-2">
                    <Icon.plane className="h-3.5 w-3.5 text-brand-medium" /> Reserve now, pay later available
                </p>
            </div>
        </div>
    );
}

/* ---------------------------- Font + CSS ------------------------------ */

function FontLoader() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
      .ticket {
        position: relative;
        background-image:
          radial-gradient(circle at 0 50%, transparent 8px, white 8.5px),
          radial-gradient(circle at 100% 50%, transparent 8px, white 8.5px);
      }
    `}</style>
    );
}