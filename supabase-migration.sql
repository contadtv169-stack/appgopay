-- ============================================================
-- GoPay - Supabase SQL Completo (Executar no SQL Editor)
-- ============================================================
-- 1. Cria todas as tabelas
-- 2. Configura Row Level Security (RLS)
-- 3. Cria índices para performance
-- 4. Cria trigger automático de perfil ao cadastrar
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- 1. PROFILES (perfil dos usuários)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: cada usuário vê/apenas seu próprio perfil
CREATE POLICY "Usuário pode ver próprio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuário pode criar próprio perfil"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar próprio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- 2. GATEWAY_CONNECTIONS (conexões com gateways)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS gateway_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL CHECK (gateway IN ('krypt', 'abacate', 'pixgo', 'pixkey')),
  mode TEXT DEFAULT 'api' CHECK (mode IN ('api', 'offline')),
  credentials JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- apenas 1 gateway por usuário
);

ALTER TABLE gateway_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário pode ver própria conexão"
  ON gateway_connections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar conexão"
  ON gateway_connections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar conexão"
  ON gateway_connections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode excluir conexão"
  ON gateway_connections FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- 3. PAYMENT_LINKS (links de pagamento)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  url TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  expiration TEXT DEFAULT '',
  transaction_id TEXT DEFAULT '',
  payments INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  qr_code_base64 TEXT,
  copy_paste TEXT,
  payment_link TEXT,
  checkout JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por slug (checkout público)
CREATE INDEX IF NOT EXISTS idx_payment_links_slug ON payment_links(slug);
CREATE INDEX IF NOT EXISTS idx_payment_links_user ON payment_links(user_id);

ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado gerencia seus próprios links
CREATE POLICY "Usuário ver próprios links"
  ON payment_links FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário criar link"
  ON payment_links FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualizar link"
  ON payment_links FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário excluir link"
  ON payment_links FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICA PÚBLICA: qualquer pessoa (não logada) pode ver um link pelo slug
-- Isso é necessário para a página de checkout funcionar sem login
CREATE POLICY "Público ver link por slug"
  ON payment_links FOR SELECT
  USING (true);

-- ═══════════════════════════════════════════════════════════
-- 4. NOTIFICATIONS (notificações do usuário)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payment_received', 'link_created', 'link_expired', 'gateway_connected')),
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário ver notificações"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário criar notificação"
  ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualizar notificação"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário excluir notificação"
  ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- 5. TRIGGER: criar perfil automaticamente no cadastro
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FIM - GoPay Supabase SQL
-- ============================================================
