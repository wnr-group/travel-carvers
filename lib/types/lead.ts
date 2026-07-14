export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  package_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_at: string;
  packages?: {
    title: string;
  } | null;
}
