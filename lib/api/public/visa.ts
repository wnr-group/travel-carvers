import { supabase } from '@/lib/supabase/client';

export interface VisaCountry {
  id: string;
  country_name: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  updated_at: string | null;
}

export async function getVisaCountries(): Promise<VisaCountry[]> {
  const { data, error } = await supabase
    .from('visa_attachments')
    .select('id, country_name, file_url, file_name, file_type, file_size, updated_at')
    .order('country_name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as VisaCountry[];
}

/** "PDF" / "XLSX" — what the customer is about to download. */
export function visaFileKind(country: VisaCountry): 'PDF' | 'XLSX' | 'FILE' {
  const name = country.file_name.toLowerCase();
  if (country.file_type?.includes('pdf') || name.endsWith('.pdf')) return 'PDF';
  if (country.file_type?.includes('spreadsheet') || name.endsWith('.xlsx')) return 'XLSX';
  return 'FILE';
}

export function visaFileSize(country: VisaCountry): string | null {
  if (!country.file_size) return null;
  const mb = country.file_size / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(country.file_size / 1024))} KB`;
}

export function visaDownloadUrl(country: VisaCountry): string {
  const separator = country.file_url.includes('?') ? '&' : '?';
  return `${country.file_url}${separator}download=${encodeURIComponent(country.file_name)}`;
}
