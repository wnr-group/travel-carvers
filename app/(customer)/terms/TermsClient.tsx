'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Globe,
  Award,
  CreditCard,
  Users,
  ShieldAlert,
  Lock,
  RefreshCw,
  Mail,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'introduction',
    icon: <FileText className="w-5 h-5" />,
    title: '1. Introduction',
    content: (
      <>
        <p className="mb-4">
          Welcome to <strong>Travel Carvers</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms and Conditions govern your access to and use of our website, mobile application, and travel booking services.
        </p>
        <p>
          By accessing our platform or booking a package with us, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, please refrain from using our services.
        </p>
      </>
    ),
  },
  {
    id: 'use-of-website',
    icon: <Globe className="w-5 h-5" />,
    title: '2. Use of Website',
    content: (
      <>
        <p className="mb-4">
          You must be at least 18 years old and possess the legal authority to enter into this agreement to use our website and book services.
        </p>
        <p>
          You agree to use the website only for legitimate and lawful purposes, such as gathering travel information and making legitimate reservations. You are prohibited from using this site for any speculative, false, or fraudulent claims or reservations.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    icon: <Award className="w-5 h-5" />,
    title: '3. Intellectual Property',
    content: (
      <>
        <p>
          All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Travel Carvers or its content suppliers and is protected by international copyright and trademark laws.
        </p>
        <p className="mt-4">
          You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information obtained from this website without prior written consent from Travel Carvers.
        </p>
      </>
    ),
  },
  {
    id: 'booking-terms',
    icon: <CreditCard className="w-5 h-5" />,
    title: '4. Booking Terms',
    content: (
      <>
        <p className="mb-4">
          All bookings are subject to availability and acceptance by us. A booking is only confirmed once we receive your initial deposit and issue a formal confirmation receipt.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li><strong>Payments:</strong> A non-refundable deposit is required at booking. Final balances must be cleared 30 days prior to departure.</li>
          <li><strong>Cancellations:</strong> Cancellations must be submitted in writing. Refund amounts vary based on the proximity to the departure date.</li>
          <li><strong>Pricing:</strong> We reserve the right to alter pricing before your final booking confirmation due to currency fluctuations or supplier price hikes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'user-conduct',
    icon: <Users className="w-5 h-5" />,
    title: '5. User Conduct',
    content: (
      <>
        <p>
          During any tour booked through Travel Carvers, you are expected to behave appropriately and respectfully toward fellow travelers, guides, and locals. We reserve the right to decline, accept, or retain any person as a member of a tour if their conduct is deemed disruptive or endangers the safety of others. No refunds will be provided in such circumstances.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    icon: <ShieldAlert className="w-5 h-5" />,
    title: '6. Limitation of Liability',
    content: (
      <>
        <p className="mb-4">
          Travel Carvers acts strictly as an agent for third-party suppliers (e.g., airlines, hotels, transport operators). We are not liable for:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 mb-4">
          <li>Errors, omissions, or defaults of any third-party suppliers.</li>
          <li>Loss, injury, damage, or accidents impacting personal property or health.</li>
          <li>Delays or itinerary changes caused by weather, strikes, natural disasters, or other Force Majeure events.</li>
        </ul>
        <p>
          Your absolute risk regarding travel is your own, and we highly recommend obtaining comprehensive travel insurance prior to departure.
        </p>
      </>
    ),
  },
  {
    id: 'privacy-policy',
    icon: <Lock className="w-5 h-5" />,
    title: '7. Privacy Policy',
    content: (
      <>
        <p>
          Your privacy is vital to us. Our use of your personal information is governed by our Privacy Policy. By using our services, you consent to the collection and use of your data as outlined in that document.
        </p>
        <p className="mt-4">
          <Link href="/privacy" className="text-brand-medium font-semibold hover:underline">
            Read our full Privacy Policy →
          </Link>
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-terms',
    icon: <RefreshCw className="w-5 h-5" />,
    title: '8. Changes to Terms',
    content: (
      <>
        <p>
          We reserve the right to update, modify, or replace any part of these Terms and Conditions by posting updates to our website. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    icon: <Mail className="w-5 h-5" />,
    title: '9. Contact Information',
    content: (
      <>
        <p className="mb-4">
          If you have any questions or concerns regarding these Terms and Conditions, please contact us:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-medium text-slate-800">Travel Carvers Legal Department</p>
          <p className="text-slate-600 mt-1">Email: <a href="mailto:legal@travelcarvers.com" className="text-brand-medium hover:underline">legal@travelcarvers.com</a></p>
          <p className="text-slate-600">Phone: +1 (800) 123-4567</p>
        </div>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  // ScrollSpy: highlight the section currently in view via IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // Pick the section closest to the top of the viewport.
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveSection(topmost.target.id);
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    const elements = SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-tint-subtle text-slate-800">

      {/* Hero Header */}
      <header className="bg-brand-darkest relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-light via-transparent to-transparent pointer-events-none" />

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="relative z-10 mx-auto max-w-7xl px-5 pt-6 sm:px-8 text-xs text-white/70">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="font-medium text-white">Terms & Conditions</li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto relative z-10 text-center py-12 sm:py-16">
          <p className="text-brand-light text-sm font-bold tracking-widest uppercase mb-3">Legal Information</p>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Please read these terms carefully before booking your journey with Travel Carvers. Last updated: July 2026.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col lg:flex-row gap-10">

        {/* Interactive Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 bg-white rounded-2xl border border-brand-light/30 shadow-sm p-5">
            <h3 className="text-sm font-bold text-brand-darkest uppercase tracking-wider mb-4 pb-4 border-b border-slate-100">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${activeSection === section.id
                      ? 'bg-brand-darkest/5 text-brand-darkest font-semibold'
                      : 'text-slate-500 hover:text-brand-darkest hover:bg-slate-50'
                    }`}
                >
                  <span className={activeSection === section.id ? 'text-brand-medium' : 'text-slate-400'}>
                    {section.icon}
                  </span>
                  {section.title}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-brand-medium" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC (Dropdown style fallback) */}
        <div className="lg:hidden bg-white p-4 rounded-xl border border-brand-light/30 shadow-sm mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Jump to section:</h3>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium border transition-colors ${activeSection === section.id
                    ? 'bg-brand-darkest border-brand-darkest text-white'
                    : 'bg-white border-slate-200 text-slate-600'
                  }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <div className="flex-1 max-w-4xl bg-white rounded-2xl border border-brand-light/30 shadow-sm p-6 sm:p-10">
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-darkest/5 text-brand-darkest">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-brand-darkest">
                    {section.title}
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  {section.content}
                </div>

                {/* Divider */}
                {section.id !== SECTIONS[SECTIONS.length - 1].id && (
                  <hr className="mt-12 border-slate-100" />
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 p-6 bg-brand-lightest rounded-xl border border-brand-light/30 text-center">
            <h4 className="font-semibold text-brand-darkest mb-2">Still have questions?</h4>
            <p className="text-sm text-slate-600 mb-4">
              If you have any queries regarding our terms and conditions, our team is here to help.
            </p>
            <a
              href="mailto:legal@travelcarvers.com"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-medium hover:bg-brand-darkest text-white text-sm font-semibold transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}