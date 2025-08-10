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

    // Abrir o modal usando a API do Slack
    const modalView = SlackService.createTicketModalView()
    console.log('Tentando abrir modal com trigger_id:', command.trigger_id)
    
    const response = await SlackService.openModal(command.trigger_id, modalView)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro ao abrir modal:', response.status, errorText)
      throw new Error(`Falha ao abrir modal: ${response.status} - ${errorText}`)
    }
    
    const responseData = await response.json()
    console.log('Modal aberto com sucesso:', responseData)

    // Responder com uma mensagem simples
    res.status(200).json({
      response_type: 'ephemeral',
      text: 'Modal aberto! Preencha os dados do ticket.'
    })

  } catch (error) {
    console.error('Erro ao processar comando:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    const slackResponse = SlackService.createErrorResponse(errorMessage)
    
    res.status(500).json(slackResponse)
  }
}
