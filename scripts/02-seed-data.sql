-- Verificar se a tabela users existe antes de limpar os dados
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'Tabela users não existe. Execute primeiro o script 01-create-tables.sql';
    END IF;
END $$;

-- Limpar todos os dados existentes (incluindo tarefas que dependem de usuários)
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE users CASCADE;

-- Verificar que as tabelas estão vazias
SELECT 'Banco de dados limpo com sucesso' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_tasks FROM tasks;
