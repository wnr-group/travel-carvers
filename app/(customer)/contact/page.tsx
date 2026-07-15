

"use client";

import { useState, useEffect } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


type IconProps = { className?: string; strokeWidth?: number };

function FacebookIcon({ className, strokeWidth = 1.75 }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon({ className, strokeWidth = 1.75 }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function TwitterIcon({ className, strokeWidth = 1.75 }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M4 4l7.2 9.6L4.4 20H7l5.6-5.4L17 20h3l-7.5-10L20 4h-2.6l-5 4.8L8 4z" />
        </svg>
    );
}

function LinkedinIcon({ className, strokeWidth = 1.75 }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="7.5" y1="10" x2="7.5" y2="17" />
            <circle cx="7.5" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
            <path d="M12 17v-4.2a2.3 2.3 0 0 1 4.6 0V17" />
            <line x1="12" y1="10" x2="12" y2="17" />
        </svg>
    );
}



/* -------------------------------------------------------------------------
   Replace these with real values before shipping:
   - PHONE_DISPLAY / PHONE_TEL: real support number
   - ADDRESS_*: real HQ address
   - MAP_BBOX / MAP_MARKER: real lat/lon for the office
------------------------------------------------------------------------- */
const PHONE_DISPLAY = "+91 98765 43210";
const PHONE_TEL = "+919876543210";
const EMAIL = "info@travelcarvers.com";
const ADDRESS_LINE1 = "Travel Carvers HQ";
const ADDRESS_LINE2 = "3rd Floor, Brigade Towers, Brigade Road";
const ADDRESS_LINE3 = "Bengaluru, Karnataka 560001, India";

const MAP_LON = 77.5946;
const MAP_LAT = 12.9716;
const MAP_BBOX = `${MAP_LON - 0.02}%2C${MAP_LAT - 0.015}%2C${MAP_LON + 0.02}%2C${MAP_LAT + 0.015
    }`;
const MAP_MARKER = `${MAP_LAT}%2C${MAP_LON}`;

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

const OFFICE_HOURS = [
    { day: "Monday – Saturday", time: "9:00 AM – 7:00 PM" },
    { day: "Sunday", time: "Closed" },
];

const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://facebook.com/travelcarvers", Icon: FacebookIcon },
    { label: "Instagram", href: "https://instagram.com/travelcarvers", Icon: InstagramIcon },
    { label: "Twitter", href: "https://twitter.com/travelcarvers", Icon: TwitterIcon },
    { label: "LinkedIn", href: "https://linkedin.com/company/travelcarvers", Icon: LinkedinIcon },
];

function validate(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
        errors.name = "Tell us your name.";
    }

    if (!data.email.trim()) {
        errors.email = "Add an email so we can reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = "That email doesn't look right.";
    }

    if (!data.phone.trim()) {
        errors.phone = "Add a phone number so we can reach you.";
    } else if (!/^[+\d][\d\s-]{7,14}$/.test(data.phone.trim())) {
        errors.phone = "Use digits only, 8–15 characters.";
    }

    if (!data.message.trim()) {
        errors.message = "Let us know what you need help with.";
    } else if (data.message.trim().length < 10) {
        errors.message = "A few more details will help us respond faster.";
    }

    return errors;
}

export default function ContactPage() {
    const [formData, setFormData] = useState<FormData>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
            title: "Begin Your Journey",
            tagline: "Every itinerary we carve starts with a conversation.",
            description: "Crafting bespoke expeditions for the discerning traveler. Reach out to our travel designers to curate your next masterpiece."
        },
        {
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
            title: "Carve the Unknown",
            tagline: "Explore untouched peaks and hidden valleys.",
            description: "Our destination experts design paths less traveled, ensuring every step of your adventure is uniquely yours."
        },
        {
            image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
            title: "Tailored to Perfection",
            tagline: "Your dreams, meticulously sculpted.",
            description: "From luxury retreats to thrilling safaris, we handle every detail so you can immerse yourself in the experience."
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    function handleChange(
        field: keyof FormData
    ): (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
        return (e) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        };
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const nextErrors = validate(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setStatus("submitting");

        // Simulated submit — wire this up to a real API route or email service.
        window.setTimeout(() => {
            setStatus("success");
            setFormData(initialForm);
        }, 900);
    }

    return (
        <main className="bg-background">
            {/* INTERACTIVE HERO SLIDER - BOXED BANNER LAYOUT */}
            <section className="mx-auto max-w-6xl px-6 pt-8 pb-8 animate-in fade-in slide-in-from-top-6 duration-1000">
                <div className="relative overflow-hidden rounded-[2rem] text-white shadow-2xl border border-brand-light/10 h-[400px] sm:h-[460px] group">

                    {/* Background Slider Images */}
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            {/* Slide Image */}
                            <div
                                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[6000ms] ease-out ${index === currentSlide ? "scale-105" : "scale-100"
                                    }`}
                                style={{ backgroundImage: `url("${slide.image}")` }}
                            />
                            {/* Vignette Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-brand-darkest/95 via-black/30 to-black/30 z-10" />
                        </div>
                    ))}

                    {/* Content Container Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 text-center px-6 sm:px-12 md:px-20">
                        <div className="relative w-full max-w-3xl min-h-[220px] flex items-center justify-center">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-x-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${index === currentSlide
                                            ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
                                            : "opacity-0 translate-y-4 z-0 pointer-events-none"
                                        }`}
                                >
                                    <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-brand-lightest/90 mb-3 sm:mb-4">
                                        {slide.tagline}
                                    </span>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                    <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto font-medium drop-shadow-md leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left/Right Navigation Arrows */}
                    <div className="absolute inset-x-4 sm:inset-x-6 top-1/2 -translate-y-1/2 z-30 flex justify-between pointer-events-none">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95 pointer-events-auto opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            className="p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95 pointer-events-auto opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Slide Indicators (Dots) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </section>

            {/* Form + Info */}
            <section className="bg-transparent">
                <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Contact form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-brand-light/40 shadow-lg shadow-brand-dark/5 p-6 sm:p-8">
                            {status === "success" ? (
                                <div className="flex flex-col items-center text-center py-10">
                                    <CheckCircle2
                                        className="w-14 h-14 text-brand-dark"
                                        strokeWidth={1.5}
                                    />
                                    <h2 className="mt-4 text-2xl font-semibold text-brand-darkest">
                                        Message sent
                                    </h2>
                                    <p className="mt-2 max-w-sm text-secondary">
                                        Thanks for reaching out. A Travel Carvers specialist
                                        will reply to your email within one business day.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStatus("idle")}
                                        className="mt-6 inline-flex items-center rounded-full border border-brand-medium px-5 py-2 text-sm font-medium text-brand-dark hover:bg-brand-lightest/60 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    <h2 className="text-2xl font-semibold text-brand-darkest">
                                        Send us a message
                                    </h2>
                                    <p className="mt-1 text-sm text-secondary">
                                        Fields marked * are required.
                                    </p>

                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Field
                                            label="Name *"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange("name")}
                                            error={errors.name}
                                            autoComplete="name"
                                            placeholder="Your full name"
                                        />
                                        <Field
                                            label="Email *"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange("email")}
                                            error={errors.email}
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                        />
                                        <Field
                                            label="Phone *"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange("phone")}
                                            error={errors.phone}
                                            autoComplete="tel"
                                            placeholder="+91 98765 43210"
                                        />
                                        <Field
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange("subject")}
                                            error={errors.subject}
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-brand-darkest"
                                        >
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange("message")}
                                            placeholder="Tell us about the trip you're planning, dates, group size, or anything else that helps."
                                            className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-foreground placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-medium/40 transition-colors ${errors.message
                                                ? "border-red-400"
                                                : "border-brand-light/60 focus:border-brand-medium"
                                                }`}
                                        />
                                        {errors.message && (
                                            <ErrorText message={errors.message} />
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-dark/20 hover:shadow-lg hover:scale-105 disabled:opacity-70 transition-all"
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact info — presented as a small route/itinerary */}
                    <div className="lg:col-span-2">
                        <div className="relative pl-9">
                            <span
                                aria-hidden="true"
                                className="absolute left-[7px] top-2 bottom-2 border-l-2 border-dashed border-brand-medium/50"
                            />

                            <InfoStop icon={MapPin} title="Visit us">
                                <address className="not-italic text-secondary leading-relaxed">
                                    {ADDRESS_LINE1}
                                    <br />
                                    {ADDRESS_LINE2}
                                    <br />
                                    {ADDRESS_LINE3}
                                </address>
                            </InfoStop>

                            <InfoStop icon={Phone} title="Call us">
                                <a
                                    href={`tel:${PHONE_TEL}`}
                                    className="text-brand-dark font-medium hover:underline underline-offset-4"
                                >
                                    {PHONE_DISPLAY}
                                </a>
                            </InfoStop>

                            <InfoStop icon={Mail} title="Email us">
                                <a
                                    href={`mailto:${EMAIL}`}
                                    className="text-brand-dark font-medium hover:underline underline-offset-4"
                                >
                                    {EMAIL}
                                </a>
                            </InfoStop>

                            <InfoStop icon={Clock} title="Office hours" last>
                                <ul className="text-secondary space-y-0.5">
                                    {OFFICE_HOURS.map((row) => (
                                        <li key={row.day} className="flex justify-between gap-4">
                                            <span>{row.day}</span>
                                            <span className="font-medium text-brand-darkest">
                                                {row.time}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoStop>
                        </div>

                        {/* Social links */}
                        <div className="mt-8 pl-9">
                            <p className="text-sm font-semibold text-brand-darkest">
                                Follow the journey
                            </p>
                            <div className="mt-3 flex gap-3">
                                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lightest/70 text-brand-dark hover:bg-brand-medium hover:text-white transition-colors"
                                    >
                                        <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
                <h2 className="text-2xl font-semibold text-brand-darkest mb-4">
                    Find our office
                </h2>
                <div className="overflow-hidden rounded-2xl border border-brand-light/40 shadow-md shadow-brand-dark/5">
                    <iframe
                        title="Travel Carvers HQ location"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${MAP_MARKER}`}
                        className="w-full h-[360px] sm:h-[420px] border-0"
                        loading="lazy"
                    />
                </div>
                <p className="mt-2 text-xs text-secondary">
                    Map data ©{" "}
                    <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                    >
                        OpenStreetMap
                    </a>{" "}
                    contributors.
                </p>
            </section>
        </main>
    );
}

/* ------------------------------- Sub-components ------------------------------- */

function Field({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    autoComplete,
    placeholder,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    autoComplete?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-brand-darkest">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-medium/40 transition-colors ${error
                    ? "border-red-400"
                    : "border-brand-light/60 focus:border-brand-medium"
                    }`}
            />
            {error && <ErrorText message={error} />}
        </div>
    );
}

function ErrorText({ message }: { message: string }) {
    return (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {message}
        </p>
    );
}

function InfoStop({
    icon: Icon,
    title,
    children,
    last = false,
}: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div className={`relative ${last ? "" : "pb-7"}`}>
            <span className="absolute -left-9 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark text-white ring-4 ring-brand-tint-light">
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm font-semibold text-brand-darkest">{title}</h3>
            <div className="mt-1 text-sm">{children}</div>
        </div>
    );
}