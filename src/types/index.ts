export interface SlackCommand {
  command: string
  text: string
  user_id: string
  user_name: string
  channel_id: string
  channel_name: string
  team_id: string
  team_domain: string
  response_url: string
  trigger_id: string
}

export interface JiraIssue {
  fields: {
    project: {
      key: string
    }
    summary: string
    description: string | {
      type: string
      version: number
      content: Array<{
        type: string
        content: Array<{
          type: string
          text: string
        }>
      }>
    }
    issuetype: {
      name: string
    }
    assignee?: {
      emailAddress: string
    }
    priority?: {
      name: string
    }
  }
}

export interface JiraResponse {
  id: string
  key: string
  self: string
}

export interface SlackResponse {
  response_type: 'in_channel' | 'ephemeral'
  text: string
  attachments?: Array<{
    color: string
    title: string
    title_link: string
    text: string
    fields: Array<{
      title: string
      value: string
      short: boolean
    }>
  }>
}
