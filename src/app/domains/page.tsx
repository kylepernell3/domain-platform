'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  Settings,
  Shield,
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
  ArrowUpDown,
  Calendar,
  DollarSign,
  Activity,
  Layers,
  CreditCard,
  HelpCircle,
  Mail,
  FileText,
  Code,
  Lock,
  Cookie,
  Map,
  Server,
  Database,
  Cpu,
  HardDrive,
  LayoutGrid,
  List,
  LogOut,
  Bell,
  ChevronUp,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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
  user_id: string;
}

type TabType = 'domains' | 'dns' | 'settings' | 'billing';
type StatusFilter = 'all' | 'active' | 'expiring_soon' | 'expired';
type SortOption = 'name' | 'expiry' | 'price';
type ViewMode = 'grid' | 'list';

interface StatsData {
  totalDomains: number;
  activeDomains: number;
  expiringSoon: number;
  totalSpent: number;
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getExpiryColor = (daysUntil: number): string => {
  if (daysUntil < 0) return 'text-red-500';
  if (daysUntil <= 7) return 'text-red-400';
  if (daysUntil <= 30) return 'text-yellow-400';
  return 'text-green-400';
};

const getStatusBadge = (status: Domain['status'], daysUntil: number) => {
  switch (status) {
    case 'active':
      return {
        icon: CheckCircle,
        text: 'Active',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/20',
      };
    case 'expiring_soon':
      return {
        icon: AlertCircle,
        text: `Expires in ${daysUntil} days`,
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/20',
      };
    case 'expired':
      return {
        icon: XCircle,
        text: 'Expired',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/20',
      };
    default:
      return {
        icon: AlertCircle,
        text: 'Unknown',
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500/20',
      };
  }
};

// ============================================================================
// COMPONENT: Navigation Header
// ============================================================================

const NavigationHeader: React.FC<{
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
}> = ({ mobileMenuOpen, setMobileMenuOpen, userMenuOpen, setUserMenuOpen }) => {
  const navLinks = [
    { label: 'Domain Search', href: '/search' },
    { label: 'Domain Transfer', href: '/transfer' },
    { label: 'Domain Backorder', href: '/backorder' },
    { label: 'Bulk Domain Search', href: '/bulk-search' },
    { label: 'Web Hosting', href: '/hosting/web' },
    { label: 'WordPress Hosting', href: '/hosting/wordpress' },
    { label: 'VPS Hosting', href: '/hosting/vps' },
    { label: 'Dedicated Servers', href: '/hosting/dedicated' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Globe className="w-8 h-8 text-red-500 transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Domain<span className="text-red-500">Pro</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

                  <a href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    Account Settings
                  </a>
                  <a href="/billing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    Billing
                  </a>
                  <a href="/help" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    Help Center
                  </a>
                  <div className="border-t border-white/5 mt-2 pt-2">
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT: Stats Card
// ============================================================================

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
}> = ({ title, value, icon: Icon, iconColor, trend, loading }) => {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{Math.abs(trend.value)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${iconColor.replace('bg-', 'text-').replace('/10', '')}`} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Domain Card (Grid View)
// ============================================================================

const DomainCard: React.FC<{
  domain: Domain;
  onToggleAutoRenew: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}> = ({ domain, onToggleAutoRenew, onDelete, copiedId, onCopy }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const daysUntilExpiry = calculateDaysUntilExpiry(domain.expires_at);
  const statusBadge = getStatusBadge(domain.status, daysUntilExpiry);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-red-500/20 transition-all group relative">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor} border ${statusBadge.borderColor} mb-4`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {statusBadge.text}
      </div>

      {/* Domain Name */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-white truncate flex-1">{domain.domain_name}</h3>
        <button
          onClick={() => onCopy(domain.id, domain.domain_name)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
          title="Copy domain name"
        >
          {copiedId === domain.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Expiry Info */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Calendar className="w-4 h-4" />
        <span>Expires: {formatDate(domain.expires_at)}</span>
      </div>
      <div className={`flex items-center gap-2 text-sm mb-4 ${getExpiryColor(daysUntilExpiry)}`}>
        <Clock className="w-4 h-4" />
        <span>
          {daysUntilExpiry < 0
            ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
            : daysUntilExpiry === 0
            ? 'Expires today!'
            : `${daysUntilExpiry} days remaining`}
        </span>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3 mb-4 pt-4 border-t border-white/5">
        {/* Auto Renew Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Auto-Renew</span>
          </div>
          <button
            onClick={() => onToggleAutoRenew(domain.id, !domain.auto_renew)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              domain.auto_renew ? 'bg-red-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                domain.auto_renew ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Privacy Protection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {domain.privacy_enabled ? (
              <ShieldCheck className="w-4 h-4 text-green-400" />
            ) : (
              <ShieldOff className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm text-gray-400">Privacy Protection</span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            domain.privacy_enabled
              ? 'bg-green-500/10 text-green-400'
              : 'bg-gray-500/10 text-gray-500'
          }`}>
            {domain.privacy_enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
        <a
          href={`/domains/${domain.id}/dns`}
          className="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-xs font-medium text-center text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
        >
          Manage DNS
        </a>
        <a
          href={`/domains/${domain.id}/settings`}
          className="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-xs font-medium text-center text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
        >
          Configure
        </a>
        <a
          href={`/domains/${domain.id}/renew`}
          className="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-xs font-medium text-center text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
        >
          Renew
        </a>
        <div className="flex-1 min-w-[calc(50%-4px)] relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full px-3 py-2 text-xs font-medium text-center text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          >
            <MoreHorizontal className="w-4 h-4 mx-auto" />
          </button>
          {menuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <a
                href={`/domains/${domain.id}/transfer`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Transfer Out
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(domain.id);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Tag */}
      <div className="absolute top-4 right-4 text-sm font-medium text-gray-500">
        {formatCurrency(domain.purchase_price)}/yr
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Domain Row (List View)
// ============================================================================

const DomainRow: React.FC<{
  domain: Domain;
  onToggleAutoRenew: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}> = ({ domain, onToggleAutoRenew, onDelete, copiedId, onCopy }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const daysUntilExpiry = calculateDaysUntilExpiry(domain.expires_at);
  const statusBadge = getStatusBadge(domain.status, daysUntilExpiry);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-red-500/20 transition-all group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Domain Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-white truncate">{domain.domain_name}</h3>
            <button
              onClick={() => onCopy(domain.id, domain.domain_name)}
              className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
            >
              {copiedId === domain.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor} border ${statusBadge.borderColor}`}>
              <StatusIcon className="w-3 h-3" />
              {domain.status === 'expiring_soon' ? `${daysUntilExpiry}d` : statusBadge.text}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className={getExpiryColor(daysUntilExpiry)}>Expires: {formatDate(domain.expires_at)}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{formatCurrency(domain.purchase_price)}/yr</span>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${domain.auto_renew ? 'text-green-400' : 'text-gray-600'}`} />
            <button
              onClick={() => onToggleAutoRenew(domain.id, !domain.auto_renew)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                domain.auto_renew ? 'bg-red-500' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  domain.auto_renew ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className={`p-1.5 rounded-lg ${domain.privacy_enabled ? 'bg-green-500/10' : 'bg-white/5'}`}>
            {domain.privacy_enabled ? (
              <ShieldCheck className="w-4 h-4 text-green-400" />
            ) : (
              <ShieldOff className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`/domains/${domain.id}/dns`}
            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all hidden md:block"
          >
            DNS
          </a>
          <a
            href={`/domains/${domain.id}/settings`}
            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all hidden md:block"
          >
            Configure
          </a>
          <a
            href={`/domains/${domain.id}/renew`}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
          >
            Renew
          </a>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                <a
                  href={`/domains/${domain.id}/dns`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors md:hidden"
                >
                  <Database className="w-4 h-4" />
                  Manage DNS
                </a>
                <a
                  href={`/domains/${domain.id}/settings`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors md:hidden"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </a>
                <a
                  href={`/domains/${domain.id}/transfer`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Transfer Out
                </a>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(domain.id);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
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
  badge?: number;
}> = ({ icon: Icon, label, active, onClick, badge }) => {
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
      <span className="font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// COMPONENT: Footer
// ============================================================================

const Footer: React.FC = () => {
  const footerLinks = {
    domains: [
      { label: 'Domain Search', href: '/search' },
      { label: 'Domain Transfer', href: '/transfer' },
      { label: 'Domain Backorder', href: '/backorder' },
      { label: 'Bulk Domain Search', href: '/bulk-search' },
    ],
    hosting: [
      { label: 'Web Hosting', href: '/hosting/web' },
      { label: 'WordPress Hosting', href: '/hosting/wordpress' },
      { label: 'VPS Hosting', href: '/hosting/vps' },
      { label: 'Dedicated Servers', href: '/hosting/dedicated' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'System Status', href: '/status' },
      { label: 'API Docs', href: '/docs/api' },
    ],
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Globe className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold text-white tracking-tight">
                Domain<span className="text-red-500">Pro</span>
              </span>
            </a>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your trusted partner for domain registration, web hosting, and online presence management.
            </p>
          </div>

          {/* Domains */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Domains</h4>
            <ul className="space-y-3">
              {footerLinks.domains.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hosting</h4>
            <ul className="space-y-3">
              {footerLinks.hosting.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-red-400 transition-colors">Privacy</a>
              <span className="hidden sm:inline">•</span>
              <a href="/terms" className="hover:text-red-400 transition-colors">Terms</a>
              <span className="hidden sm:inline">•</span>
              <a href="/cookies" className="hover:text-red-400 transition-colors">Cookies</a>
              <span className="hidden sm:inline">•</span>
              <a href="/sitemap" className="hover:text-red-400 transition-colors">Sitemap</a>
            </div>
            <p className="text-sm text-gray-600">
              © 2026 DomainPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// COMPONENT: Empty State
// ============================================================================

const EmptyState: React.FC<{ filter: StatusFilter }> = ({ filter }) => {
  const messages: Record<StatusFilter, { title: string; description: string }> = {
    all: { title: 'No domains found', description: 'You haven\'t added any domains yet. Start by searching for your perfect domain.' },
    active: { title: 'No active domains', description: 'You don\'t have any active domains. Your domains may be expiring or expired.' },
    expiring_soon: { title: 'No domains expiring soon', description: 'Great news! None of your domains are expiring in the next 30 days.' },
    expired: { title: 'No expired domains', description: 'You don\'t have any expired domains. Keep it up!' },
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <Globe className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{messages[filter].title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{messages[filter].description}</p>
      {filter === 'all' && (
        <a
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
        >
          <Search className="w-5 h-5" />
          Search Domains
        </a>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT: Loading Skeleton
// ============================================================================

const LoadingSkeleton: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 animate-pulse">
            <div className="h-6 w-24 bg-white/5 rounded-full mb-4" />
            <div className="h-6 w-3/4 bg-white/5 rounded mb-4" />
            <div className="h-4 w-1/2 bg-white/5 rounded mb-2" />
            <div className="h-4 w-2/3 bg-white/5 rounded mb-4" />
            <div className="pt-4 border-t border-white/5">
              <div className="h-4 w-full bg-white/5 rounded mb-3" />
              <div className="h-4 w-full bg-white/5 rounded" />
            </div>
            <div className="flex gap-2 pt-4 border-t border-white/5 mt-4">
              <div className="h-9 flex-1 bg-white/5 rounded-lg" />
              <div className="h-9 flex-1 bg-white/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-5 w-48 bg-white/5 rounded mb-2" />
              <div className="h-4 w-32 bg-white/5 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-white/5 rounded-lg" />
              <div className="h-8 w-16 bg-white/5 rounded-lg" />
              <div className="h-8 w-16 bg-white/5 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// COMPONENT: Error State
// ============================================================================

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="bg-[#111] border border-red-500/20 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
};

// ============================================================================
// COMPONENT: Delete Confirmation Modal
// ============================================================================

const DeleteModal: React.FC<{
  domain: Domain | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ domain, onConfirm, onCancel, isDeleting }) => {
  if (!domain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white text-center mb-2">Delete Domain</h3>
        <p className="text-gray-400 text-center mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-white font-semibold text-center mb-4">{domain.domain_name}?</p>
        <p className="text-sm text-gray-500 text-center mb-6">
          This action cannot be undone. The domain will be removed from your account immediately.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-500 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: Domains Dashboard Page
// ============================================================================

export default function DomainsPage() {
  // State Management
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('domains');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [deleteModalDomain, setDeleteModalDomain] = useState<Domain | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

    // Authentication Protection
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
            // Get user data
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Domains from Supabase
  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Update status based on expiry date
      const updatedDomains = (data || []).map((domain: Domain) => {
        const daysUntilExpiry = calculateDaysUntilExpiry(domain.expires_at);
        let status: Domain['status'] = domain.status;

        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 30) {
          status = 'expiring_soon';
        } else {
          status = 'active';
        }

        return { ...domain, status };
      });

      setDomains(updatedDomains);
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError('Failed to load domains. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setFilterDropdownOpen(false);
        setSortDropdownOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle Auto-Renew
  const handleToggleAutoRenew = async (id: string, value: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('domains')
        .update({ auto_renew: value })
        .eq('id', id);

      if (updateError) throw updateError;

      setDomains((prev) =>
        prev.map((d) => (d.id === id ? { ...d, auto_renew: value } : d))
      );
    } catch (err) {
      console.error('Error updating auto-renew:', err);
    }
  };

  // Delete Domain
  const handleDeleteDomain = async () => {
    if (!deleteModalDomain) return;

    try {
      setIsDeleting(true);

      const { error: deleteError } = await supabase
        .from('domains')
        .delete()
        .eq('id', deleteModalDomain.id);

      if (deleteError) throw deleteError;

      setDomains((prev) => prev.filter((d) => d.id !== deleteModalDomain.id));
      setDeleteModalDomain(null);
    } catch (err) {
      console.error('Error deleting domain:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

    const handleBulkDelete = async () => {
    if (selectedDomainIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedDomainIds.length} domains?`)) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('domains')
        .delete()
        .in('id', selectedDomainIds);

      if (error) throw error;
      setDomains(prev => prev.filter(d => !selectedDomainIds.includes(d.id)));
      setSelectedDomainIds([]);
    } catch (err: any) {
      console.error('Error deleting domains:', err);
      alert('Failed to delete domains: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAutoRenew = async (value: boolean) => {
    if (selectedDomainIds.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('domains')
        .update({ auto_renew: value })
        .in('id', selectedDomainIds);

      if (error) throw error;
      setDomains(prev => prev.map(d => 
        selectedDomainIds.includes(d.id) ? { ...d, auto_renew: value } : d
      ));
      setSelectedDomainIds([]);
    } catch (err: any) {
      console.error('Error updating domains:', err);
      alert('Failed to update domains: ' + err.message);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Status', 'Expires', 'Auto Renew'];
    const data = domains.map(d => [d.domain_name, d.status, d.expires_at, d.auto_renew]);
    const csvContent = [headers, ...data].map(e => e.join(',')).join('\
');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'domains_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Calculate Stats
  const stats: StatsData = useMemo(() => {
    return {
      totalDomains: domains.length,
      activeDomains: domains.filter((d) => d.status === 'active').length,
      expiringSoon: domains.filter((d) => d.status === 'expiring_soon').length,
      totalSpent: domains.reduce((sum, d) => sum + d.purchase_price, 0),
    };
  }, [domains]);

  // Filter and Sort Domains
  const filteredAndSortedDomains = useMemo(() => {
    let result = [...domains];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((d) => d.domain_name.toLowerCase().includes(query));
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.domain_name.localeCompare(b.domain_name);
        case 'expiry':
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        case 'price':
          return b.purchase_price - a.purchase_price;
        default:
          return 0;
      }
    });

    return result;
  }, [domains, searchQuery, statusFilter, sortOption]);

  // Status Filter Options
  const statusFilterOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All Domains', count: domains.length },
    { value: 'active', label: 'Active', count: stats.activeDomains },
    { value: 'expiring_soon', label: 'Expiring Soon', count: stats.expiringSoon },
    { value: 'expired', label: 'Expired', count: domains.filter((d) => d.status === 'expired').length },
  ];

  // Sort Options
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'expiry', label: 'Expiry Date' },
    { value: 'price', label: 'Price (High to Low)' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Navigation Header */}
      <NavigationHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
      />

        {/* User Account Dropdown */}
        {userMenuOpen && (
          <div className="absolute top-16 right-4 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50">
            <div className="p-4 border-b border-white/10">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-white font-medium truncate">{user?.email || 'Loading...'}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Main Dashboard
              </button>
              <button
                onClick={() => router.push('/domains')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Domain Management
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Domain Dashboard</h1>
            <p className="text-gray-500">Manage your domains, DNS settings, and renewals all in one place.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Domains"
              value={stats.totalDomains}
              icon={Globe}
              iconColor="bg-red-500/10"
              loading={loading}
            />
            <StatsCard
              title="Active Domains"
              value={stats.activeDomains}
              icon={CheckCircle}
              iconColor="bg-green-500/10"
              loading={loading}
            />
            <StatsCard
              title="Expiring Soon"
              value={stats.expiringSoon}
              icon={AlertCircle}
              iconColor="bg-yellow-500/10"
              loading={loading}
            />
            <StatsCard
              title="Total Spent"
              value={formatCurrency(stats.totalSpent)}
              icon={DollarSign}
              iconColor="bg-blue-500/10"
              loading={loading}
            />
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4 lg:sticky lg:top-24">
                <nav className="space-y-2">
                  <SidebarTab
                    icon={Layers}
                    label="All Domains"
                    active={activeTab === 'domains'}
                    onClick={() => setActiveTab('domains')}
                    badge={stats.totalDomains}
                  />
                  <SidebarTab
                    icon={Database}
                    label="DNS Management"
                    active={activeTab === 'dns'}
                    onClick={() => setActiveTab('dns')}
                  />
                  <SidebarTab
                    icon={Settings}
                    label="Domain Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                  />
                  <SidebarTab
                    icon={CreditCard}
                    label="Billing & Renewals"
                    active={activeTab === 'billing'}
                    onClick={() => setActiveTab('billing')}
                    badge={stats.expiringSoon > 0 ? stats.expiringSoon : undefined}
                  />
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <a
                      href="/search"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all"
                    >
                      <Search className="w-4 h-4" />
                      Search Domains
                    </a>
                    <a
                      href="/transfer"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Transfer Domain
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === 'domains' && (
                <>
                  {/* Filters and Search Bar */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search Input */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search domains..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                        />
                      </div>

                      {/* Filter Dropdown */}
                      <div className="relative" data-dropdown>
                        <button
                          onClick={() => {
                            setFilterDropdownOpen(!filterDropdownOpen);
                            setSortDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all min-w-[160px]"
                        >
                          <Filter className="w-4 h-4" />
                          <span className="flex-1 text-left">
                            {statusFilterOptions.find((o) => o.value === statusFilter)?.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {filterDropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            {statusFilterOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setStatusFilter(option.value);
                                  setFilterDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                                  statusFilter === option.value
                                    ? 'text-red-400 bg-red-500/5'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {option.label}
                                <span className="text-xs text-gray-600">{option.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sort Dropdown */}
                      <div className="relative" data-dropdown>
                        <button
                          onClick={() => {
                            setSortDropdownOpen(!sortDropdownOpen);
                            setFilterDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all min-w-[160px]"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                          <span className="flex-1 text-left">
                            {sortOptions.find((o) => o.value === sortOption)?.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sortDropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortOption(option.value);
                                  setSortDropdownOpen(false);
                                }}
                                className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                                  sortOption === option.value
                                    ? 'text-red-400 bg-red-500/5'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* View Mode Toggle */}
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'grid'
                              ? 'bg-red-600 text-white'
                              : 'text-gray-500 hover:text-white'
                          }`}
                          title="Grid view"
                        >
                          <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'list'
                              ? 'bg-red-600 text-white'
                              : 'text-gray-500 hover:text-white'
                          }`}
                          title="List view"
                        >
                          <List className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Domain List/Grid */}
                  {loading ? (
                    <LoadingSkeleton viewMode={viewMode} />
                  ) : error ? (
                    <ErrorState message={error} onRetry={fetchDomains} />
                  ) : filteredAndSortedDomains.length === 0 ? (
                    <EmptyState filter={statusFilter} />
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredAndSortedDomains.map((domain) => (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          onToggleAutoRenew={handleToggleAutoRenew}
                          onDelete={(id) => setDeleteModalDomain(domains.find((d) => d.id === id) || null)}
                          copiedId={copiedId}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAndSortedDomains.map((domain) => (
                        <DomainRow
                          key={domain.id}
                          domain={domain}
                          onToggleAutoRenew={handleToggleAutoRenew}
                          onDelete={(id) => setDeleteModalDomain(domains.find((d) => d.id === id) || null)}
                          copiedId={copiedId}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                  )}

                  {/* Results Summary */}
                  {!loading && !error && filteredAndSortedDomains.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Showing {filteredAndSortedDomains.length} of {domains.length} domains
                    </div>
                  )}
                </>
              )}

              {/* DNS Management Tab */}
              {activeTab === 'dns' && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">DNS Management</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Select a domain from the list to manage its DNS records, nameservers, and zone files.
                  </p>
                  <button
                    onClick={() => setActiveTab('domains')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                    View Domains
                  </button>
                </div>
              )}

              {/* Domain Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Domain Settings</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Configure domain-specific settings including WHOIS privacy, domain locking, and transfer authorization.
                  </p>
                  <button
                    onClick={() => setActiveTab('domains')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                    View Domains
                  </button>
                </div>
              )}

              {/* Billing & Renewals Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* Billing Summary Card */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Renewal Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Due This Month</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(
                            domains
                              .filter((d) => {
                                const days = calculateDaysUntilExpiry(d.expires_at);
                                return days >= 0 && days <= 30;
                              })
                              .reduce((sum, d) => sum + d.purchase_price, 0)
                          )}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Auto-Renew Enabled</p>
                        <p className="text-2xl font-bold text-white">
                          {domains.filter((d) => d.auto_renew).length} domains
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Manual Renewal Needed</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {domains.filter((d) => !d.auto_renew && d.status === 'expiring_soon').length} domains
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expiring Soon List */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Domains Expiring Soon
                    </h3>
                    {domains.filter((d) => d.status === 'expiring_soon').length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-400">No domains expiring in the next 30 days</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {domains
                          .filter((d) => d.status === 'expiring_soon')
                          .sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime())
                          .map((domain) => {
                            const daysUntil = calculateDaysUntilExpiry(domain.expires_at);
                            return (
                              <div
                                key={domain.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl gap-4"
                              >
                                <div>
                                  <p className="font-medium text-white">{domain.domain_name}</p>
                                  <p className="text-sm text-yellow-400">
                                    Expires in {daysUntil} days ({formatDate(domain.expires_at)})
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400">
                                    {formatCurrency(domain.purchase_price)}/yr
                                  </span>
                                  <a
                                    href={`/domains/${domain.id}/renew`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
                                  >
                                    Renew Now
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                      <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                        + Add New
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2027</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        domain={deleteModalDomain}
        onConfirm={handleDeleteDomain}
        onCancel={() => setDeleteModalDomain(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
