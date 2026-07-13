'use client';

import { useState } from 'react';
import { useCreateLead } from '@/lib/hooks/useLeads';
import { leadSchema } from '@/lib/validations/lead.schema';
import { z } from 'zod';
import { User, Mail, Phone, Calendar, Users, MessageSquare, ChevronRight } from 'lucide-react';

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
  
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
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

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
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
  };

  const inputClasses = "w-full pl-11 pr-4 py-3 bg-[var(--background)] border border-brand-medium rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-lightest/40 focus:border-brand-dark transition-all duration-300 text-brand-darkest placeholder-brand-medium/50 shadow-sm text-sm";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-brand-darkest mb-1.5 ml-1";

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-brand-lightest rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <svg className="w-10 h-10 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-brand-darkest mb-2 tracking-tight">Inquiry Received!</h3>
        <p className="text-brand-medium text-base max-w-sm">
          Your travel request is locked in. Our travel specialists will customize your experience and reach out in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-lightest pb-4">
        <h2 className="text-brand-darkest text-3xl font-extrabold tracking-tight mb-1">
          Craft Your Journey
        </h2>
        <p className="text-brand-medium text-sm">Fill in your preferences, and let our experts handle the rest.</p>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
          {errors.submit}
        </div>
      )}

      {/* Selected Package Badge */}
      {packageTitle && (
        <div className="bg-brand-tint-light border border-brand-light p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-lightest flex items-center justify-center shrink-0 shadow-sm border border-brand-light">
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <label className={labelClasses}>
              <User className="w-4 h-4 text-brand-medium" /> Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
                placeholder="Enter your full name"
                required
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Mail className="w-4 h-4 text-brand-medium" /> Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                placeholder="name@domain.com"
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Phone className="w-4 h-4 text-brand-medium" /> Phone Number *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
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
            <label className={labelClasses}>
              <Calendar className="w-4 h-4 text-brand-medium" /> Start Date *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                type="date"
                value={formData.travel_start_date}
                onChange={(e) => setFormData({ ...formData, travel_start_date: e.target.value })}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              <Calendar className="w-4 h-4 text-brand-medium" /> End Date (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-4 h-4 text-brand-medium/60" />
              </span>
              <input
                type="date"
                value={formData.travel_end_date}
                onChange={(e) => setFormData({ ...formData, travel_end_date: e.target.value })}
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_adults', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40"
                  disabled={formData.number_of_adults <= 1}
                >
                  -
                </button>
                <span className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_adults}</span>
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_adults', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70"
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_children', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40"
                  disabled={formData.number_of_children <= 0}
                >
                  -
                </button>
                <span className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_children}</span>
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_children', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70"
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_infants', -1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70 disabled:opacity-40"
                  disabled={formData.number_of_infants <= 0}
                >
                  -
                </button>
                <span className="text-base font-bold text-brand-darkest w-4 text-center">{formData.number_of_infants}</span>
                <button
                  type="button"
                  onClick={() => handleStepper('number_of_infants', 1)}
                  className="w-8 h-8 rounded-full border border-brand-medium text-brand-darkest hover:bg-brand-lightest/40 flex items-center justify-center font-bold text-lg select-none transition-colors active:bg-brand-lightest/70"
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
        <label className={labelClasses}>
          <MessageSquare className="w-4 h-4 text-brand-medium" /> Special Requests (Optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--background)] border border-brand-medium rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-lightest/40 focus:border-brand-dark transition-all duration-300 text-brand-darkest placeholder-brand-medium/50 shadow-sm text-sm resize-none"
          placeholder="Specify room preferences, dietary requirements, or flight timings if any..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.travel_start_date.trim() || createLead.isPending}
        className="w-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex justify-center items-center gap-2 cursor-pointer shadow-lg"
      >
        {createLead.isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Your Custom Plan...
          </>
        ) : (
          <>
            Send Inquiry <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-[10px] text-brand-medium text-center flex items-center justify-center gap-1.5 opacity-80">
        <svg className="w-4 h-4 text-brand-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure & Confidentially Handled in Accordance with Privacy Rules
      </p>
    </form>
  );
}