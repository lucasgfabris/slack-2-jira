import { NextApiRequest, NextApiResponse } from 'next'
import { SlackService } from '@/lib/slack'
import { JiraService } from '@/lib/jira'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const payload = JSON.parse(req.body.payload)
    
    // Verificar se é uma submissão de modal
    if (payload.type === 'view_submission' && payload.view.callback_id === 'create_ticket_modal') {
      const values = payload.view.state.values
      
      // Extrair os valores do modal
      const summary = values.summary_block.summary_input.value
      const description = values.description_block.description_input.value
      const priority = values.priority_block.priority_input.selected_option?.value

      // Validar campos obrigatórios
      if (!summary || !description) {
        return res.status(200).json({
          response_action: 'errors',
          errors: {
            summary_block: !summary ? 'Título é obrigatório' : undefined,
            description_block: !description ? 'Descrição é obrigatória' : undefined
          }
        })
      }

      // Criar o ticket no Jira
      const issueData = {
        fields: {
          summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: description
                  }
                ]
              }
            ]
          },
          issuetype: {
            name: 'Task'
          },
          priority: priority ? {
            name: priority
          } : undefined
        }
      }

      const jiraResponse = await JiraService.createIssue(issueData)
      const issueUrl = JiraService.getIssueUrl(jiraResponse.key)
      
      // Enviar mensagem de confirmação no canal
      const successMessage = SlackService.createSuccessResponse(
        jiraResponse.key,
        summary,
        issueUrl
      )
      
      await SlackService.sendChannelMessage(payload.user.id, successMessage)
      
      // Responder com sucesso
      return res.status(200).json({
        response_action: 'clear'
      })
    }

    res.status(400).json({ error: 'Tipo de interação não suportado' })

  } catch (error) {
    console.error('Erro ao processar interação:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    
    res.status(500).json({
      response_action: 'errors',
      errors: {
        summary_block: errorMessage
      }
    })
  }
}
