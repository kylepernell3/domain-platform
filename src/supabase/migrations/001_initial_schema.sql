-- ============================================================================
-- Supabase Database Schema for Domain Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: domains
-- Core domain registration and management
-- ============================================================================
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  registrar TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'expiring_soon', 'expired', 'pending', 'transferring')),
  expires_at TIMESTAMPTZ NOT NULL,
  purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  auto_renew BOOLEAN DEFAULT TRUE,
  privacy_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, domain_name)
);

-- Index for faster user domain lookups
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON domains(expires_at);

-- ============================================================================
-- TABLE: domain_settings
-- Domain-specific configuration settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS domain_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  preferred_dns_mode TEXT DEFAULT 'managed' CHECK (preferred_dns_mode IN ('managed', 'external', 'custom')),
  forwarding_target TEXT,
  nameservers TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(domain_id)
);

-- ============================================================================
-- TABLE: domain_dns_records
-- DNS record management
-- ============================================================================
CREATE TABLE IF NOT EXISTS domain_dns_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dns_records_domain_id ON domain_dns_records(domain_id);

-- ============================================================================
-- TABLE: domain_ssl
-- SSL certificate management
-- ============================================================================
CREATE TABLE IF NOT EXISTS domain_ssl (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('requested', 'provisioning', 'active', 'failed', 'expired')),
  provider TEXT DEFAULT 'letsencrypt',
  certificate_data TEXT,
  expires_at TIMESTAMPTZ,
  renew_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(domain_id)
);

-- ============================================================================
-- TABLE: orders
-- Purchase and transaction history
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  domain_name TEXT NOT NULL,
  addons JSONB DEFAULT '{}'::jsonb,
  amount_total INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);

-- ============================================================================
-- TABLE: profiles
-- Extended user profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: domain_analytics (optional for future)
-- Track domain usage and analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS domain_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bandwidth_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(domain_id, date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_domain_id ON domain_analytics(domain_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON domain_analytics(date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_ssl ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for domains table
CREATE POLICY "Users can view their own domains"
  ON domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains"
  ON domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains"
  ON domains FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains"
  ON domains FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for domain_settings
CREATE POLICY "Users can view settings for their domains"
  ON domain_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_settings.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert settings for their domains"
  ON domain_settings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_settings.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can update settings for their domains"
  ON domain_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_settings.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete settings for their domains"
  ON domain_settings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_settings.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Policies for domain_dns_records
CREATE POLICY "Users can view DNS records for their domains"
  ON domain_dns_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert DNS records for their domains"
  ON domain_dns_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can update DNS records for their domains"
  ON domain_dns_records FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete DNS records for their domains"
  ON domain_dns_records FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Policies for domain_ssl
CREATE POLICY "Users can view SSL for their domains"
  ON domain_ssl FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_ssl.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert SSL for their domains"
  ON domain_ssl FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_ssl.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can update SSL for their domains"
  ON domain_ssl FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_ssl.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for domain_analytics
CREATE POLICY "Users can view analytics for their domains"
  ON domain_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_analytics.domain_id
    AND domains.user_id = auth.uid()
  ));

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_settings_updated_at BEFORE UPDATE ON domain_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_dns_records_updated_at BEFORE UPDATE ON domain_dns_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_ssl_updated_at BEFORE UPDATE ON domain_ssl
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for testing - remove in production)
-- ============================================================================

-- Note: Add sample data here if needed for testing
-- Example:
-- INSERT INTO domains (user_id, domain_name, registrar, status, expires_at, purchase_price)
-- VALUES ('USER_UUID_HERE', 'example.com', 'Namecheap', 'active', NOW() + INTERVAL '365 days', 12.99);