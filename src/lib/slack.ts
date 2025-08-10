import { SlackCommand, SlackResponse } from '@/types'

export class SlackService {
  static parseCommand(text: string): { summary: string; description: string; priority?: string } {
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      throw new Error('Texto do comando não pode estar vazio')
    }

    const summary = lines[0].trim()
    const description = lines.slice(1).join('\n').trim() || summary
    
    const priorityMatch = summary.match(/\[(Baixa|Média|Alta|Crítica)\]/i)
    const priority = priorityMatch ? priorityMatch[1] : undefined
    
    const cleanSummary = summary.replace(/\[(Baixa|Média|Alta|Crítica)\]/i, '').trim()

    return {
      summary: cleanSummary || 'Ticket criado via Slack',
      description,
      priority
    }
  }

  static createSuccessResponse(issueKey: string, summary: string, issueUrl: string): SlackResponse {
    return {
      response_type: 'in_channel',
      text: `✅ Ticket criado com sucesso!`,
      attachments: [
        {
          color: 'good',
          title: `${issueKey}: ${summary}`,
          title_link: issueUrl,
          text: 'Clique no título para visualizar o ticket no Jira',
          fields: [
            {
              title: 'Ticket',
              value: issueKey,
              short: true
            },
            {
              title: 'Status',
              value: 'Criado',
              short: true
            }
          ]
        }
      ]
    }
  }

  static createErrorResponse(error: string): SlackResponse {
    return {
      response_type: 'ephemeral',
      text: `❌ Erro ao criar ticket: ${error}`,
      attachments: [
        {
          color: 'danger',
          title: 'Erro',
          title_link: '',
          text: error,
          fields: []
        }
      ]
    }
  }

  static validateCommand(command: SlackCommand): void {
    if (!command.text || command.text.trim().length === 0) {
      throw new Error('Comando deve incluir uma descrição do ticket')
    }
  }
}
