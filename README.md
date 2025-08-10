# Slack to Jira Integration

Backend para integração entre Slack e Jira, permitindo criar tickets no Jira através de comandos no Slack.

## Funcionalidades

- Comando `/criar-ticket` no Slack
- Criação automática de tickets no Jira
- Suporte a prioridades (Baixa, Média, Alta, Crítica)
- Respostas visuais no Slack com links para o Jira
- Totalmente compatível com Vercel

## Tecnologias

- Next.js 14
- TypeScript
- Slack Bolt API
- Jira REST API v3
- Axios para requisições HTTP

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `env.example` para `.env.local` e configure:

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=PROJ

# Server Configuration
NODE_ENV=production
PORT=3000
```

### 2. Configuração do Slack

1. Crie um app no [Slack API](https://api.slack.com/apps)
2. Configure as permissões necessárias:
   - `commands` - Para comandos slash
   - `chat:write` - Para enviar mensagens
3. Configure o comando `/criar-ticket` com a URL: `https://your-domain.vercel.app/api/slack/command`

### 3. Configuração do Jira

1. Gere um API Token no [Atlassian Account](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Configure o projeto e chave do projeto no Jira

## Uso

### Comando no Slack

```
/criar-ticket [Prioridade] Título do ticket

Descrição detalhada do ticket
pode ter múltiplas linhas
```

### Exemplos

```
/criar-ticket [Alta] Bug crítico no login
O sistema não está permitindo login de usuários
com credenciais válidas. Urgente!

/criar-ticket Melhoria na interface
Adicionar botão de exportar relatórios
na tela de dashboard
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## Deploy no Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático será realizado a cada push

## Endpoints

- `GET /` - Página inicial
- `GET /api/health` - Health check
- `POST /api/slack/command` - Endpoint para comandos do Slack

## Estrutura do Projeto

```
src/
├── lib/
│   ├── jira.ts      # Cliente Jira
│   └── slack.ts     # Utilitários Slack
├── pages/
│   ├── api/
│   │   ├── health.ts
│   │   └── slack/
│   │       └── command.ts
│   └── index.tsx
└── types/
    └── index.ts     # Tipos TypeScript
```

## Licença

MIT
