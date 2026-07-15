'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/* ========================================
   Scroll reveal hook
   Adds `.animate-in` (defined in globals.css) to any
   `.scroll-animate` element once it enters the viewport.
   ======================================== */
function useScrollReveal() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nodes = rootRef.current?.querySelectorAll('.scroll-animate');
        if (!nodes || nodes.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, []);

    return rootRef;
}

/* ========================================
   Count-up number, triggers once in view
   ======================================== */
function CountUp({
    target,
    suffix = '',
    duration = 1400,
}: {
    target: number;
    suffix?: string;
    duration?: number;
}) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !started.current) {
                        started.current = true;
                        const start = performance.now();
                        const tick = (now: number) => {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            setValue(Math.round(eased * target));
                            if (progress < 1) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref}>
            {value.toLocaleString()}
            {suffix}
        </span>
    );
}

/* ========================================
   Signature motif: a hand-carved contour line.
   ======================================== */
function ContourLines({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
    const stroke = tone === 'light' ? 'rgba(255,255,255,0.14)' : 'var(--sage-medium-20)';
    return (
        <svg
            className={className}
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
        >
            <path d="M0,120 C150,40 300,200 450,110 C600,20 750,190 900,100 C1000,40 1100,140 1200,90" stroke={stroke} strokeWidth="1.5" />
            <path d="M0,160 C150,90 300,220 450,150 C600,70 750,210 900,140 C1000,90 1100,170 1200,130" stroke={stroke} strokeWidth="1.5" />
            <path d="M0,80 C150,10 300,150 450,70 C600,-10 750,140 900,60 C1000,10 1100,90 1200,50" stroke={stroke} strokeWidth="1.5" />
        </svg>
    );
}

/* ========================================
   Small line-art icon set
   ======================================== */
const icons = {
    compass: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21a9 9 0 100-18 9 9 0 000 18zM14.5 9.5l-2 5-5 2 2-5 5-2z" />
    ),
    map: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2zM9 4.5v13M15 6.5v13" />
    ),
    leaf: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M20 4c-9 0-16 6-16 15 9 0 15-6 16-15zM8 19c2-4 5-7 10-9" />
    ),
    shield: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3zM9.5 12l1.8 1.8L14.8 10" />
    ),
    headset: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 13v-1a8 8 0 0116 0v1M4 13v4a2 2 0 002 2h1v-6H5a1 1 0 00-1 1zM20 13v4a2 2 0 01-2 2h-1v-6h1a1 1 0 011 1zM10 19h3a1 1 0 001-1" />
    ),
    tag: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M20 12l-8 8-9-9V4h7l10 8zM7.5 7.5h.01" />
    ),
};

function Icon({ name }: { name: keyof typeof icons }) {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
            {icons[name]}
        </svg>
    );
}

/* ========================================
   Content
   ======================================== */
const milestones = [
    { year: '2015', title: 'The first trail is carved', body: 'Travel Carvers begins as three friends hand-building itineraries for travelers who wanted routes with a story, not a checklist.' },
    { year: '2018', title: 'Twenty-five countries in', body: 'A growing bench of local guides lets us move from a handful of regions to a full network across four continents.' },
    { year: '2021', title: 'The sustainability pledge', body: 'We commit every itinerary to a carbon-conscious standard and start reinvesting in the communities we route through.' },
    { year: '2026', title: 'Fifty countries, one philosophy', body: 'Same hand-carved approach, a much bigger map — every trip still starts with a person, not a template.' },
];

const whyChooseUs = [
    { icon: 'map' as const, title: 'Handpicked trails', body: 'Every route is scouted and shaped by someone who has actually walked it — nothing is templated from a spreadsheet.' },
    { icon: 'compass' as const, title: 'Local expert guides', body: 'You travel alongside people who grew up in the places you’re visiting, not a script read from a headset.' },
    { icon: 'headset' as const, title: '24/7 concierge support', body: 'A real person picks up when your flight is delayed at 2am in a country whose time zone you forgot to check.' },
    { icon: 'tag' as const, title: 'Best price, carved fair', body: 'Transparent pricing with no hidden carving fees — if we find it cheaper, the difference comes back to you.' },
    { icon: 'leaf' as const, title: 'Sustainable by default', body: 'Every itinerary is weighed against its footprint, with a share of every booking going back into the trail.' },
    { icon: 'shield' as const, title: 'Flexible, protected plans', body: 'Reroute, reschedule, or rebuild your trip without penalty fees carved into the fine print.' },
];

const stats = [
    { value: 50, suffix: '+', label: 'Countries carved' },
    { value: 10000, suffix: '+', label: 'Travelers guided' },
    { value: 500, suffix: '+', label: 'Curated itineraries' },
    { value: 4.9, suffix: '/5', label: 'Average trip rating', decimal: true },
];

const team = [
    { initials: 'AR', name: 'Aanya Rao', role: 'Founder & Chief Route Carver', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80' },
    { initials: 'MK', name: 'Marco Kessler', role: 'Head of Itineraries', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80' },
    { initials: 'SP', name: 'Sana Prasad', role: 'Travel Concierge Lead', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80' },
    { initials: 'DO', name: 'Diego Oyelaran', role: 'Sustainability Director', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
];

/* ========================================
   Page
   ======================================== */
export default function AboutPage() {
    const containerRef = useScrollReveal();

    return (
        <div ref={containerRef} className="bg-background text-foreground">
            {/* ============ HERO ============ */}
            <section className="relative overflow-hidden bg-brand-darkest text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/about-hero-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--logo-forest-dark)]/60 via-[var(--logo-sage)]/40 to-transparent" />

                <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-start justify-center px-6 py-28 sm:px-10">
                    <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.35em] text-white/70 uppercase">
                        Travel Carvers &mdash; About Us
                    </span>

                    <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-semibold sm:text-6xl md:text-7xl">
                        Grooving Your
                        <br />
                        <span className="italic text-brand-lightest">Journey</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg text-white/80">
                        We don&apos;t sell packaged trips. We carve routes &mdash; one traveler,
                        one trail, one story at a time &mdash; across fifty countries and
                        counting.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            href="/packages"
                            className="rounded-full bg-white px-7 py-3 font-medium text-brand-darkest transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Explore Packages
                        </Link>
                        <a
                            href="#our-story"
                            className="rounded-full border border-white/30 px-7 py-3 font-medium text-white transition hover:border-white/70"
                        >
                            Read Our Story
                        </a>
                    </div>

                    <div className="mt-16 flex items-center gap-3 text-white/60">
                        <span className="h-px w-10 bg-white/40" />
                        <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase">
                            Scroll to explore
                        </span>
                    </div>
                </div>
            </section>

            {/* ============ OUR STORY ============ */}
            <section id="our-story" className="relative bg-white pt-28 pb-16">
                <div className="mx-auto max-w-6xl px-6 sm:px-10">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                        <div className="scroll-animate lg:col-span-5 opacity-0 translate-y-6">
                            <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.35em] text-brand-medium uppercase block mb-3">
                                Our Story
                            </span>
                            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium leading-tight text-brand-darkest sm:text-4xl">
                                Carved from a love of the open road,
                                <span className="italic text-brand-medium block mt-1.5">not a booking algorithm</span>
                            </h2>
                        </div>

                        <div className="scroll-animate lg:col-span-7 lg:pt-8 opacity-0 translate-y-6" style={{ transitionDelay: '70ms' }}>
                            <div className="relative pl-6 border-l-2 border-brand-light">
                                <p className="text-lg md:text-xl text-brand-dark/80 leading-relaxed">
                                    Travel Carvers started with a simple complaint: most itineraries
                                    feel cut from the same template. So we built a studio of local
                                    guides and route planners who shape every trip by hand &mdash;
                                    carving out the detours, the local kitchens, and the trails that
                                    never make it onto a generic list.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2">
                        {milestones.map((m, i) => (
                            <div
                                key={m.year}
                                className="scroll-animate relative border-l-2 border-brand-light/60 pl-8 opacity-0 translate-y-6"
                                style={{ transitionDelay: `${i * 90}ms` }}
                            >
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-brand-dark bg-white" />
                                <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-brand-medium">
                                    {m.year}
                                </span>
                                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-medium text-brand-darkest">
                                    {m.title}
                                </h3>
                                <p className="mt-2 text-brand-dark/75">{m.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ MISSION & VISION ============ */}
            <section className="bg-brand-tint-subtle py-16">
                <div className="mx-auto max-w-6xl px-6 sm:px-10">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="scroll-animate rounded-3xl bg-gradient-brand-primary p-10 text-white opacity-0 translate-y-6">
                            <Icon name="compass" />
                            <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-medium">
                                Our Mission
                            </h3>
                            <p className="mt-4 text-white/85">
                                To carve personal, meaningful journeys for every kind of
                                traveler &mdash; itineraries shaped around who you are, not
                                who the average customer is assumed to be.
                            </p>
                        </div>

                        <div
                            className="scroll-animate rounded-3xl border border-brand-light/50 bg-white p-10 opacity-0 translate-y-6"
                            style={{ transitionDelay: '90ms' }}
                        >
                            <div className="text-brand-dark">
                                <Icon name="map" />
                            </div>
                            <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-medium text-brand-darkest">
                                Our Vision
                            </h3>
                            <p className="mt-4 text-brand-dark/75">
                                To become the most trusted name in hand-carved travel &mdash;
                                connecting travelers to fifty countries and counting, one
                                thoughtfully built trip at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ WHY CHOOSE US ============ */}
            <section className="bg-white pt-16 pb-28">
                <div className="mx-auto max-w-6xl px-6 sm:px-10">
                    <div className="scroll-animate max-w-2xl opacity-0 translate-y-6">
                        <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.35em] text-brand-medium uppercase">
                            Why Travel Carvers
                        </span>
                        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium text-brand-darkest sm:text-4xl">
                            Six reasons travelers keep coming back
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {whyChooseUs.map((item, i) => (
                            <div
                                key={item.title}
                                className="scroll-animate opacity-0 translate-y-6"
                                style={{ transitionDelay: `${i * 70}ms` }}
                            >
                                <div className="group h-full flex flex-col rounded-2xl border border-brand-light/40 p-7 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-brand-medium/60 hover:shadow-2xl hover:shadow-brand-light/20">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-lightest text-brand-dark transition group-hover:bg-brand-dark group-hover:text-white">
                                        <Icon name={item.icon} />
                                    </div>
                                    <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-medium text-brand-darkest">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-brand-dark/70 flex-grow">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ STATISTICS ============ */}
            <section className="relative overflow-hidden bg-gradient-brand-dark py-24 text-white">
                <ContourLines tone="light" className="absolute inset-x-0 top-0 h-32 w-full opacity-50" />
                <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className="scroll-animate text-center opacity-0 translate-y-6 sm:text-left"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="font-[family-name:var(--font-mono)] text-4xl font-semibold sm:text-5xl">
                                    {s.decimal ? (
                                        <>4.9{s.suffix}</>
                                    ) : (
                                        <CountUp target={s.value} suffix={s.suffix} />
                                    )}
                                </div>
                                <p className="mt-2 text-sm tracking-wide text-white/70 uppercase">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TEAM ============ */}
            <section className="bg-white py-28">
                <div className="mx-auto max-w-6xl px-6 sm:px-10">
                    <div className="scroll-animate max-w-2xl opacity-0 translate-y-6">
                        <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.35em] text-brand-medium uppercase">
                            The Carvers
                        </span>
                        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium text-brand-darkest sm:text-4xl">
                            The people shaping your next trail
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {team.map((member, i) => (
                            <div
                                key={member.name}
                                className="scroll-animate opacity-0 translate-y-6"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                {/* NEW PREMIUM EDITORIAL CARD LAYOUT */}
                                <div className="group flex flex-col cursor-pointer">
                                    {/* Image Container - Aspect ratio ensures perfect professional proportions */}
                                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 transform-gpu shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                                        <Image
                                            src={member.imageUrl}
                                            alt={member.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
                                        />
                                        {/* Subtle overlay for depth */}
                                        <div className="absolute inset-0 bg-[#1A3C34]/0 transition-colors duration-500 group-hover:bg-[#1A3C34]/10" />

                                        {/* Elegant slide-up connect button */}
                                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A3C34] shadow-lg hover:bg-[#1A3C34] hover:text-white transition-colors duration-300">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Minimalist Text Area */}
                                    <div className="mt-5 flex flex-col px-1">
                                        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1A3C34] group-hover:text-[#5F6F52] transition-colors duration-300">
                                            {member.name}
                                        </h3>
                                        <p className="mt-1 text-xs font-semibold tracking-wider text-[#5F6F52]/80 uppercase">
                                            {member.role}
                                        </p>
                                        {/* Minimalist extending underline accent */}
                                        <div className="mt-4 flex items-center">
                                            <span className="h-[2px] w-8 bg-[#A9B388] transition-all duration-500 ease-out group-hover:w-16"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="relative overflow-hidden bg-brand-lightest py-24 text-brand-darkest">
                <ContourLines tone="dark" className="absolute inset-x-0 bottom-0 h-32 w-full opacity-30" />
                <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center sm:px-10">
                    <h2 className="scroll-animate font-[family-name:var(--font-display)] text-4xl font-medium opacity-0 translate-y-6 sm:text-5xl text-brand-darkest">
                        Start Your Journey
                    </h2>
                    <p className="scroll-animate mt-5 max-w-xl text-brand-dark/85 opacity-0 translate-y-6" style={{ transitionDelay: '80ms' }}>
                        Fifty countries are already mapped out. Tell us where you want the
                        trail to start, and we&apos;ll carve the rest.
                    </p>
                    <div
                        className="scroll-animate mt-9 flex flex-wrap items-center justify-center gap-4 opacity-0 translate-y-6"
                        style={{ transitionDelay: '150ms' }}
                    >
                        <Link
                            href="/packages"
                            className="rounded-full bg-brand-darkest px-8 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Browse Trips
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-full border border-brand-darkest px-8 py-3 font-medium text-brand-darkest transition hover:bg-brand-darkest hover:!text-white"
                        >
                            Talk to a Carver
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}