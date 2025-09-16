# Agenda App

Este é um projeto de um sistema de agendamento de tarefas, desenvolvido com Next.js, Supabase e Shadcn UI.

## Visão Geral

O Agenda App é uma aplicação web que permite aos usuários gerenciar tarefas em um calendário visual. A aplicação oferece uma visualização em gráfico de Gantt e uma visualização diária, permitindo que os usuários criem, editem e excluam tarefas. A autenticação de usuários e o armazenamento de dados são gerenciados pelo Supabase.

## Tecnologias Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Backend e Banco de Dados:** [Supabase](https://supabase.io/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)

## Funcionalidades

*   **Autenticação de Usuários:** Sistema de login e registro de usuários.
*   **Visualização em Gráfico de Gantt:** Visualize as tarefas em um cronograma mensal.
*   **Visualização Diária:** Veja as tarefas agendadas para um dia específico.
*   **Criação de Tarefas:** Adicione novas tarefas com título, cliente, descrição e período.
*   **Edição e Exclusão de Tarefas:** Gerencie as tarefas existentes.
*   **Filtragem por Consultor:** (Funcionalidade futura) Capacidade de filtrar tarefas por consultor.

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
├── app/                # Páginas da aplicação (roteamento)
│   ├── dashboard/
│   ├── login/
│   └── ...
├── components/         # Componentes React reutilizáveis
│   ├── agenda/
│   ├── auth/
│   ├── gantt/
│   └── ui/             # Componentes do Shadcn UI
├── lib/                # Funções utilitárias e configuração
│   ├── auth.ts         # Funções de autenticação
│   └── supabase.ts     # Cliente Supabase
├── public/             # Arquivos estáticos
└── ...
```

## Scripts SQL

A pasta `scripts/` contém scripts SQL para criar e popular o banco de dados:

*   `01-create-tables.sql`: Cria as tabelas necessárias.
*   `02-seed-data.sql`: Popula o banco de dados com dados de exemplo.
*   ... e outros scripts para manutenção do banco de dados.

## Implantação

A maneira mais fácil de implantar sua aplicação Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira a documentação de [implantação do Next.js](https://nextjs.org/docs/deployment) para mais detalhes.
