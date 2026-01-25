'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Search, Globe, ArrowRight, Lock, AlertCircle, Trash2, Edit3 } from 'lucide-react';

interface Domain {
  id: string;
  domain_name: string;
  registrar: string;
  status: 'active' | 'expiring_soon' | 'expired';
  expires_at: string;
  purchase_price: number;
  auto_renew: boolean;
  privacy_enabled: boolean;
  created_at: string;
}

export default function DomainsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserDomains() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login?redirect=/domains');
          return;
        }
        const { data: domainData, error: fetchError } = await supabase
          .from('domains')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching domains:', fetchError);
          setError('Unable to load your domains. Please try again.');
        } else {
          setDomains(domainData || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserDomains();
  }, [supabase, router]);

  const filteredDomains = domains.filter(d =>
    d.domain_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500/10 text-green-500 border border-green-500/30',
      expiring_soon: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
      expired: 'bg-red-500/10 text-red-500 border border-red-500/30'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Globe className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading your domains...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <Globe className="w-10 h-10 text-red-500" /> Your Domains
          </h1>
          <p className="text-gray-400">Manage and monitor all your registered domains</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => router.push('/search')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Register Domain
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {filteredDomains.length === 0 && !error && (
          <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-gray-300">No domains yet</h3>
            <p className="text-gray-500 mb-6">Start by registering your first domain or transferring an existing one</p>
            <button
              onClick={() => router.push('/search')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Register a Domain
            </button>
          </div>
        )}

        {filteredDomains.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map(domain => {
              const daysLeft = getDaysUntilExpiry(domain.expires_at);
              const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
              const isExpired = daysLeft <= 0;
              return (
                <div
                  key={domain.id}
                  className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-red-500/50 transition-all group cursor-pointer"
                  onClick={() => router.push(`/domains/${domain.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors truncate">
                        {domain.domain_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{domain.registrar}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(domain.status)}`}>
                      {domain.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Expires</span>
                      <span className={`text-sm font-semibold ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-500' : 'text-green-500'}`}>
                        {new Date(domain.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                    {daysLeft > 0 && (
                      <p className={`text-xs mt-2 ${isExpiringSoon ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {daysLeft} days remaining
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      {domain.auto_renew ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Auto-renew enabled</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                          <span>Auto-renew disabled</span>
                        </>
                      )}
                    </div>
                    {domain.privacy_enabled && (
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-red-500" />
                        <span>Privacy protected</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/domains/${domain.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Manage
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredDomains.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
            <p>Showing {filteredDomains.length} of {domains.length} domains</p>
          </div>
        )}
      </div>
    </div>
  );
}
