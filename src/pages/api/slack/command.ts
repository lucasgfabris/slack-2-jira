import { NextApiRequest, NextApiResponse } from 'next'
import { SlackCommand } from '@/types'
import { SlackService } from '@/lib/slack'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const command = req.body as SlackCommand

    if (command.command !== '/criar-ticket') {
      return res.status(400).json({ error: 'Comando não reconhecido' })
    }

    // Responder com um modal para coletar os dados do ticket
    const modalResponse = SlackService.createTicketModal(command.trigger_id)
    
    res.status(200).json(modalResponse)

  } catch (error) {
    console.error('Erro ao processar comando:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    const slackResponse = SlackService.createErrorResponse(errorMessage)
    
    res.status(500).json(slackResponse)
  }
}
