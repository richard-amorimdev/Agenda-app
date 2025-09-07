# Agenda App

Este é um sistema de agendamento de tarefas construído com Next.js e Supabase. A aplicação permite que os usuários se cadastrem, façam login, visualizem um dashboard, gerenciem e visualizem tarefas em diferentes formatos, como uma agenda diária e um gráfico de Gantt.

## ✨ Funcionalidades

-   **Autenticação de Usuários:** Sistema completo de cadastro, login e logout.
-   **Dashboard:** Página inicial após o login.
-   **Visualização de Tarefas:**
    -   Visualização em formato de agenda diária.
    -   Visualização em gráfico de Gantt.
-   **Gerenciamento de Tarefas:** Criação e agendamento de novas tarefas.
-   **Design Moderno:** Interface construída com [shadcn/ui](https://ui.shadcn.com/) e [Tailwind CSS](https://tailwindcss.com/).
-   **Notificações:** Feedbacks visuais para ações do usuário (login, cadastro, logout).
-   **Tema Escuro/Claro:** Suporte para alternância de tema.

## 🚀 Tecnologias Utilizadas

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Banco de Dados:** [Supabase](https://supabase.io/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
-   **Notificações:** [Sonner](https://sonner.emilkowal.ski/)
-   **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)

## ⚙️ Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 20 ou superior)
-   [pnpm](https://pnpm.io/installation)
-   Uma conta no [Supabase](https://supabase.com/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd agenda-app-main
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Configuração do Ambiente (Supabase):**
    -   Crie um novo projeto no Supabase.
    -   Vá para **Project Settings > API**.
    -   Crie um arquivo `.env.local` na raiz do projeto.
    -   Copie e cole as seguintes variáveis de ambiente no arquivo `.env.local` e preencha com suas credenciais do Supabase:

        ```env
        NEXT_PUBLIC_SUPABASE_URL="URL_DO_SEU_PROJETO_SUPABASE"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_PUBLICA"
        SUPABASE_SERVICE_ROLE_KEY="SUA_CHAVE_SERVICE_ROLE"
        ```
        **Nota:** A `SUPABASE_SERVICE_ROLE_KEY` é necessária para executar alguns scripts de administração.

4.  **Configuração do Banco de Dados:**
    -   No seu projeto Supabase, vá para o **SQL Editor**.
    -   Execute os scripts SQL localizados na pasta `/scripts` na seguinte ordem para criar as tabelas e popular os dados iniciais:
        1.  `01-create-tables.sql`
        2.  `02-seed-data.sql`
        3.  `03-add-new-task-fields.sql`
        4.  ... e assim por diante, seguindo a numeração.

### Executando a Aplicação

-   Para iniciar o servidor de desenvolvimento, execute:
    ```bash
    pnpm dev
    ```
-   Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação.

### Outros Scripts

-   **Build para produção:** `pnpm build`
-   **Iniciar em modo de produção:** `pnpm start`
-   **Verificar erros de lint:** `pnpm lint`

## 📂 Estrutura do Projeto

```
.
├── app/                     # Rotas da aplicação (Next.js App Router)
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal da aplicação
│   ├── page.tsx             # Página inicial (redireciona para /login)
│   ├── dashboard/           # Rota e página do dashboard principal
│   ├── login/               # Rota e página de login
│   ├── register/            # Rota e página de cadastro
│   └── scheduled-tasks/     # Rota e página de tarefas agendadas
│
├── components/              # Componentes React reutilizáveis
│   ├── agenda/              # Componentes para a visualização de agenda
│   ├── auth/                # Formulários de login e registro
│   ├── gantt/               # Componentes para o gráfico de Gantt
│   ├── layout/              # Componentes de layout (cabeçalho, etc.)
│   ├── tasks/               # Componentes relacionados a tarefas
│   ├── ui/                  # Componentes base do shadcn/ui
│   └── theme-provider.tsx   # Provedor de tema (claro/escuro)
│
├── hooks/                   # Hooks React customizados
│   ├── use-mobile.ts        # Hook para detectar dispositivos móveis
│   └── use-toast.ts         # Hook para exibir notificações (toast)
│
├── lib/                     # Funções e utilitários
│   ├── auth.ts              # Lógica de autenticação (signIn, signUp, signOut)
│   ├── supabase.ts          # Cliente e configuração do Supabase
│   └── utils.ts             # Funções utilitárias (ex: formatação)
│
├── public/                  # Arquivos estáticos (imagens, logos)
│
├── scripts/                 # Scripts SQL para o banco de dados Supabase
│
├── styles/                  # Arquivos de estilo adicionais
│
├── .gitignore               # Arquivos e pastas ignorados pelo Git
├── components.json          # Configuração do shadcn/ui
├── middleware.ts            # Middleware do Next.js para proteção de rotas
├── next.config.mjs          # Arquivo de configuração do Next.js
├── package.json             # Dependências e scripts do projeto
├── pnpm-lock.yaml           # Lockfile do pnpm
├── postcss.config.mjs       # Configuração do PostCSS (para Tailwind CSS)
└── tsconfig.json            # Configuração do TypeScript
```

## 🔐 Autenticação

A autenticação é gerenciada usando o Supabase Auth. As principais funções estão em `lib/auth.ts`. O fluxo inclui cadastro de novos usuários, login com usuário e senha, e logout. As políticas de segurança a nível de linha (RLS) do Supabase são utilizadas para garantir que os usuários só possam acessar seus próprios dados.
