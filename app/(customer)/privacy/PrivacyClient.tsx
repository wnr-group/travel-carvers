'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Database,
  Eye,
  Cookie,
  Lock,
  Server,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'introduction',
    icon: <Shield className="w-5 h-5" />,
    title: '1. Introduction',
    content: (
      <>
        <p className="mb-4">
          At <strong>Travel Carvers</strong>, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.
        </p>
        <p>
          This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or book travel packages through our platform. Please read this policy carefully to understand our practices regarding your personal data.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    icon: <Database className="w-5 h-5" />,
    title: '2. Information We Collect',
    content: (
      <>
        <p className="mb-4">
          We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about our travel packages, or otherwise contact us.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li><strong>Personal Information:</strong> Name, email address, phone number, billing address, and payment information.</li>
          <li><strong>Traveler Details:</strong> Passport information, dietary requirements, and medical conditions (only when necessary for booking specific tours).</li>
          <li><strong>Automatically Collected Data:</strong> IP address, browser characteristics, device IDs, operating system, and data about how and when you use our platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    icon: <Eye className="w-5 h-5" />,
    title: '3. How We Use Your Information',
    content: (
      <>
        <p className="mb-4">
          We process your personal information for a variety of legitimate business purposes, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li><strong>Booking Fulfillment:</strong> To process your travel reservations, issue tickets, and coordinate with local guides and hotels.</li>
          <li><strong>Communication:</strong> To send you booking confirmations, itinerary updates, and respond to customer service inquiries.</li>
          <li><strong>Marketing (with consent):</strong> To send you promotional emails about new tour packages, exclusive offers, and travel inspiration.</li>
          <li><strong>Service Improvement:</strong> To analyze user trends and improve the functionality and user experience of our website.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-and-tracking',
    icon: <Cookie className="w-5 h-5" />,
    title: '4. Cookies and Tracking',
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Cookies help us remember your preferences, keep you logged in, and understand how you interact with our platform so we can optimize your experience.
        </p>
        <p className="mt-4">
          You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. However, if you disable or refuse cookies, please note that some parts of our website may become inaccessible or not function properly.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    icon: <Lock className="w-5 h-5" />,
    title: '5. Data Security',
    content: (
      <>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes using SSL/TLS encryption for data transmission and secure server infrastructure for storage.
        </p>
        <p className="mt-4 text-sm text-slate-500 italic">
          However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-services',
    icon: <Server className="w-5 h-5" />,
    title: '6. Third-Party Services',
    content: (
      <>
        <p className="mb-4">
          To provide our services efficiently, we share certain information with trusted third-party service providers. We only share the minimum data necessary for these services to function:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-slate-700">
          <li>
            <strong>Supabase:</strong> We use Supabase as our primary backend infrastructure and database provider. Your user credentials, booking history, and profile data are securely stored in Supabase databases, which comply with strict international security standards.
          </li>
          <li>
            <strong>Mailgun:</strong> We use Mailgun to manage and deliver our transactional emails (like booking confirmations and password resets) as well as marketing newsletters. Your email address and name are shared with Mailgun solely for the purpose of email delivery.
          </li>
          <li>
            <strong>Travel Partners:</strong> Airlines, hotels, and local tour operators require your details to fulfill your actual travel itinerary.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    icon: <UserCheck className="w-5 h-5" />,
    title: '7. Your Rights',
    content: (
      <>
        <p className="mb-4">
          Depending on your location, you may have specific rights regarding your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li>The right to request access to the data we have collected about you.</li>
          <li>The right to request that we correct any inaccurate or incomplete personal information.</li>
          <li>The right to request the deletion of your personal data (&quot;Right to be Forgotten&quot;).</li>
          <li>The right to opt-out of marketing communications at any time by clicking the &quot;unsubscribe&quot; link in our emails.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    icon: <Baby className="w-5 h-5" />,
    title: '8. Children\'s Privacy',
    content: (
      <>
        <p>
          Our services are not directed to, and we do not knowingly collect personal information from, children under the age of 13 (or 18 in certain jurisdictions) without verifiable parental consent. If we become aware that we have collected personal information from a minor without such consent, we will take immediate steps to delete that information from our servers.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-policy',
    icon: <RefreshCw className="w-5 h-5" />,
    title: '9. Changes to Privacy Policy',
    content: (
      <>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
        </p>
      </>
    ),
  },
  {
    id: 'contact-us',
    icon: <Mail className="w-5 h-5" />,
    title: '10. Contact Us',
    content: (
      <>
        <p className="mb-4">
          If you have questions or comments about this policy, or wish to exercise your data rights, you may contact our Data Protection Officer at:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-medium text-slate-800">Travel Carvers Privacy Team</p>
          <p className="text-slate-600 mt-1">Email: <a href="mailto:privacy@travelcarvers.com" className="text-brand-medium hover:underline">privacy@travelcarvers.com</a></p>
          <p className="text-slate-600">Address: 123 Explorer Way, Wanderlust City, WL 45678</p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
            <li className="font-medium text-white">Privacy Policy</li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto relative z-10 text-center py-12 sm:py-16">
          <p className="text-brand-light text-sm font-bold tracking-widest uppercase mb-3">Legal Information</p>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            How we collect, use, and protect your personal information at Travel Carvers. Last updated: July 2026.
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

        {/* Privacy Content */}
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
            <h4 className="font-semibold text-brand-darkest mb-2">Have concerns about your data?</h4>
            <p className="text-sm text-slate-600 mb-4">
              Our privacy team is available to help you exercise your data rights or answer any questions.
            </p>
            <a
              href="mailto:privacy@travelcarvers.com"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-medium hover:bg-brand-darkest text-white text-sm font-semibold transition-colors"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}