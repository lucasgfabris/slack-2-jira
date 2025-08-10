# Configuração do Slack App com Modal

## 1. Configurações no Slack App

### Permissões OAuth & Scopes
Adicione as seguintes permissões:
- `commands` - Para slash commands
- `chat:write` - Para enviar mensagens
- `chat:write.public` - Para enviar mensagens em canais públicos

### Event Subscriptions
Configure os seguintes eventos:
- **Request URL**: `https://slack-2-jira-8rvm.vercel.app/api/slack/interactions`
- **Bot Events**:
  - `message.channels` (opcional, para responder a mensagens)

### Slash Commands
Configure o comando:
- **Command**: `/criar-ticket`
- **Request URL**: `https://slack-2-jira-8rvm.vercel.app/api/slack/command`
- **Short Description**: `Criar ticket no Jira`
- **Usage Hint**: `[título] [descrição]`

## 2. Variáveis de Ambiente na Vercel

Configure as seguintes variáveis no dashboard da Vercel:

```
JIRA_BASE_URL=https://seu-dominio.atlassian.net
JIRA_EMAIL=seu-email@exemplo.com
JIRA_API_TOKEN=seu-token-api-jira
JIRA_PROJECT_KEY=PROJ
SLACK_BOT_TOKEN=xoxb-seu-bot-token
```

### Como obter o SLACK_BOT_TOKEN:
1. Vá para **OAuth & Permissions** no seu Slack App
2. Copie o **Bot User OAuth Token** (começa com `xoxb-`)

## 3. Fluxo de Funcionamento

1. Usuário digita `/criar-ticket` no Slack
2. Slack envia requisição para `/api/slack/command`
3. Backend responde com um modal
4. Usuário preenche o modal e clica em "Criar Ticket"
5. Slack envia os dados para `/api/slack/interactions`
6. Backend cria o ticket no Jira
7. Backend envia mensagem de confirmação no canal

## 4. Teste

Após configurar tudo:
1. Faça deploy na Vercel
2. Teste o comando `/criar-ticket` no Slack
3. Preencha o modal que aparecerá
4. Verifique se o ticket foi criado no Jira

## 5. Troubleshooting

### Erro "dispatch_failed"
- Verifique se a URL do comando está correta
- Confirme se o endpoint está respondendo corretamente

### Erro "Invalid URL"
- Verifique se as variáveis de ambiente do Jira estão configuradas
- Confirme se o JIRA_BASE_URL está correto

### Modal não aparece
- Verifique se o SLACK_BOT_TOKEN está configurado
- Confirme se as permissões do bot estão corretas
