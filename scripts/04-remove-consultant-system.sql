-- Script para remover o sistema de consultores e converter para single-user admin

-- 1. Backup das tarefas existentes (opcional)
CREATE TABLE IF NOT EXISTS tasks_backup AS SELECT * FROM tasks;

-- 2. Remover constraint de foreign key para consultant_id
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_consultant_id_fkey;

-- 3. Atualizar todas as tarefas para usar o primeiro admin como consultant_id
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Buscar o primeiro admin
    SELECT id INTO admin_id FROM users WHERE role = 'admin' LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- Atualizar todas as tarefas para usar este admin
        UPDATE tasks SET consultant_id = admin_id WHERE consultant_id IS NOT NULL;
        
        RAISE NOTICE 'Todas as tarefas foram atribuídas ao admin: %', admin_id;
    ELSE
        RAISE EXCEPTION 'Nenhum administrador encontrado no sistema!';
    END IF;
END $$;

-- 4. Remover todos os usuários com role 'consultor'
DELETE FROM users WHERE role = 'consultor';

-- 5. Atualizar constraint de role para aceitar apenas 'admin'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin'));

-- 6. Atualizar role padrão para 'admin'
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'admin';

-- 7. Recriar foreign key constraint (opcional, mas recomendado)
ALTER TABLE tasks ADD CONSTRAINT tasks_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES users(id) ON DELETE CASCADE;

-- 8. Verificar resultados
SELECT 'Usuários restantes:' as info, COUNT(*) as count FROM users;
SELECT 'Tarefas atualizadas:' as info, COUNT(*) as count FROM tasks;

-- 9. Mostrar estatísticas finais
SELECT 
    'Sistema convertido para single-user admin com sucesso!' as status,
    (SELECT COUNT(*) FROM users) as total_admins,
    (SELECT COUNT(*) FROM tasks) as total_tasks;
