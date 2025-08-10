# Slack to Jira Integration

Backend para integração entre Slack e Jira, permitindo criar tickets no Jira através de comandos no Slack.

## Funcionalidades

- Comando `/criar-ticket` no Slack
- **Modal interativo** para preenchimento dos dados do ticket
- Criação automática de tickets no Jira
- Suporte a diferentes tipos de issue (Solicitação, Bug, Incidente)
- Suporte a prioridades (Lowest, Low, Medium, High, Highest)
- Validação de campos obrigatórios
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
   - `views:open` - Para abrir modais
   - `views:submit` - Para processar submissões de modais
3. Configure o comando `/criar-ticket` com a URL: `https://your-domain.vercel.app/api/slack/command`
4. Configure o endpoint de interações com a URL: `https://your-domain.vercel.app/api/slack/interactions`

### 3. Configuração do Jira

1. Gere um API Token no [Atlassian Account](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Configure o projeto e chave do projeto no Jira

## Uso

### Comando no Slack

Digite `/criar-ticket` no Slack e um modal será aberto para preencher os dados do ticket.

### Modal de Criação

O modal inclui os seguintes campos:

- **Título do Ticket** (obrigatório): Nome/título do ticket
- **Descrição** (obrigatório): Descrição detalhada do problema ou solicitação
- **Tipo de Issue** (opcional): Solicitação, Bug ou Incidente
- **Prioridade** (opcional): Lowest, Low, Medium, High, Highest

### Exemplos de Uso

1. **Digite o comando:**
   ```
   /criar-ticket
   ```

2. **Preencha o modal que aparece:**
   - Título: "Bug crítico no login"
   - Descrição: "O sistema não está permitindo login de usuários com credenciais válidas. Urgente!"
   - Tipo: Bug
   - Prioridade: High

3. **Clique em "Criar Ticket"**

### Resposta

Após criar o ticket, você receberá uma mensagem de confirmação com:
- Link direto para o ticket no Jira
- Número do ticket criado
- Status de criação

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
- `POST /api/slack/interactions` - Endpoint para interações (modais) do Slack

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
│   │       ├── command.ts      # Endpoint para comandos
│   │       └── interactions.ts # Endpoint para modais
│   └── index.tsx
└── types/
    └── index.ts     # Tipos TypeScript
```

## Segurança

### GitHub Push Protection

Este projeto utiliza o **GitHub Push Protection** para detectar e bloquear automaticamente commits que contenham secrets, tokens ou credenciais sensíveis.

#### O que é protegido:
- Tokens da API do Atlassian/Jira
- Tokens do Slack Bot
- Signing Secrets
- Credenciais de acesso
- Chaves de API

#### Como funciona:
O GitHub automaticamente escaneia todos os commits e bloqueia pushes que contenham padrões de secrets conhecidos, incluindo:
- `ATATT3x...` (Atlassian API Tokens)
- `xoxb-...` (Slack Bot Tokens)
- `xoxp-...` (Slack User Tokens)
- `sk-...` (OpenAI API Keys)
- E muitos outros padrões

### Boas Práticas de Segurança

#### 1. Variáveis de Ambiente
✅ **Correto:**
```bash
# .env.local (não commitado)
JIRA_API_TOKEN=ATATT3x...
SLACK_BOT_TOKEN=xoxb-...
```

❌ **Incorreto:**
```javascript
// Código hardcoded
const token = "ATATT3x...";
```

#### 2. Arquivos Sensíveis
O arquivo `postman_collection.json` está no `.gitignore` pois pode conter tokens de teste. Nunca commite este arquivo.

#### 3. Tokens Comprometidos
Se um token for exposto acidentalmente:
1. **Revogue imediatamente** o token no painel do Atlassian/Slack
2. **Gere um novo token**
3. **Atualize as variáveis de ambiente**
4. **Use `git filter-branch`** para remover o token do histórico

#### 4. Configuração Local
Para desenvolvimento local, use:
```bash
# Copie o exemplo
cp env.example .env.local

# Configure suas credenciais
nano .env.local
```

### Recursos de Segurança

- **Secret Scanning**: GitHub escaneia automaticamente por secrets
- **Dependabot**: Atualizações automáticas de dependências
- **CodeQL**: Análise estática de código para vulnerabilidades
- **Branch Protection**: Regras para branches principais

## Troubleshooting

### Problemas Comuns

#### Modal não abre
- Verifique se as permissões `views:open` e `views:submit` estão configuradas
- Confirme se o endpoint de interações está configurado corretamente
- Verifique os logs do servidor para erros de autenticação

#### Ticket não é criado
- Verifique se as credenciais do Jira estão corretas
- Confirme se o projeto e chave do projeto existem
- Verifique se o usuário tem permissão para criar tickets

#### Erro de validação
- Certifique-se de que título e descrição estão preenchidos
- Verifique se os tipos de issue e prioridades são válidos para seu projeto Jira

### Logs e Debug

Para debug, verifique os logs do servidor:
```bash
# Em desenvolvimento
npm run dev

# Em produção (Vercel)
# Verifique os logs no painel do Vercel
```

## Licença

MIT
