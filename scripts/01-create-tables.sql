-- Remover tabelas existentes se houver
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Criar tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'consultor' CHECK (role IN ('admin', 'consultor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  consultant_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('manha', 'tarde', 'integral')), -- Novo campo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_tasks_consultant_id ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_dates ON tasks(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tasks_time_slot ON tasks(time_slot);

-- Verificar se as tabelas foram criadas
SELECT 'Tabela users criada com sucesso' as status;
SELECT 'Tabela tasks criada com sucesso' as status;
