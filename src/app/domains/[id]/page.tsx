'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  User,
  Settings,
  ShieldCheck,
  ShieldOff,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Layers,
  CreditCard,
  HelpCircle,
  Database,
  LogOut,
  Bell,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  Unlock,
  Plus,
  Eye,
  EyeOff,
  Server,
  Shield,
  Activity,
  FileText,
  Download,
  Upload,
  Zap,
  Link2,
  Key,
  Mail,
  Info,
  Type,
  MapPin,
  Pencil,
  Hash,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Domain {
  id: string;
  domain_name: string;
  registrar: string;
  status: 'active' | 'pending' | 'expiring_soon' | 'expired';
  expires_at: string;
  purchase_price: number;
  auto_renew: boolean;
  privacy_enabled: boolean;
  created_at: string;
  user_id: string;
  dns_status: DnsStatus;
  ssl_status: SslStatus;
  plan: PlanType;
}

interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  propagation: 'complete' | 'pending' | 'failed';
}

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  ip_address?: string;
}

interface SslCertificate {
  id: string;
  type: 'lets_encrypt' | 'custom' | 'wildcard';
  status: 'active' | 'pending' | 'expired' | 'error';
  issued_at: string;
  expires_at: string;
  auto_renew: boolean;
  domains_covered: string[];
}

interface PageProps {
  params: {
    id: string;
  };
}

type DnsStatus = 'healthy' | 'warning' | 'error' | 'not_configured';
type SslStatus = 'active' | 'pending' | 'none' | 'error';
type PlanType = 'starter' | 'professional' | 'developer' | 'enterprise' | 'white_label';
type TabType = 'overview' | 'dns' | 'ssl' | 'settings' | 'activity';

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient();

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockDnsRecords: DnsRecord[] = [
  { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 3600, propagation: 'complete' },
  { id: '2', type: 'A', name: 'www', value: '192.168.1.1', ttl: 3600, propagation: 'complete' },
  { id: '3', type: 'CNAME', name: 'mail', value: 'mail.example.com', ttl: 3600, propagation: 'pending' },
  { id: '4', type: 'MX', name: '@', value: 'mail.example.com', ttl: 3600, priority: 10, propagation: 'complete' },
  { id: '5', type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600, propagation: 'complete' },
  { id: '6', type: 'NS', name: '@', value: 'ns1.domainpro.com', ttl: 86400, propagation: 'complete' },
];

const mockActivityLog: ActivityLogEntry[] = [
  { id: '1', action: 'dns_record_added', description: 'Added A record for www subdomain', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'john@example.com', ip_address: '192.168.1.100' },
  { id: '2', action: 'ssl_renewed', description: 'SSL certificate automatically renewed', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), user: 'System' },
  { id: '3', action: 'auto_renew_enabled', description: 'Auto-renewal enabled for domain', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: 'john@example.com', ip_address: '192.168.1.100' },
  { id: '4', action: 'privacy_enabled', description: 'WHOIS privacy protection enabled', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user: 'john@example.com', ip_address: '192.168.1.105' },
  { id: '5', action: 'domain_registered', description: 'Domain successfully registered', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), user: 'john@example.com', ip_address: '192.168.1.100' },
];

const mockSslCertificate: SslCertificate = {
  id: '1',
  type: 'lets_encrypt',
  status: 'active',
  issued_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  auto_renew: true,
  domains_covered: ['example.com', 'www.example.com'],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateDaysUntilExpiry = (expiresAt: string): number => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return formatDate(dateString);
};

const getStatusConfig = (status: Domain['status']) => {
  switch (status) {
    case 'active':
      return { icon: CheckCircle, text: 'Active', bgColor: 'bg-green-500/10', textColor: 'text-green-400', borderColor: 'border-green-500/20' };
    case 'pending':
      return { icon: Clock, text: 'Pending', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20' };
    case 'expiring_soon':
      return { icon: AlertCircle, text: 'Expiring Soon', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20' };
    case 'expired':
      return { icon: XCircle, text: 'Expired', bgColor: 'bg-red-500/10', textColor: 'text-red-400', borderColor: 'border-red-500/20' };
    default:
      return { icon: AlertCircle, text: 'Unknown', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400', borderColor: 'border-gray-500/20' };
  }
};

const getDnsStatusConfig = (status: DnsStatus) => {
  switch (status) {
    case 'healthy':
      return { icon: CheckCircle, label: 'Healthy', description: 'All DNS records propagated', dotColor: 'bg-green-400', textColor: 'text-green-400', bgColor: 'bg-green-500/10' };
    case 'warning':
      return { icon: AlertCircle, label: 'Warning', description: 'Some records pending', dotColor: 'bg-yellow-400', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    case 'error':
      return { icon: XCircle, label: 'Error', description: 'DNS configuration issues', dotColor: 'bg-red-400', textColor: 'text-red-400', bgColor: 'bg-red-500/10' };
    case 'not_configured':
    default:
      return { icon: HelpCircle, label: 'Not Configured', description: 'DNS not set up', dotColor: 'bg-gray-500', textColor: 'text-gray-500', bgColor: 'bg-white/5' };
  }
};

const getSslStatusConfig = (status: SslStatus) => {
  switch (status) {
    case 'active':
      return { icon: Lock, label: 'Active', description: 'SSL certificate valid', textColor: 'text-green-400', bgColor: 'bg-green-500/10' };
    case 'pending':
      return { icon: Clock, label: 'Pending', description: 'Certificate being issued', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    case 'error':
      return { icon: AlertTriangle, label: 'Error', description: 'Certificate issue failed', textColor: 'text-red-400', bgColor: 'bg-red-500/10' };
    case 'none':
    default:
      return { icon: Unlock, label: 'No SSL', description: 'No certificate installed', textColor: 'text-gray-500', bgColor: 'bg-white/5' };
  }
};

const getPlanConfig = (plan: PlanType) => {
  switch (plan) {
    case 'starter':
      return { label: 'Starter', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400', borderColor: 'border-gray-500/20' };
    case 'professional':
      return { label: 'Professional', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20' };
    case 'developer':
      return { label: 'Developer', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/20' };
    case 'enterprise':
      return { label: 'Enterprise', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/20' };
    case 'white_label':
      return { label: 'White Label', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' };
    default:
      return { label: 'Starter', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400', borderColor: 'border-gray-500/20' };
  }
};

const getRecordTypeIcon = (type: DnsRecord['type']) => {
  switch (type) {
    case 'A':
    case 'AAAA':
      return MapPin;
    case 'CNAME':
      return Link2;
    case 'MX':
      return Mail;
    case 'TXT':
      return Type;
    case 'NS':
      return Server;
    case 'SRV':
      return Zap;
    case 'CAA':
      return Shield;
    default:
      return Hash;
  }
};

const getActivityIcon = (action: string) => {
  if (action.includes('dns')) return Database;
  if (action.includes('ssl')) return Lock;
  if (action.includes('renew')) return RefreshCw;
  if (action.includes('privacy')) return Shield;
  if (action.includes('register')) return CheckCircle;
  if (action.includes('transfer')) return ExternalLink;
  if (action.includes('delete')) return Trash2;
  return Activity;
};

// ============================================================================
// COMPONENT: Navigation Header
// ============================================================================

const NavigationHeader: React.FC<{
  user: { email?: string } | null;
  onSignOut: () => void;
  domainName?: string;
}> = ({ user, onSignOut, domainName }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Globe className="w-8 h-8 text-red-500 transition-transform group-hover:rotate-12" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                Domain<span className="text-red-500">Pro</span>
              </span>
            </a>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <a href="/domains" className="text-gray-400 hover:text-white transition-colors">
                Domains
              </a>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white font-medium">{domainName || 'Loading...'}</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/5">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">{user?.email || 'Loading...'}</p>
                  </div>
                  <div className="py-1">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Layers className="w-4 h-4" />
                      Dashboard
                    </a>
                    <a href="/domains" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Globe className="w-4 h-4" />
                      All Domains
                    </a>
                    <a href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" />
                      Account Settings
                    </a>
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Breadcrumb */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <a href="/domains" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Domains
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT: Hero Section
// ============================================================================

const HeroSection: React.FC<{
  domain: Domain;
  onRenew: () => void;
  copiedDomain: boolean;
  onCopyDomain: () => void;
}> = ({ domain, onRenew, copiedDomain, onCopyDomain }) => {
  const statusConfig = getStatusConfig(domain.status);
  const StatusIcon = statusConfig.icon;
  const planConfig = getPlanConfig(domain.plan);
  const daysUntilExpiry = calculateDaysUntilExpiry(domain.expires_at);

  return (
    <div className="relative bg-gradient-to-br from-[#111] via-[#0f0f0f] to-[#0a0a0a] border-b border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link (Mobile) */}
        <a href="/domains" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors md:hidden">
          <ChevronLeft className="w-4 h-4" />
          Back to Domains
        </a>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left: Domain Info */}
          <div className="flex-1">
            {/* Status & Plan Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig.text}
              </div>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${planConfig.bgColor} ${planConfig.textColor} ${planConfig.borderColor}`}>
                {planConfig.label} Plan
              </div>
            </div>

            {/* Domain Name */}
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {domain.domain_name}
              </h1>
              <button
                onClick={onCopyDomain}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                title="Copy domain name"
              >
                {copiedDomain ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
              <a
                href={`https://${domain.domain_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                title="Visit website"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Expires: {formatDate(domain.expires_at)}</span>
                <span className={`ml-1 ${daysUntilExpiry <= 7 ? 'text-red-400' : daysUntilExpiry <= 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                  ({daysUntilExpiry} days)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(domain.purchase_price)}/year</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Registrar: {domain.registrar}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRenew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Domain
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all">
              <ExternalLink className="w-4 h-4" />
              Transfer Out
            </button>
            <button className="inline-flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Sidebar Tab
// ============================================================================

const SidebarTab: React.FC<{
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
}> = ({ icon: Icon, label, active, onClick, badge, badgeColor = 'bg-white/10 text-gray-400' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
        active
          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-red-500 text-white' : badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// COMPONENT: Stats Card
// ============================================================================

const StatsCard: React.FC<{
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  iconColor: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  action?: { label: string; onClick: () => void };
}> = ({ title, value, description, icon: Icon, iconColor, status = 'neutral', action }) => {
  const statusColors = {
    success: 'border-green-500/20',
    warning: 'border-yellow-500/20',
    error: 'border-red-500/20',
    neutral: 'border-white/5',
  };

  return (
    <div className={`bg-[#111] border ${statusColors[status]} rounded-2xl p-5 hover:border-white/10 transition-all group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            {action.label}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

// ============================================================================
// COMPONENT: Overview Tab Content
// ============================================================================

const OverviewTabContent: React.FC<{
  domain: Domain;
  onToggleAutoRenew: () => void;
  onTogglePrivacy: () => void;
  activityLog: ActivityLogEntry[];
}> = ({ domain, onToggleAutoRenew, onTogglePrivacy, activityLog }) => {
  const dnsConfig = getDnsStatusConfig(domain.dns_status);
  const sslConfig = getSslStatusConfig(domain.ssl_status);
  const DnsIcon = dnsConfig.icon;
  const SslIcon = sslConfig.icon;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="DNS Status"
          value={dnsConfig.label}
          description={dnsConfig.description}
          icon={DnsIcon}
          iconColor={`${dnsConfig.bgColor} ${dnsConfig.textColor}`}
          status={domain.dns_status === 'healthy' ? 'success' : domain.dns_status === 'warning' ? 'warning' : domain.dns_status === 'error' ? 'error' : 'neutral'}
        />
        <StatsCard
          title="SSL Status"
          value={sslConfig.label}
          description={sslConfig.description}
          icon={SslIcon}
          iconColor={`${sslConfig.bgColor} ${sslConfig.textColor}`}
          status={domain.ssl_status === 'active' ? 'success' : domain.ssl_status === 'pending' ? 'warning' : domain.ssl_status === 'error' ? 'error' : 'neutral'}
        />
        <StatsCard
          title="Auto-Renew"
          value={domain.auto_renew ? 'Enabled' : 'Disabled'}
          description={domain.auto_renew ? 'Will renew automatically' : 'Manual renewal required'}
          icon={RefreshCw}
          iconColor={domain.auto_renew ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}
          status={domain.auto_renew ? 'success' : 'warning'}
          action={{ label: domain.auto_renew ? 'Disable' : 'Enable', onClick: onToggleAutoRenew }}
        />
        <StatsCard
          title="Privacy Protection"
          value={domain.privacy_enabled ? 'Active' : 'Inactive'}
          description={domain.privacy_enabled ? 'WHOIS info hidden' : 'WHOIS info public'}
          icon={domain.privacy_enabled ? ShieldCheck : ShieldOff}
          iconColor={domain.privacy_enabled ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}
          status={domain.privacy_enabled ? 'success' : 'warning'}
          action={{ label: domain.privacy_enabled ? 'Disable' : 'Enable', onClick: onTogglePrivacy }}
        />
      </div>

      {/* Domain Information */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          Domain Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Domain Name</p>
              <p className="text-white font-medium">{domain.domain_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Registrar</p>
              <p className="text-white font-medium">{domain.registrar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Registration Date</p>
              <p className="text-white font-medium">{formatDate(domain.created_at)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Expiration Date</p>
              <p className="text-white font-medium">{formatDate(domain.expires_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Annual Cost</p>
              <p className="text-white font-medium">{formatCurrency(domain.purchase_price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Plan</p>
              <p className="text-white font-medium">{getPlanConfig(domain.plan).label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            Recent Activity
          </h3>
          <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activityLog.slice(0, 5).map((entry) => {
            const ActivityIcon = getActivityIcon(entry.action);
            return (
              <div key={entry.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-white/5">
                  <ActivityIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{entry.user}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: DNS Management Tab Content
// ============================================================================

const DnsTabContent: React.FC<{
  domain: Domain;
  records: DnsRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: DnsRecord) => void;
  onDeleteRecord: (id: string) => void;
}> = ({ domain, records, onAddRecord, onEditRecord, onDeleteRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dnssecEnabled, setDnssecEnabled] = useState(false);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const recordTypes = ['all', 'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA'];

  return (
    <div className="space-y-6">
      {/* DNS Status Banner */}
      <div
        className={`p-4 rounded-xl border ${
          domain.dns_status === 'healthy'
            ? 'bg-green-500/5 border-green-500/20'
            : domain.dns_status === 'warning'
              ? 'bg-yellow-500/5 border-yellow-500/20'
              : domain.dns_status === 'error'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          {domain.dns_status === 'healthy' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : domain.dns_status === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          ) : domain.dns_status === 'error' ? (
            <XCircle className="w-5 h-5 text-red-400" />
          ) : (
            <HelpCircle className="w-5 h-5 text-gray-400" />
          )}
          <div className="flex-1">
            <p
              className={`font-medium ${
                domain.dns_status === 'healthy'
                  ? 'text-green-400'
                  : domain.dns_status === 'warning'
                    ? 'text-yellow-400'
                    : domain.dns_status === 'error'
                      ? 'text-red-400'
                      : 'text-gray-400'
              }`}
            >
              {getDnsStatusConfig(domain.dns_status).label}
            </p>
            <p className="text-sm text-gray-500">{getDnsStatusConfig(domain.dns_status).description}</p>
          </div>
          <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">
            Run Check
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search DNS records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {recordTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
          <button
            onClick={onAddRecord}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      {/* DNS Records Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">TTL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Propagation</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecords.map((record) => {
                const TypeIcon = getRecordTypeIcon(record.type);
                return (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-white/5">
                          <TypeIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-white">{record.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white font-mono">{record.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 font-mono truncate max-w-xs block">{record.value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{record.ttl}s</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          record.propagation === 'complete'
                            ? 'bg-green-500/10 text-green-400'
                            : record.propagation === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {record.propagation === 'complete' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : record.propagation === 'pending' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {record.propagation === 'complete' ? 'Complete' : record.propagation === 'pending' ? 'Pending' : 'Failed'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditRecord(record)}
                          className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(record.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No DNS records found</p>
            <p className="text-sm text-gray-500">Add your first DNS record to get started</p>
          </div>
        )}
      </div>

      {/* DNSSEC Section */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">DNSSEC</h3>
              <p className="text-sm text-gray-500">DNS Security Extensions for cryptographic authentication</p>
            </div>
          </div>
          <button
            onClick={() => setDnssecEnabled(!dnssecEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors ${dnssecEnabled ? 'bg-red-500' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                dnssecEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Nameservers Section */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Nameservers</h3>
              <p className="text-sm text-gray-500">Current nameserver configuration</p>
            </div>
          </div>
          <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Change Nameservers</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['ns1.domainpro.com', 'ns2.domainpro.com', 'ns3.domainpro.com', 'ns4.domainpro.com'].map((ns, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium text-gray-400">
                {i + 1}
              </div>
              <span className="text-sm text-white font-mono">{ns}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: SSL Tab Content
// ============================================================================

const SslTabContent: React.FC<{
  domain: Domain;
  certificate: SslCertificate | null;
  onRequestCertificate: () => void;
  onRenewCertificate: () => void;
}> = ({ domain, certificate, onRequestCertificate, onRenewCertificate }) => {
  const sslConfig = getSslStatusConfig(domain.ssl_status);
  const SslIcon = sslConfig.icon;

  return (
    <div className="space-y-6">
      {/* SSL Status Card */}
      <div
        className={`p-6 rounded-2xl border ${
          domain.ssl_status === 'active'
            ? 'bg-green-500/5 border-green-500/20'
            : domain.ssl_status === 'pending'
              ? 'bg-yellow-500/5 border-yellow-500/20'
              : domain.ssl_status === 'error'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${sslConfig.bgColor}`}>
            <SslIcon className={`w-6 h-6 ${sslConfig.textColor}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${sslConfig.textColor}`}>{sslConfig.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{sslConfig.description}</p>
            {certificate && (
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                <span>Expires: {formatDate(certificate.expires_at)}</span>
                <span>•</span>
                <span>Type: {certificate.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
              </div>
            )}
          </div>
          {domain.ssl_status === 'none' ? (
            <button
              onClick={onRequestCertificate}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
            >
              Request Certificate
            </button>
          ) : domain.ssl_status === 'active' && certificate && calculateDaysUntilExpiry(certificate.expires_at) <= 30 ? (
            <button
              onClick={onRenewCertificate}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
            >
              Renew Certificate
            </button>
          ) : null}
        </div>
      </div>

      {certificate && (
        <>
          {/* Certificate Details */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Certificate Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Certificate Type</p>
                  <p className="text-white font-medium capitalize">{certificate.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Issued Date</p>
                  <p className="text-white font-medium">{formatDateTime(certificate.issued_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expiration Date</p>
                  <p className="text-white font-medium">{formatDateTime(certificate.expires_at)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Auto-Renewal</p>
                  <p className={`font-medium ${certificate.auto_renew ? 'text-green-400' : 'text-yellow-400'}`}>
                    {certificate.auto_renew ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Domains Covered</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {certificate.domains_covered.map((d, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded-lg font-mono">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Actions */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Certificate Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">Download Certificate</p>
                  <p className="text-xs text-gray-500">PEM format</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                <Upload className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">Upload Custom SSL</p>
                  <p className="text-xs text-gray-500">Use your own certificate</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">Force Renewal</p>
                  <p className="text-xs text-gray-500">Re-issue certificate</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SSL/TLS Settings */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">SSL/TLS Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Force HTTPS</p>
                <p className="text-xs text-gray-500">Redirect all HTTP traffic to HTTPS</p>
              </div>
            </div>
            <button className="relative w-12 h-7 rounded-full bg-red-500 transition-colors">
              <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full translate-x-5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">HSTS</p>
                <p className="text-xs text-gray-500">HTTP Strict Transport Security</p>
              </div>
            </div>
            <button className="relative w-12 h-7 rounded-full bg-white/10 transition-colors">
              <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">TLS 1.3</p>
                <p className="text-xs text-gray-500">Use latest TLS version</p>
              </div>
            </div>
            <button className="relative w-12 h-7 rounded-full bg-red-500 transition-colors">
              <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full translate-x-5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Settings Tab Content
// ============================================================================

const SettingsTabContent: React.FC<{
  domain: Domain;
  onToggleAutoRenew: () => void;
  onTogglePrivacy: () => void;
}> = ({ domain, onToggleAutoRenew, onTogglePrivacy }) => {
  const [domainLockEnabled, setDomainLockEnabled] = useState(true);
  const [showTransferCode, setShowTransferCode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Domain Lock */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Domain Lock</h3>
              <p className="text-sm text-gray-500 mt-1">
                Prevent unauthorized transfers by locking your domain. You must disable this before transferring.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDomainLockEnabled(!domainLockEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors ${domainLockEnabled ? 'bg-red-500' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                domainLockEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Auto-Renew */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${domain.auto_renew ? 'bg-green-500/10' : 'bg-white/5'}`}>
              <RefreshCw className={`w-6 h-6 ${domain.auto_renew ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Auto-Renewal</h3>
              <p className="text-sm text-gray-500 mt-1">
                Automatically renew your domain before it expires. You&apos;ll be charged {formatCurrency(domain.purchase_price)} annually.
              </p>
              {domain.auto_renew && <p className="text-sm text-green-400 mt-2">Next renewal: {formatDate(domain.expires_at)}</p>}
            </div>
          </div>
          <button
            onClick={onToggleAutoRenew}
            className={`relative w-14 h-8 rounded-full transition-colors ${domain.auto_renew ? 'bg-red-500' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                domain.auto_renew ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Privacy Protection */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${domain.privacy_enabled ? 'bg-green-500/10' : 'bg-white/5'}`}>
              {domain.privacy_enabled ? (
                <ShieldCheck className="w-6 h-6 text-green-400" />
              ) : (
                <ShieldOff className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">WHOIS Privacy</h3>
              <p className="text-sm text-gray-500 mt-1">
                Hide your personal information from public WHOIS lookups. Protects against spam and unwanted contact.
              </p>
            </div>
          </div>
          <button
            onClick={onTogglePrivacy}
            className={`relative w-14 h-8 rounded-full transition-colors ${domain.privacy_enabled ? 'bg-red-500' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                domain.privacy_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Transfer Authorization */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Key className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Transfer Authorization Code</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Required to transfer your domain to another registrar. Keep this code private and secure.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 bg-white/5 rounded-xl font-mono text-sm text-white">
                {showTransferCode ? 'EPP-XXXX-XXXX-XXXX' : '••••••••••••••••'}
              </div>
              <button
                onClick={() => setShowTransferCode(!showTransferCode)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                {showTransferCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <p className="text-sm text-gray-500">Registrant, admin, and technical contacts</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            Edit Contacts
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Registrant', 'Admin', 'Technical'].map((type) => (
            <div key={type} className="p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{type}</p>
              <p className="text-sm text-white font-medium">John Doe</p>
              <p className="text-xs text-gray-400 mt-1">john@example.com</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#111] border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">Transfer Domain Out</p>
              <p className="text-xs text-gray-500">Move this domain to another registrar</p>
            </div>
            <button className="px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 rounded-xl transition-all">
              Initiate Transfer
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">Delete Domain</p>
              <p className="text-xs text-gray-500">Permanently remove this domain from your account</p>
            </div>
            <button className="px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 rounded-xl transition-all">
              Delete Domain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Activity Tab Content
// ============================================================================

const ActivityTabContent: React.FC<{
  activityLog: ActivityLogEntry[];
}> = ({ activityLog }) => {
  const [filterAction, setFilterAction] = useState<string>('all');

  const actionTypes = ['all', 'dns', 'ssl', 'renewal', 'settings'];

  const filteredActivity = activityLog.filter((entry) => {
    if (filterAction === 'all') return true;
    return entry.action.includes(filterAction);
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          {actionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterAction(type)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                filterAction === type
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {type === 'all' ? 'All Activity' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="space-y-1">
          {filteredActivity.map((entry, index) => {
            const ActivityIcon = getActivityIcon(entry.action);
            const isLast = index === filteredActivity.length - 1;

            return (
              <div key={entry.id} className="relative">
                {/* Timeline Line */}
                {!isLast && <div className="absolute left-6 top-14 w-0.5 h-full bg-white/5" />}

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="relative z-10 p-3 rounded-xl bg-white/5 border border-white/10">
                    <ActivityIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {entry.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(entry.timestamp)}
                      </span>
                      {entry.ip_address && (
                        <span className="flex items-center gap-1 font-mono text-xs">
                          <Globe className="w-3.5 h-3.5" />
                          {entry.ip_address}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">{formatTimeAgo(entry.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivity.length === 0 && (
          <div className="py-12 text-center">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No activity found</p>
            <p className="text-sm text-gray-500">Activity matching your filter will appear here</p>
          </div>
        )}
      </div>

      {/* Export Activity */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
          <Download className="w-4 h-4" />
          Export Activity Log
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Loading State
// ============================================================================

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading domain...</p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Error State
// ============================================================================

const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          <button
            onClick={() => router.push('/domains')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Domains
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: Single Domain Page
// ============================================================================

export default function SingleDomainPage({ params }: PageProps) {
  const router = useRouter();
  const domainId = params.id;

  // State
  const [domain, setDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Mock data (replace with actual API calls)
  const [dnsRecords] = useState<DnsRecord[]>(mockDnsRecords);
  const [activityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [sslCertificate] = useState<SslCertificate | null>(mockSslCertificate);

  // Auth check and domain fetch
  useEffect(() => {
    const loadDomain = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check auth
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          router.push('/login');
          return;
        }
        setUser({ id: authUser.id, email: authUser.email });

        // Fetch domain
        const { data: domainData, error: fetchError } = await supabase
          .from('domains')
          .select('*')
          .eq('id', domainId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Domain not found');
          } else {
            throw fetchError;
          }
          return;
        }

        // Check ownership
        if (domainData.user_id !== authUser.id) {
          setError('You do not have access to this domain');
          return;
        }

        // Compute display status based on expiry
        const daysUntilExpiry = calculateDaysUntilExpiry(domainData.expires_at);
        let status: Domain['status'] = domainData.status;
        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 30 && status !== 'pending') {
          status = 'expiring_soon';
        } else if (daysUntilExpiry > 30 && status !== 'pending') {
          status = 'active';
        }

        setDomain({ ...domainData, status });
      } catch (err) {
        console.error('Error loading domain:', err);
        setError('Failed to load domain. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (domainId) {
      loadDomain();
    }
  }, [domainId, router]);

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Copy domain name
  const handleCopyDomain = () => {
    if (domain) {
      navigator.clipboard.writeText(domain.domain_name);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  // Toggle auto-renew
  const handleToggleAutoRenew = async () => {
    if (!domain) return;
    try {
      const newValue = !domain.auto_renew;
      const { error: updateError } = await supabase.from('domains').update({ auto_renew: newValue }).eq('id', domain.id);

      if (updateError) throw updateError;
      setDomain({ ...domain, auto_renew: newValue });
    } catch (err) {
      console.error('Error updating auto-renew:', err);
    }
  };

  // Toggle privacy
  const handleTogglePrivacy = async () => {
    if (!domain) return;
    try {
      const newValue = !domain.privacy_enabled;
      const { error: updateError } = await supabase.from('domains').update({ privacy_enabled: newValue }).eq('id', domain.id);

      if (updateError) throw updateError;
      setDomain({ ...domain, privacy_enabled: newValue });
    } catch (err) {
      console.error('Error updating privacy:', err);
    }
  };

  // Placeholder handlers
  const handleRenew = () => {
    router.push(`/domains/${domainId}/renew`);
  };

  const handleAddDnsRecord = () => {
    console.log('Add DNS record');
  };

  const handleEditDnsRecord = (record: DnsRecord) => {
    console.log('Edit DNS record:', record);
  };

  const handleDeleteDnsRecord = (id: string) => {
    console.log('Delete DNS record:', id);
  };

  const handleRequestCertificate = () => {
    console.log('Request certificate');
  };

  const handleRenewCertificate = () => {
    console.log('Renew certificate');
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !domain) {
    return <ErrorState message={error || 'Domain not found'} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation Header */}
      <NavigationHeader user={user} onSignOut={handleSignOut} domainName={domain.domain_name} />

      {/* Hero Section */}
      <HeroSection domain={domain} onRenew={handleRenew} copiedDomain={copiedDomain} onCopyDomain={handleCopyDomain} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-4 lg:sticky lg:top-24">
              <nav className="space-y-2">
                <SidebarTab icon={Layers} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <SidebarTab
                  icon={Database}
                  label="DNS Management"
                  active={activeTab === 'dns'}
                  onClick={() => setActiveTab('dns')}
                  badge={dnsRecords.length.toString()}
                />
                <SidebarTab
                  icon={Lock}
                  label="SSL Certificates"
                  active={activeTab === 'ssl'}
                  onClick={() => setActiveTab('ssl')}
                  badge={domain.ssl_status === 'active' ? '✓' : undefined}
                  badgeColor={domain.ssl_status === 'active' ? 'bg-green-500/10 text-green-400' : undefined}
                />
                <SidebarTab icon={Settings} label="Domain Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                <SidebarTab icon={Activity} label="Activity Log" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
              </nav>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Links</p>
                <div className="space-y-1">
                  <a
                    href={`https://${domain.domain_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                  <a
                    href={`https://who.is/whois/${domain.domain_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Search className="w-4 h-4" />
                    WHOIS Lookup
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <OverviewTabContent
                domain={domain}
                onToggleAutoRenew={handleToggleAutoRenew}
                onTogglePrivacy={handleTogglePrivacy}
                activityLog={activityLog}
              />
            )}

            {activeTab === 'dns' && (
              <DnsTabContent
                domain={domain}
                records={dnsRecords}
                onAddRecord={handleAddDnsRecord}
                onEditRecord={handleEditDnsRecord}
                onDeleteRecord={handleDeleteDnsRecord}
              />
            )}

            {activeTab === 'ssl' && (
              <SslTabContent
                domain={domain}
                certificate={sslCertificate}
                onRequestCertificate={handleRequestCertificate}
                onRenewCertificate={handleRenewCertificate}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTabContent domain={domain} onToggleAutoRenew={handleToggleAutoRenew} onTogglePrivacy={handleTogglePrivacy} />
            )}

            {activeTab === 'activity' && <ActivityTabContent activityLog={activityLog} />}
          </div>
        </div>
      </div>
    </div>
  );
}
