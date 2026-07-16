// import { Metadata } from 'next';
// import { createMetadata } from '@/lib/seo';
// import PrivacyClient from './PrivacyClient';

// export const metadata: Metadata = createMetadata({
//   title: 'Privacy Policy | Travel Carvers',
//   description: 'Understand how Travel Carvers collects, uses, and protects your personal data when booking tour packages or using our website.',
//   path: '/privacy',
// });

// export default function PrivacyPage() {
//   return <PrivacyClient />;
// }

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, CreditCard, Plane, AlertCircle, Scale, ChevronRight } from 'lucide-react';

// Define the sections for the T&C
const SECTIONS = [
  {
    id: 'acceptance',
    icon: <FileText className="w-5 h-5" />,
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p className="mb-4">
          By accessing and using the services provided by <strong>Travel Carvers</strong> ("we," "us," or "our"), including booking any tour packages, you agree to be bound by these Terms and Conditions.
        </p>
        <p>
          If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting on our platform.
        </p>
      </>
    ),
  },
  {
    id: 'booking',
    icon: <CreditCard className="w-5 h-5" />,
    title: '2. Booking & Payments',
    content: (
      <>
        <p className="mb-4">
          To secure a reservation, a non-refundable deposit (typically 25% of the total package cost) is required at the time of booking. The exact deposit amount will be communicated during the enquiry process.
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700">
          <li>The remaining balance must be paid in full at least 30 days prior to the departure date.</li>
          <li>For bookings made within 30 days of departure, full payment is required immediately.</li>
          <li>We accept payments via Credit/Debit Card, Net Banking, and UPI. All transactions are processed securely.</li>
        </ul>
        <p>
          Failure to remit the final payment by the due date may result in the automatic cancellation of your booking without a refund of the initial deposit.
        </p>
      </>
    ),
  },
  {
    id: 'cancellations',
    icon: <AlertCircle className="w-5 h-5" />,
    title: '3. Cancellations & Refunds',
    content: (
      <>
        <p className="mb-4">
          We understand that plans change. Our cancellation policy is designed to be as fair as possible while covering the non-refundable costs we incur from our travel partners.
        </p>
        <div className="overflow-hidden rounded-xl border border-[#A9B388]/40 mb-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#1A3C34] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Time of Cancellation</th>
                <th className="px-4 py-3 font-semibold">Refund Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A9B388]/30 bg-white">
              <tr>
                <td className="px-4 py-3 text-slate-800">30+ days before departure</td>
                <td className="px-4 py-3 font-medium text-[#1A3C34]">90% of total cost</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 text-slate-800">15–29 days before departure</td>
                <td className="px-4 py-3 font-medium text-[#1A3C34]">50% of total cost</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-800">7–14 days before departure</td>
                <td className="px-4 py-3 font-medium text-[#1A3C34]">25% of total cost</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 text-slate-800">Within 7 days of departure</td>
                <td className="px-4 py-3 font-medium text-red-600">No Refund</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'documents',
    icon: <Plane className="w-5 h-5" />,
    title: '4. Travel Documents & Insurance',
    content: (
      <>
        <p className="mb-4">
          It is the sole responsibility of the traveler to ensure they have all necessary documentation for their trip.
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700">
          <li><strong>Passports:</strong> Must be valid for at least 6 months beyond the date of return.</li>
          <li><strong>Visas:</strong> Travelers must obtain the correct visas for their destination. Travel Carvers can assist with information, but the final responsibility lies with the client.</li>
          <li><strong>Insurance:</strong> We strongly recommend purchasing comprehensive travel insurance that covers cancellations, medical emergencies, and lost baggage. Travel Carvers is not liable for costs arising from uninsured travel.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'liability',
    icon: <ShieldCheck className="w-5 h-5" />,
    title: '5. Liability & Responsibilities',
    content: (
      <>
        <p className="mb-4">
          Travel Carvers acts strictly as an agent for airlines, hotels, transport operators, and local guides. We are not responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li>Delays, cancellations, or overbookings by third-party service providers.</li>
          <li>Loss, damage, or theft of personal luggage or belongings.</li>
          <li>Personal injury, accidents, or illnesses sustained during the tour.</li>
          <li>Changes to the itinerary necessitated by weather conditions, political unrest, or force majeure events.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conduct',
    icon: <Scale className="w-5 h-5" />,
    title: '6. Code of Conduct',
    content: (
      <>
        <p>
          Travelers are expected to behave in a respectful manner towards fellow travelers, guides, and locals. Travel Carvers reserves the right to terminate a traveler's participation in a tour without refund if their behavior is deemed disruptive, illegal, or dangerous to themselves or others.
        </p>
      </>
    ),
  },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  // ScrollSpy functionality to highlight sidebar items on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map((s) => document.getElementById(s.id));

      let currentActiveId = activeSection;

      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section is near the top of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentActiveId = el.id;
          }
        }
      }

      if (currentActiveId !== activeSection) {
        setActiveSection(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for fixed headers
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-body text-slate-800">

      {/* Hero Header */}
      <header className="bg-[#1A3C34] py-16 px-5 sm:px-8 relative overflow-hidden">
        {/* Subtle background pattern/overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#A9B388] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-[#A9B388] text-sm font-bold tracking-widest uppercase mb-3">Legal Information</p>
          <h1 className="text-3xl sm:text-5xl font-display font-semibold text-white mb-4">
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
          <div className="sticky top-28 bg-white rounded-2xl border border-[#A9B388]/30 shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#1A3C34] uppercase tracking-wider mb-4 pb-4 border-b border-slate-100">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${activeSection === section.id
                      ? 'bg-[#1A3C34]/5 text-[#1A3C34] font-semibold'
                      : 'text-slate-500 hover:text-[#1A3C34] hover:bg-slate-50'
                    }`}
                >
                  <span className={activeSection === section.id ? 'text-[#5F7A5F]' : 'text-slate-400'}>
                    {section.icon}
                  </span>
                  {section.title}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-[#5F7A5F]" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC (Dropdown style fallback) */}
        <div className="lg:hidden bg-white p-4 rounded-xl border border-[#A9B388]/30 shadow-sm mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Jump to section:</h3>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium border transition-colors ${activeSection === section.id
                    ? 'bg-[#1A3C34] border-[#1A3C34] text-white'
                    : 'bg-white border-slate-200 text-slate-600'
                  }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <main className="flex-1 max-w-4xl bg-white rounded-2xl border border-[#A9B388]/30 shadow-sm p-6 sm:p-10">
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A3C34]/5 text-[#1A3C34]">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-display font-semibold text-[#1A3C34]">
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

          <div className="mt-12 p-6 bg-[#F4F1EA] rounded-xl border border-[#A9B388]/30 text-center">
            <h4 className="font-semibold text-[#1A3C34] mb-2">Still have questions?</h4>
            <p className="text-sm text-slate-600 mb-4">
              If you have any queries regarding our terms and conditions, our team is here to help.
            </p>
            <a
              href="mailto:support@travelcarvers.com"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#5F7A5F] hover:bg-[#1A3C34] text-white text-sm font-semibold transition-colors"
            >
              Contact Support
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}