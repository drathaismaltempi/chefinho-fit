-- Chefinho Fit — Executar no Supabase SQL Editor
-- Acesse: https://supabase.com/dashboard → seu projeto → SQL Editor

-- 1. Perfis de usuário (um por conta)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê apenas seu próprio perfil"
  ON public.profiles FOR ALL USING (auth.uid() = id);

-- Cria perfil automaticamente ao fazer cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',        -- 'free' | 'plus'
  status TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'cancelled' | 'expired'
  hotmart_transaction_id TEXT,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê apenas sua própria assinatura"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Service role bypasses RLS para webhooks do Hotmart

-- 3. Contador de uso da IA por mês
CREATE TABLE IF NOT EXISTS public.ai_usage (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  month TEXT NOT NULL,   -- formato: '2026-06'
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, month)
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê apenas seu próprio uso"
  ON public.ai_usage FOR ALL USING (auth.uid() = user_id);
