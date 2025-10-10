# Agenda App

Este é um projeto de um sistema de agendamento de tarefas, desenvolvido com Next.js, Supabase e Shadcn UI.

## Visão Geral

O Agenda App é uma aplicação web que permite aos usuários gerenciar tarefas em um calendário visual. A aplicação oferece uma visualização em gráfico de Gantt e uma visualização diária, permitindo que os usuários criem, editem e excluam tarefas. A autenticação de usuários e o armazenamento de dados são gerenciados pelo Supabase.

## Tecnologias Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Backend e Banco de Dados:** [Supabase](https://supabase.io/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Notificações:** [Sonner](https://sonner.emilkowal.ski/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)

## Funcionalidades

*   **Autenticação de Usuários:** Sistema completo de login e registro de usuários com gerenciamento de sessão.
*   **Notificações em Tempo Real:** Exibição de notificações (toasts) para ações como login, cadastro, logout e outras interações do usuário.
*   **Dashboard Intuitivo:** Uma página central para visualização e gerenciamento de tarefas.
*   **Visualização em Gráfico de Gantt:** Permite aos usuários visualizar as tarefas em um cronograma mensal, facilitando o planejamento a longo prazo.
*   **Visualização Diária Detalhada:** Oferece uma visão clara das tarefas agendadas para um dia específico.
*   **Gerenciamento de Tarefas (CRUD):**
    *   **Criação:** Adicione novas tarefas com informações detalhadas como título, cliente, descrição e período de execução.
    *   **Leitura:** Visualize todas as tarefas nas diferentes visualizações.
    *   **Atualização:** Edite as tarefas existentes para ajustar detalhes.
    *   **Exclusão:** Remova tarefas que não são mais necessárias.
*   **Tema Escuro e Claro:** Suporte para alternância entre temas claro e escuro para melhor experiência do usuário.
*   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

## Modelo de Dados

O banco de dados é composto por duas tabelas principais: `users` e `tasks`.

### Tabela `users`

Armazena as informações dos usuários da aplicação.

| Coluna          | Tipo        | Descrição                               |
| --------------- | ----------- | ----------------------------------------- |
| `id`            | `UUID`      | Identificador único do usuário (PK)       |
| `username`      | `TEXT`      | Nome de usuário (único)                   |
| `password_hash` | `TEXT`      | Hash da senha do usuário                  |
| `name`          | `TEXT`      | Nome completo do usuário                  |
| `role`          | `TEXT`      | Papel do usuário (`admin` ou `consultor`) |
| `created_at`    | `TIMESTAMP` | Data de criação do registro               |
| `updated_at`    | `TIMESTAMP` | Data da última atualização do registro    |

### Tabela `tasks`

Armazena as tarefas agendadas pelos usuários.

| Coluna          | Tipo        | Descrição                                                          |
| --------------- | ----------- | ------------------------------------------------------------------ |
| `id`            | `UUID`      | Identificador único da tarefa (PK)                                 |
| `title`         | `TEXT`      | Título da tarefa                                                   |
| `description`   | `TEXT`      | Descrição detalhada da tarefa                                      |
| `client_name`   | `TEXT`      | Nome do cliente associado à tarefa                                 |
| `consultant_id` | `UUID`      | ID do consultor responsável pela tarefa (FK para `users.id`)       |
| `start_date`    | `TIMESTAMP` | Data e hora de início da tarefa                                    |
| `end_date`      | `TIMESTAMP` | Data e hora de término da tarefa                                   |
| `time_slot`     | `TEXT`      | Período do dia (`manha`, `tarde`, `integral`)                      |
| `created_at`    | `TIMESTAMP` | Data de criação do registro                                        |
| `updated_at`    | `TIMESTAMP` | Data da última atualização do registro                             |

## Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/agenda-app.git
    cd agenda-app
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis de ambiente do Supabase:

    ```
    NEXT_PUBLIC_SUPABASE_URL=SEU_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
    ```

    Você pode encontrar essas chaves nas configurações do seu projeto Supabase.

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação.

## Estrutura de Pastas

```
.
├── app/                # Páginas da aplicação (roteamento baseado em arquivo)
│   ├── dashboard/      # Página principal após o login
│   ├── login/          # Página de login
│   ├── register/       # Página de registro
│   ├── scheduled-tasks/# Página para visualização de tarefas agendadas
│   ├── layout.tsx      # Layout raiz da aplicação
│   └── page.tsx        # Página inicial (landing page)
├── components/         # Componentes React reutilizáveis
│   ├── agenda/         # Componentes específicos da agenda (ex: DayView)
│   ├── auth/           # Componentes de autenticação (ex: LoginForm)
│   ├── gantt/          # Componentes do gráfico de Gantt
│   ├── layout/         # Componentes de layout (ex: Header)
│   ├── tasks/          # Componentes relacionados a tarefas (ex: CreateTaskForm)
│   └── ui/             # Componentes base da UI (Shadcn UI)
├── lib/                # Funções utilitárias e configuração de bibliotecas
│   ├── auth.ts         # Funções de autenticação com Supabase
│   ├── supabase.ts     # Configuração do cliente Supabase
│   └── utils.ts        # Funções utilitárias gerais
├── public/             # Arquivos estáticos (imagens, fontes, etc.)
├── scripts/            # Scripts SQL para gerenciamento do banco de dados
└── styles/             # Estilos globais
```

## Scripts SQL

A pasta `scripts/` contém scripts SQL para criar e popular o banco de dados no Supabase:

*   `01-create-tables.sql`: Cria as tabelas `users` e `tasks`, juntamente com seus índices.
*   `02-seed-data.sql`: Popula o banco de dados com dados de exemplo para teste.
*   `03-add-new-task-fields.sql`: Script de migração para adicionar novos campos à tabela `tasks`.
*   `04-remove-consultant-system.sql`: Script de migração para remover o sistema de consultores.
*   `check-users.js`: Script para verificar os usuários no banco de dados.
*   `clear-users-and-fix-rls.sql`: Limpa os usuários e corrige as políticas de RLS.
*   `disable-rls-and-add-users.sql`: Desabilita RLS e adiciona usuários.
*   `fix-rls-policies.sql`: Corrige as políticas de RLS.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT.