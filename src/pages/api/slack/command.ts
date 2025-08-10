import { NextApiRequest, NextApiResponse } from 'next'
import { SlackCommand } from '@/types'
import { SlackService } from '@/lib/slack'
import { JiraService } from '@/lib/jira'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const command = req.body as SlackCommand

    if (command.command !== '/criar-ticket') {
      return res.status(400).json({ error: 'Comando não reconhecido' })
    }

    SlackService.validateCommand(command)
    
    const { summary, description, priority } = SlackService.parseCommand(command.text)

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
    
    const slackResponse = SlackService.createSuccessResponse(
      jiraResponse.key,
      summary,
      issueUrl
    )

    res.status(200).json(slackResponse)

  } catch (error) {
    console.error('Erro ao processar comando:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    const slackResponse = SlackService.createErrorResponse(errorMessage)
    
    res.status(500).json(slackResponse)
  }
}
