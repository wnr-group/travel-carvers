'use client';

import { useState } from 'react';
import { useCreateLead } from '@/lib/hooks/useLeads';
import { leadSchema } from '@/lib/validations/lead.schema';
import { z } from 'zod';
import { User, Mail, Phone, Calendar, MessageSquare, ChevronRight } from 'lucide-react';

interface LeadFormProps {
  packageId?: string;
  packageTitle?: string;
  onSuccess?: () => void;
}

export function LeadForm({ packageId, packageTitle, onSuccess }: LeadFormProps) {
  const createLead = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    package_id: packageId || '',
    name: '',
    email: '',
    phone: '',
    number_of_adults: 2,
    number_of_children: 0,
    number_of_infants: 0,
    travel_start_date: '',
    travel_end_date: '',
    message: '',
    source: 'website',
  });

  const [errors, setErrors] = useState<Record<string, string | string[] | undefined>>({});

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const leadData = {
        package_id: formData.package_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || undefined,
        number_of_adults: formData.number_of_adults,
        number_of_children: formData.number_of_children,
        number_of_infants: formData.number_of_infants,
        travel_start_date: formData.travel_start_date,
        travel_end_date: formData.travel_end_date || undefined,
      };

      const validated = leadSchema.parse(leadData);
      await createLead.mutateAsync(validated);

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        // Reset form
        setFormData({
          package_id: packageId || '',
          name: '',
          email: '',
          phone: '',
          number_of_adults: 2,
          number_of_children: 0,
          number_of_infants: 0,
          travel_start_date: '',
          travel_end_date: '',
          message: '',
          source: 'website',
        });
        setTimeout(() => setIsSuccess(false), 500);
      }, 3000);

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const path = issue.path[0] != null ? String(issue.path[0]) : null;
          if (path && !fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: 'Failed to submit inquiry. Please try again.' });
      }
    }
  };

  const handleStepper = (field: 'number_of_adults' | 'number_of_children' | 'number_of_infants', delta: number) => {
    setFormData(prev => {
      const current = prev[field];
      const minVal = field === 'number_of_adults' ? 1 : 0;
      const nextVal = Math.max(minVal, current + delta);
      return { ...prev, [field]: nextVal };
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      const fieldSchema = (leadSchema.shape as any)[field];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (result.success) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        } else {
          setErrors(prev => ({ ...prev, [field]: result.error.issues?.[0]?.message || result.error.message }));
        }
      } else {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const inputClasses = "w-full pl-11 pr-4 py-3 bg-[var(--background)] border border-brand-medium rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-lightest/40 focus:border-brand-dark transition-all duration-300 text-brand-darkest placeholder-brand-medium/50 shadow-sm text-sm";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-brand-darkest mb-1.5 ml-1";

  if (isSuccess) {
    return (
      <div role="status" className="flex flex-col items-center justify-center py-10 px-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-sm border border-emerald-200">
          <svg aria-hidden="true" className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-brand-darkest mb-2 tracking-tight">
          Inquiry Received!
        </h3>
        <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-6">
          Your travel request is confirmed. Our specialists will customize your experience and get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => onSuccess?.()}
          className="rounded-full bg-brand-dark px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-darkest hover:shadow-md cursor-pointer"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-light/70 pb-4">
        <h2 className="text-brand-darkest font-display text-2xl font-semibold tracking-tight uppercase">
          Craft Your Journey
        </h2>
        <p className="text-slate-600 text-sm font-normal mt-1">
          Fill in your preferences, and let our experts handle the rest.
        </p>
      </div>

      {errors.submit && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
          {errors.submit}
        </div>
      )}

      {/* Selected Package Badge */}
      {packageTitle && (
        <div className="bg-brand-tint-light border border-brand-light p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-lightest flex items-center justify-center shrink-0 shadow-sm border border-brand-light">
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-brand-medium text-[10px] font-extrabold uppercase tracking-wider">Requested Package</p>
            <p className="text-brand-darkest font-bold text-lg leading-tight">{packageTitle}</p>
          </div>
        </div>
      )}

      {/* Section 1: Contact Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-brand-medium uppercase tracking-widest border-l-2 border-brand-dark pl-2">
          1. Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="lead-name" className={labelClasses}>
              <User aria-hidden="true" className="w-4 h-4 text-brand-medium" /> Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User aria-hidden="true" className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                id="lead-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={inputClasses}
                placeholder="Enter your full name"
                required
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'lead-name-error' : undefined}
              />
            </div>
            {errors.name && <p id="lead-name-error" className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="lead-email" className={labelClasses}>
              <Mail aria-hidden="true" className="w-4 h-4 text-brand-medium" /> Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail aria-hidden="true" className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                id="lead-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClasses}
                placeholder="name@domain.com"
                required
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'lead-email-error' : undefined}
              />
            </div>
            {errors.email && <p id="lead-email-error" className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="lead-phone" className={labelClasses}>
              <Phone aria-hidden="true" className="w-4 h-4 text-brand-medium" /> Phone Number *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone aria-hidden="true" className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                id="lead-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={inputClasses}
                placeholder="+91 XXXXX XXXXX"
                required
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
              />
            </div>
            {errors.phone && <p id="lead-phone-error" className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Travel Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-brand-medium uppercase tracking-widest border-l-2 border-brand-dark pl-2">
          2. Travel Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lead-start-date" className={labelClasses}>
              <Calendar aria-hidden="true" className="w-4 h-4 text-brand-medium" /> Start Date *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar aria-hidden="true" className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                id="lead-start-date"
                type="date"
                value={formData.travel_start_date}
                onChange={(e) => handleInputChange('travel_start_date', e.target.value)}
                className={inputClasses}
                required
                aria-required="true"
                aria-invalid={errors.travel_start_date ? true : undefined}
                aria-describedby={errors.travel_start_date ? 'lead-start-date-error' : undefined}
              />
            </div>
            {errors.travel_start_date && <p id="lead-start-date-error" className="text-red-500 text-xs mt-1 ml-1">{errors.travel_start_date}</p>}
          </div>

          <div>
            <label htmlFor="lead-end-date" className={labelClasses}>
              <Calendar aria-hidden="true" className="w-4 h-4 text-brand-medium" /> End Date (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar aria-hidden="true" className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                id="lead-end-date"
                type="date"
                value={formData.travel_end_date}
                onChange={(e) => handleInputChange('travel_end_date', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Travel Party Size */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-brand-medium uppercase tracking-widest border-l-2 border-brand-dark pl-2">
          3. Travel Party
        </h3>

        <div className="bg-brand-tint-subtle border border-brand-lightest p-4 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Adults */}
            <div className="flex flex-row sm:flex-col justify-between items-center sm:text-center">
              <div className="text-left sm:text-center sm:mb-2">
                <p className="text-sm font-bold text-brand-darkest">Adults</p>
                <p className="text-[10px] text-brand-medium">12+ years</p>
              </div>
              <div className="flex items-center gap-3" role="group" aria-label="Number of adults">
                <button
                  type="button"
                  aria-label="Decrease number of adults"
                  onClick={() => handleStepper('number_of_adults', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  disabled={formData.number_of_adults <= 1}
                >
                  -
                </button>
                <span aria-live="polite" className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_adults}</span>
                <button
                  type="button"
                  aria-label="Increase number of adults"
                  onClick={() => handleStepper('number_of_adults', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex flex-row sm:flex-col justify-between items-center sm:text-center">
              <div className="text-left sm:text-center sm:mb-2">
                <p className="text-sm font-bold text-brand-darkest">Children</p>
                <p className="text-[10px] text-brand-medium">2-12 years</p>
              </div>
              <div className="flex items-center gap-3" role="group" aria-label="Number of children">
                <button
                  type="button"
                  aria-label="Decrease number of children"
                  onClick={() => handleStepper('number_of_children', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  disabled={formData.number_of_children <= 0}
                >
                  -
                </button>
                <span aria-live="polite" className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_children}</span>
                <button
                  type="button"
                  aria-label="Increase number of children"
                  onClick={() => handleStepper('number_of_children', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex flex-row sm:flex-col justify-between items-center sm:text-center">
              <div className="text-left sm:text-center sm:mb-2">
                <p className="text-sm font-bold text-brand-darkest">Infants</p>
                <p className="text-[10px] text-brand-medium">Under 2 years</p>
              </div>
              <div className="flex items-center gap-3" role="group" aria-label="Number of infants">
                <button
                  type="button"
                  aria-label="Decrease number of infants"
                  onClick={() => handleStepper('number_of_infants', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  disabled={formData.number_of_infants <= 0}
                >
                  -
                </button>
                <span aria-live="polite" className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_infants}</span>
                <button
                  type="button"
                  aria-label="Increase number of infants"
                  onClick={() => handleStepper('number_of_infants', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="lead-message" className={labelClasses}>
          <MessageSquare aria-hidden="true" className="w-4 h-4 text-brand-medium" /> Special Requests (Optional)
        </label>
        <textarea
          id="lead-message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--background)] border border-brand-medium rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-lightest/40 focus:border-brand-dark transition-all duration-300 text-brand-darkest placeholder-brand-medium/50 shadow-sm text-sm resize-none"
          placeholder="Specify room preferences, dietary requirements, or flight timings if any..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createLead.isPending}
        className="w-full rounded-full bg-brand-dark py-3.5 px-6 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:bg-brand-darkest hover:shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex justify-center items-center gap-2 cursor-pointer group"
      >
        {createLead.isPending ? (
          <>
            <svg aria-hidden="true" className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Your Custom Plan...
          </>
        ) : (
          <>
            Send Inquiry <ChevronRight aria-hidden="true" className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}