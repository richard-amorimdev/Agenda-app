-- Limpar usuários e configurar RLS para permitir registro
-- Este script remove todos os usuários e configura políticas permissivas

-- Desabilitar RLS temporariamente para limpeza
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Limpar todos os usuários existentes
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Limpar todas as tarefas (já que dependem dos usuários)
TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;

-- Remover políticas existentes
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_policy" ON tasks;

-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para users
CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete_policy" ON users FOR DELETE USING (true);

-- Criar políticas permissivas para tasks
CREATE POLICY "tasks_select_policy" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert_policy" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "tasks_update_policy" ON tasks FOR UPDATE USING (true);
CREATE POLICY "tasks_delete_policy" ON tasks FOR DELETE USING (true);

-- Verificar se as tabelas estão vazias
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Tasks count:' as info, COUNT(*) as count FROM tasks;
