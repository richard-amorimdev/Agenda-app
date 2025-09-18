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

## Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [pnpm](https://pnpm.io/installation) (opcional, mas recomendado)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/agenda-app.git
    cd agenda-app
    ```

2.  **Instale as dependências:**

    ```bash
    pnpm install
    # ou
    # npm install
    # ou
    # yarn install
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
pnpm dev
# ou
# npm run dev
# ou
# yarn dev
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

*   `01-create-tables.sql`: Cria as tabelas necessárias para a aplicação.
*   `02-seed-data.sql`: Popula o banco de dados com dados de exemplo para teste.
*   ... e outros scripts para manutenção e evolução do esquema do banco de dados.

## Implantação

A maneira mais fácil de implantar sua aplicação Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira a documentação de [implantação do Next.js](https://nextjs.org/docs/deployment) para mais detalhes.
