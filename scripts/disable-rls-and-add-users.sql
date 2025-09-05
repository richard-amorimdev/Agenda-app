-- Desabilitar RLS temporariamente para resolver problemas de inserção
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Limpar usuários existentes (se houver)
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Inserir usuários padrão
INSERT INTO users (username, password, role, created_at) VALUES
('Administrador01', '$2b$10$rQJ8YQZ9X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3', 'admin', NOW()),
('consultor01', '$2b$10$rQJ8YQZ9X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3', 'consultor', NOW()),
('richard', '$2b$10$rQJ8YQZ9X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3', 'consultor', NOW());

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

-- Criar políticas permissivas
CREATE POLICY "allow_all_select" ON users FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON users FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON users FOR DELETE USING (true);

-- Reabilitar RLS com as novas políticas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verificar se os usuários foram inseridos
SELECT username, role, created_at FROM users ORDER BY created_at;
