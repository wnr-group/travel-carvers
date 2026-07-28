import { getAdminUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Package, Mail, MessageSquare, FolderTree } from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

async function getDashboardStats() {
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

export default async function AdminDashboardPage() {
  const session = await getAdminUser();
  if (!session) redirect('/admin/login');
  
  const stats = await getDashboardStats();
  
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
      
      {/* Analytics dashboard content */}
      <AnalyticsDashboard />
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