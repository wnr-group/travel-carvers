'use client';

import { useState } from 'react';
import { useAdminLeads, useUpdateLeadStatus, useDeleteLead } from '@/lib/hooks/useAdminLeads';
import { 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Download, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLeadsPage() {
  const { data: leads = [], isPending, isError, error } = useAdminLeads();
  const updateStatusMutation = useUpdateLeadStatus();
  const deleteMutation = useDeleteLead();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'converted'>('all');

  // Sorting State
  const [sortField, setSortField] = useState<'name' | 'email' | 'phone' | 'created_at' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Handlers
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success('Lead status updated successfully');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update lead status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the lead from ${name}? This cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Lead deleted successfully');
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to delete lead');
      }
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.toLowerCase().includes(searchLower) ||
      (lead.packages?.title || '').toLowerCase().includes(searchLower) ||
      (lead.message || '').toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' ? true : lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting Handler
  const handleSort = (field: 'name' | 'email' | 'phone' | 'created_at' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortField === 'created_at') {
      return sortOrder === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    valA = String(valA).toLowerCase();
    valB = String(valB).toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedLeads = sortedLeads.slice(startIndex, endIndex);

  // CSV Export
  const exportToCSV = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Requested Package', 'Status', 'Message', 'Submitted At'];
      const rows = filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.packages?.title || 'General Inquiry',
        lead.status || 'new',
        lead.message || '',
        new Date(lead.created_at).toLocaleString()
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${(val ? String(val) : '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Leads exported successfully');
    } catch (e) {
      toast.error('Failed to export leads');
    }
  };

  // Status badge styling helper
  const getStatusBadgeClass = (status: string) => {
    const s = status || 'new';
    switch (s) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'qualified':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderSortHeader = (field: 'name' | 'email' | 'phone' | 'created_at' | 'status', label: string) => {
    const isCurrent = sortField === field;
    return (
      <button 
        onClick={() => handleSort(field)}
        className="flex items-center gap-1.5 hover:text-brand-light transition-colors uppercase font-semibold text-xs tracking-wider focus:outline-none"
      >
        {label}
        {isCurrent ? (
          sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        )}
      </button>
    );
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest">Leads Management</h1>
          <p className="text-gray-600 mt-1">Moderate inquiries and track customer lead conversion stages.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredLeads.length === 0}
          className="px-4 py-2 bg-brand-dark text-white rounded-lg flex items-center gap-2 hover:bg-brand-darkest transition-colors w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" /> Export to CSV
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-t-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-base lg:text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium text-gray-900 placeholder-gray-400 bg-gray-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-base lg:text-sm bg-white text-gray-700 focus:ring-1 focus:ring-brand-medium"
            >
              <option value="all">All Stages</option>
              <option value="new">New Inquiries</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-dark mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm font-medium">Loading inquiries...</p>
          </div>
        ) : isError ? (
          <div className="p-16 text-center">
            <p className="font-semibold text-rose-600">Error loading inquiries</p>
            <p className="text-sm text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-base">No leads found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <thead className="bg-brand-darkest text-white">
                <tr>
                  <th className="px-6 py-4 w-[15%]">{renderSortHeader('name', 'Name')}</th>
                  <th className="px-6 py-4 w-[18%]">{renderSortHeader('email', 'Email')}</th>
                  <th className="px-6 py-4 w-[15%]">{renderSortHeader('phone', 'Phone')}</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-[15%]">Requested Package</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-[18%]">Message</th>
                  <th className="px-6 py-4 w-[12%]">{renderSortHeader('created_at', 'Date')}</th>
                  <th className="px-6 py-4 w-[12%]">{renderSortHeader('status', 'Status Stage')}</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-[5%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-brand-lightest/10 duration-200">
                    {/* Name */}
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-medium flex-shrink-0" />
                        <span>{lead.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2 group/copy">
                        <Mail className="w-4 h-4 text-brand-medium flex-shrink-0" />
                        <span>{lead.email}</span>
                        <button 
                          onClick={() => handleCopy(lead.email, 'Email')}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-dark focus:outline-none cursor-pointer"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2 group/copy">
                        <Phone className="w-4 h-4 text-brand-medium flex-shrink-0" />
                        <span>{lead.phone}</span>
                        <button 
                          onClick={() => handleCopy(lead.phone, 'Phone number')}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-dark focus:outline-none cursor-pointer"
                          title="Copy Phone Number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Requested Package */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 line-clamp-2">
                        {lead.packages?.title || 'General Inquiry'}
                      </div>
                    </td>

                    {/* Message */}
                    <td className="px-6 py-4">
                      <div className="text-gray-700 max-w-[220px]">
                        <p className="text-xs leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {lead.message || 'No additional message.'}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Status Stage Selector */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(lead.status)}`}>
                          {(lead.status || 'new').toUpperCase()}
                        </span>
                        <select
                          value={lead.status || 'new'}
                          disabled={updateStatusMutation.isPending}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded text-xs bg-white text-gray-700 focus:outline-none w-fit font-medium cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.id, lead.name)}
                        disabled={deleteMutation.isPending}
                        title="Delete Inquire"
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 disabled:opacity-50 inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {!isPending && !isError && filteredLeads.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500 font-medium">
              Showing <span className="text-gray-800 font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-gray-800 font-semibold">{endIndex}</span> of{' '}
              <span className="text-gray-800 font-semibold">{totalItems}</span> submissions
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPageSafe === 1}
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPageSafe) <= 1)
                .map((p, idx, arr) => {
                  const isCurrent = p === currentPageSafe;
                  return (
                    <div key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-gray-400 px-1 text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPageSafe === totalPages}
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
