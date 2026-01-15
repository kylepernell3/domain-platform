-- ===========================================
-- Dashboard Dynamic Data Schema
-- Creates all tables needed for the dashboard
-- ===========================================

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  domain_name TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  next_billing DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  domain_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOMAIN ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS domain_analytics (
  id BIGSERIAL PRIMARY KEY,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 0,
  uptime_percentage DECIMAL(5,2) DEFAULT 99.9,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain_id, date)
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('warning', 'info', 'success', 'error')),
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DNS RECORDS TABLE
CREATE TABLE IF NOT EXISTS dns_records (
  id BIGSERIAL PRIMARY KEY,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EMAIL FORWARDING TABLE
CREATE TABLE IF NOT EXISTS email_forwarding (
  id BIGSERIAL PRIMARY KEY,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SSL CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS ssl_certificates (
  id BIGSERIAL PRIMARY KEY,
  domain_id BIGINT REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  issuer TEXT DEFAULT 'Let''s Encrypt',
  expires_at DATE NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS insights (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('action', 'security', 'savings', 'performance')),
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  bg_color TEXT,
  read BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ANALYTICS HISTORY TABLE (for charts)
CREATE TABLE IF NOT EXISTS analytics_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('domain_growth', 'ssl_status', 'traffic', 'uptime')),
  month TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_forwarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssl_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_history ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Domain analytics policies
CREATE POLICY "Users can view analytics for their domains"
  ON domain_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_analytics.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert analytics for their domains"
  ON domain_analytics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = domain_analytics.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- DNS records policies
CREATE POLICY "Users can view DNS records for their domains"
  ON dns_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage DNS records for their domains"
  ON dns_records FOR ALL
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = dns_records.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Email forwarding policies
CREATE POLICY "Users can view email forwarding for their domains"
  ON email_forwarding FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = email_forwarding.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage email forwarding for their domains"
  ON email_forwarding FOR ALL
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = email_forwarding.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Audit log policies
CREATE POLICY "Users can view their own audit log"
  ON audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- SSL certificates policies
CREATE POLICY "Users can view SSL certificates for their domains"
  ON ssl_certificates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = ssl_certificates.domain_id
    AND domains.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage SSL certificates for their domains"
  ON ssl_certificates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = ssl_certificates.domain_id
    AND domains.user_id = auth.uid()
  ));

-- Insights policies
CREATE POLICY "Users can view their own insights"
  ON insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON insights FOR UPDATE
  USING (auth.uid() = user_id);

-- Analytics history policies
CREATE POLICY "Users can view their own analytics history"
  ON analytics_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics history"
  ON analytics_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_domain_analytics_domain_id ON domain_analytics(domain_id);
CREATE INDEX idx_domain_analytics_date ON domain_analytics(date DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_dns_records_domain_id ON dns_records(domain_id);
CREATE INDEX idx_email_forwarding_domain_id ON email_forwarding(domain_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_ssl_certificates_domain_id ON ssl_certificates(domain_id);
CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_analytics_history_user_id ON analytics_history(user_id);
CREATE INDEX idx_analytics_history_metric_type ON analytics_history(metric_type);
