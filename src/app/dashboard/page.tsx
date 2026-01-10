"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'
import {
  Globe, 
  TrendingUp, 
  Shield, 
  Activity, 
  Plus, 
  Search, 
  Settings, 
  Bell, 
  User, 
  ChevronDown, 
  ChevronUp,
  ExternalLink, 
  Clock, 
  Check,
  X,
  Menu,
  ArrowUpDown,
  LogOut,
  CreditCard,
  Inbox,
  Info,
  Key,
  Mail,
  Users,
  Trash2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Zap,
  ChevronRight,
  BarChart3,
  Cloud,
  Calculator,
  BadgeCheck,
  Receipt,
  Keyboard,
  Lock,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  PlayCircle,
  PieChart,
  HeartPulse,
  CheckSquare,
  Square,
  Server,
  Plug,
  ShoppingBag,
  Code,
  LifeBuoy,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Moon,
  Sun,
  MoreHorizontal,
  ArrowRightLeft,
  Award,
  Wifi,
  PanelLeftClose,
  PanelLeft,
  Filter,
  History,
  RotateCcw,
  Trash,
  MoreVertical,
  Download,
  Power,
  PowerOff,
  FileText,
  BellRing,
  AlertTriangle,
  CheckCheck,
  Circle,
  Copy,
  Save,
  Edit3,
  Link2,
  AtSign,
  Send,
  ShieldAlert,
  KeyRound,
  Webhook,
  FileJson,
  Upload,
  Database,
  Network,
  Smartphone,
  MessageSquare,
  ArrowRight,
  Unlock,
  UserCircle,
  Calendar,
  Sliders,
  SlidersHorizontal
} from "lucide-react"

// ============================================
// DATA & CONSTANTS
// ============================================

const timelineOptions = [
  { label: "7 Days", value: "7d" },
  { label: "14 Days", value: "14d" },
  { label: "30 Days", value: "30d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "5 Years", value: "5y" },
  { label: "10 Years", value: "10y" },
  { label: "All Time", value: "all" },
]

const getStatsForTimeline = (timeline: string) => {
  const variations: Record<string, { value: string; change: string }[]> = {
    "7d": [
      { value: "12", change: "+1 vs last 7 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "24.5K", change: "+12% vs last 7 days" },
      { value: "99.9%", change: "Last 7 days" },
    ],
    "14d": [
      { value: "12", change: "+2 vs last 14 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "48.2K", change: "+15% vs last 14 days" },
      { value: "99.8%", change: "Last 14 days" },
    ],
    "30d": [
      { value: "12", change: "+2 vs last 30 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "98.7K", change: "+18% vs last 30 days" },
      { value: "99.9%", change: "Last 30 days" },
    ],
    "6m": [
      { value: "12", change: "+5 vs last 6 months" },
      { value: "8/10", change: "2 remaining" },
      { value: "542K", change: "+45% vs last 6 months" },
      { value: "99.7%", change: "Last 6 months" },
    ],
    "1y": [
      { value: "12", change: "+8 vs last year" },
      { value: "8/10", change: "2 remaining" },
      { value: "1.2M", change: "+78% vs last year" },
      { value: "99.6%", change: "Last year" },
    ],
    "5y": [
      { value: "12", change: "+10 vs last 5 years" },
      { value: "8/10", change: "2 remaining" },
      { value: "4.8M", change: "+320% vs last 5 years" },
      { value: "99.4%", change: "Last 5 years" },
    ],
    "10y": [
      { value: "12", change: "+12 vs last 10 years" },
      { value: "8/10", change: "2 remaining" },
      { value: "12.5M", change: "+890% vs last 10 years" },
      { value: "99.2%", change: "Last 10 years" },
    ],
    "all": [
      { value: "12", change: "+12 all time" },
      { value: "8/10", change: "2 remaining" },
      { value: "18.2M", change: "+1200% all time" },
      { value: "99.1%", change: "All time average" },
    ],
  }
  
  const baseStats = [
    { label: "Total Domains", icon: Globe, trend: "up" as const },
    { label: "SSL Certificates", icon: Shield, trend: "neutral" as const },
    { label: "Total Visits", icon: TrendingUp, trend: "up" as const },
    { label: "Uptime", icon: Activity, trend: "up" as const },
  ]
  
  return baseStats.map((stat, index) => ({
    ...stat,
    ...variations[timeline][index],
  }))
}

const initialDomains = []
{
