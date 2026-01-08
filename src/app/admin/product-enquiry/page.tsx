'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/lib/supabase';
import { toast } from 'react-toastify';

export default function ProductEnquiryPage() {
  const [enquiries, setEnquiries] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('enquiry_type', 'product')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Contact['status']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated successfully!');
      await fetchEnquiries();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      toast.success('Enquiry deleted successfully!');
      await fetchEnquiries();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      toast.error('Error deleting enquiry');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-pink-500/20 text-pink-400';
      case 'read':
        return 'bg-amber-500/20 text-amber-400';
      case 'responded':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredEnquiries = filter === 'all' 
    ? enquiries 
    : enquiries.filter(e => e.status === filter);

  const statusCounts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    read: enquiries.filter(e => e.status === 'read').length,
    responded: enquiries.filter(e => e.status === 'responded').length,
    closed: enquiries.filter(e => e.status === 'closed').length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Product Enquiries</h1>
        <p className="text-gray-400">Manage product-related enquiries from customers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'new', 'read', 'responded', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-black/20 text-xs">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-1 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Enquiries</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No enquiries found
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.id}
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      if (enquiry.status === 'new') {
                        updateStatus(enquiry.id, 'read');
                      }
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-800/50 transition-colors ${
                      selectedEnquiry?.id === enquiry.id ? 'bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-white font-medium truncate">{enquiry.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-pink-400 text-sm truncate mb-1">{enquiry.product_name}</p>
                    <p className="text-gray-500 text-xs">{formatDate(enquiry.created_at)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enquiry Details */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          {selectedEnquiry ? (
            <>
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">{selectedEnquiry.name}</h2>
                    <p className="text-pink-400">{selectedEnquiry.product_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value as Contact['status'])}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(selectedEnquiry.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-white hover:text-pink-400 transition-colors">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Mobile</p>
                    <a href={`tel:${selectedEnquiry.mobile}`} className="text-white hover:text-pink-400 transition-colors">
                      {selectedEnquiry.mobile}
                    </a>
                  </div>
                  {selectedEnquiry.company_name && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Company</p>
                      <p className="text-white">{selectedEnquiry.company_name}</p>
                    </div>
                  )}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Date</p>
                    <p className="text-white">{formatDate(selectedEnquiry.created_at)}</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Product</p>
                  <p className="text-white font-medium">{selectedEnquiry.product_name}</p>
                  {selectedEnquiry.product_slug && (
                    <p className="text-gray-500 text-sm mt-1">
                      Slug: <code className="text-pink-400">{selectedEnquiry.product_slug}</code>
                    </p>
                  )}
                </div>

                {/* Message */}
                {selectedEnquiry.message && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Message</p>
                    <p className="text-white whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.product_name} Enquiry`}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reply via Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedEnquiry.mobile.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400">Select an enquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
