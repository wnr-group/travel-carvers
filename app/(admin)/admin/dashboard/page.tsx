'use server';

import { getAdminUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Package, Mail, MessageSquare, FolderTree } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  // Use Promise.all to fetch them in parallel
  const [packages, leads, reviews, categories] = await Promise.all([
    supabaseAdmin.from('packages').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('reviews').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
  ]);

  return {
    packages: packages.count ?? 0,
    leads: leads.count ?? 0,
    reviews: reviews.count ?? 0,
    categories: categories.count ?? 0,
  };
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  created_at: string;
  packages: { title: string } | null;
}

async function getRecentLeads(): Promise<RecentLead[]> {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select(`
      id,
      name,
      email,
      created_at,
      packages ( title )
    `)
    .order('created_at', { ascending: false })
    .limit(5)
    .overrideTypes<RecentLead[], { merge: false }>();

  if (error) {
    return [];
  }

  return data || [];
}

export default async function AdminDashboardPage() {
  const session = await getAdminUser();
  if (!session) redirect('/admin/login');

  const stats = await getDashboardStats();
  const recentLeads = await getRecentLeads();
  
  return (
    <div className="py-4">
      <h1 className="text-3xl font-bold text-brand-darkest mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Packages" value={stats.packages} icon={<Package />} color="bg-brand-darkest" />
        <StatCard title="Total Leads" value={stats.leads} icon={<Mail />} color="bg-brand-dark" />
        <StatCard title="Total Reviews" value={stats.reviews} icon={<MessageSquare />} color="bg-secondary-sage" />
        <StatCard title="Categories" value={stats.categories} icon={<FolderTree />} color="bg-brand-medium" />
      </div>
      
      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-lightest/10">
          <h2 className="text-lg font-bold text-brand-darkest flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-medium" />
            Recent Leads
          </h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-dark hover:text-brand-darkest transition-colors">
            View All
          </Link>
        </div>
        
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="font-semibold">No leads yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[600px] border-collapse text-left text-[14px]">
              <thead className="bg-brand-lightest/30 border-b text-brand-darkest animate-fade-in">
                <tr>
                  <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map((lead) => {
                  const initials = lead.name
                    ? lead.name
                        .trim()
                        .split(/\s+/)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : '?';

                  return (
                    <tr key={lead.id} className="transition-colors hover:bg-brand-lightest/5 duration-150">
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-lightest flex items-center justify-center text-brand-dark text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <span>{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.packages?.title 
                            ? 'bg-brand-lightest text-brand-darkest border border-brand-medium/20' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {lead.packages?.title || 'General Inquiry'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-brand-darkest mt-2">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-lg shadow-md`}>
        {icon}
      </div>
    </div>
  );
}