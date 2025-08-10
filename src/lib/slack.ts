import { SlackCommand, SlackResponse } from '@/types'

export class SlackService {
  static parseCommand(text: string): { summary: string; description: string; priority?: string } {
    const lines = text.split('\n').filter(line => line.trim())
    
    // Se não há texto, usar valores padrão
    if (lines.length === 0) {
      return {
        summary: 'Ticket criado via Slack',
        description: 'Ticket criado automaticamente através do comando Slack',
        priority: undefined
      }
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
    // O texto é opcional - se não houver, usaremos valores padrão
    if (!command.text) {
      command.text = ''
    }
  }

  static createTicketModalView() {
    return {
      type: 'modal',
      callback_id: 'create_ticket_modal',
      title: {
        type: 'plain_text',
        text: 'Criar Ticket no Jira'
      },
      submit: {
        type: 'plain_text',
        text: 'Criar Ticket'
      },
      close: {
        type: 'plain_text',
        text: 'Cancelar'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'summary_block',
          label: {
            type: 'plain_text',
            text: 'Título do Ticket'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'summary_input',
            placeholder: {
              type: 'plain_text',
              text: 'Digite o título do ticket'
            },
            multiline: false
          }
        },
        {
          type: 'input',
          block_id: 'description_block',
          label: {
            type: 'plain_text',
            text: 'Descrição'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'description_input',
            placeholder: {
              type: 'plain_text',
              text: 'Digite a descrição do ticket'
            },
            multiline: true
          }
        },
        {
          type: 'input',
          block_id: 'priority_block',
          label: {
            type: 'plain_text',
            text: 'Prioridade'
          },
          element: {
            type: 'static_select',
            action_id: 'priority_input',
            placeholder: {
              type: 'plain_text',
              text: 'Selecione a prioridade'
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Baixa'
                },
                value: 'Baixa'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Média'
                },
                value: 'Média'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Alta'
                },
                value: 'Alta'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Crítica'
                },
                value: 'Crítica'
              }
            ]
          }
        }
      ]
    }
  }

  static async openModal(triggerId: string, view: unknown) {
    const response = await fetch('https://slack.com/api/views.open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        trigger_id: triggerId,
        view: view
      })
    })

    return response
  }

  static async sendChannelMessage(channelId: string, message: SlackResponse) {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: channelId,
        ...message
      })
    })

    if (!response.ok) {
      throw new Error('Falha ao enviar mensagem para o canal')
    }

    return response.json()
  }
}
