'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, Search, Bell, Sun, Moon, ChevronDown, Plus, Trash2, Edit, CheckCircle, AlertCircle, XCircle, Globe, Clock, RefreshCw, Shield } from 'lucide-react';

// Types
interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  propagated: boolean;
  propagationProgress: number;
  dnssecStatus?: 'active' | 'inactive' | 'error';
  lastModified: Date;
  isValid: boolean;
  validationMessage?: string;
}

interface Domain {
  id: string;
  name: string;
  nameservers: string[];
  dnssecEnabled: boolean;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Mock data
const mockDNSRecords: DNSRecord[] = [
  { id: '1', type: 'A', name: 'www', value: '192.0.2.1', ttl: 3600, propagated: true, propagationProgress: 100, dnssecStatus: 'active', lastModified: new Date(), isValid: true },
  { id: '2', type: 'CNAME', name: 'blog', value: 'www.example.com', ttl: 3600, propagated: false, propagationProgress: 45, dnssecStatus: 'active', lastModified: new Date(), isValid: true },
];

// Utilities
const validateRecord = (record: Partial<DNSRecord>): ValidationResult => {
  if (!record.name || !record.value) return { isValid: false, message: 'Name and value are required' };
  if (record.type === 'A' && !/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(record.value)) {
    return { isValid: false, message: 'Invalid IPv4 address format' };
  }
  return { isValid: true, message: 'Valid record' };
};

const formatTTL = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
};

const getRecordTypeColor = (type: string): string => {
  const colors = { A: 'bg-blue-100 text-blue-800', AAAA: 'bg-indigo-100 text-indigo-800', CNAME: 'bg-purple-100 text-purple-800', MX: 'bg-green-100 text-green-800', TXT: 'bg-yellow-100 text-yellow-800', NS: 'bg-red-100 text-red-800', SRV: 'bg-pink-100 text-pink-800' };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getPropagationColor = (progress: number): string => {
  if (progress === 100) return 'text-green-600';
  if (progress > 50) return 'text-yellow-600';
  return 'text-red-600';
};

export default function DNSPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>(mockDNSRecords);
  const [selectedDomain, setSelectedDomain] = useState<Domain>({
    id: '1',
    name: 'example.com',
    nameservers: ['ns1.domainpro.com', 'ns2.domainpro.com'],
    dnssecEnabled: true
  });
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = dnsRecords.filter(record =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkDelete = () => {
    setDnsRecords(prev => prev.filter(r => !selectedRecords.includes(r.id)));
    setSelectedRecords([]);
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">DNS Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Domain Selector & Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">{selectedDomain.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> DNSSEC: {selectedDomain.dnssecEnabled ? 'Enabled' : 'Disabled'}</span>
                  <span>Nameservers: {selectedDomain.nameservers.join(', ')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedRecords.length > 0 && (
                  <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Selected ({selectedRecords.length})
                  </button>
                )}
                <button onClick={() => setShowAddRecord(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search DNS records..." className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          {/* DNS Records Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left"><input type="checkbox" onChange={(e) => setSelectedRecords(e.target.checked ? dnsRecords.map(r => r.id) : [])} /></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">TTL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Propagation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4"><input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => setSelectedRecords(prev => prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id])} /></td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded ${getRecordTypeColor(record.type)}`}>{record.type}</span></td>
                    <td className="px-6 py-4 text-sm">{record.name}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100">{record.value}</td>
                    <td className="px-6 py-4 text-sm">{formatTTL(record.ttl)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className={`h-2 rounded-full ${record.propagated ? 'bg-green-600' : 'bg-yellow-600'}`} style={{ width: `${record.propagationProgress}%` }} />
                        </div>
                        <span className={`text-sm ${getPropagationColor(record.propagationProgress)}`}>{record.propagationProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"><Edit className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
