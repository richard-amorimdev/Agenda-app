-- Migração para adicionar novos campos à tabela tasks
-- Este script adiciona os campos necessários para o novo sistema de data/período

-- Adicionando novos campos para suportar data única e horários específicos
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS data TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS horario_inicio TIME,
ADD COLUMN IF NOT EXISTS horario_fim TIME,
ADD COLUMN IF NOT EXISTS periodo_tipo TEXT CHECK (periodo_tipo IN ('personalizado', 'integral', 'manha', 'tarde'));

-- Criando índices para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_tasks_data ON tasks(data);
CREATE INDEX IF NOT EXISTS idx_tasks_periodo_tipo ON tasks(periodo_tipo);
CREATE INDEX IF NOT EXISTS idx_tasks_horarios ON tasks(horario_inicio, horario_fim);

-- Atualizando tarefas existentes para usar o novo formato
-- Migrar dados existentes: copiar start_date para data e mapear time_slot para periodo_tipo
UPDATE tasks 
SET 
  data = start_date,
  periodo_tipo = time_slot,
  horario_inicio = CASE 
    WHEN time_slot = 'manha' THEN '08:00'::TIME
    WHEN time_slot = 'tarde' THEN '13:00'::TIME
    WHEN time_slot = 'integral' THEN '08:00'::TIME
    ELSE '08:00'::TIME
  END,
  horario_fim = CASE 
    WHEN time_slot = 'manha' THEN '12:00'::TIME
    WHEN time_slot = 'tarde' THEN '18:00'::TIME
    WHEN time_slot = 'integral' THEN '18:00'::TIME
    ELSE '18:00'::TIME
  END
WHERE data IS NULL;

-- Verificar se a migração foi bem-sucedida
SELECT 'Migração concluída com sucesso' as status;
SELECT 
  COUNT(*) as total_tasks,
  COUNT(data) as tasks_with_data,
  COUNT(horario_inicio) as tasks_with_start_time,
  COUNT(horario_fim) as tasks_with_end_time,
  COUNT(periodo_tipo) as tasks_with_period_type
FROM tasks;

-- Mostrar algumas tarefas migradas como exemplo
SELECT 
  id,
  title,
  data,
  horario_inicio,
  horario_fim,
  periodo_tipo,
  start_date,
  time_slot
FROM tasks 
LIMIT 5;
