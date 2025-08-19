import axios from 'axios'
import { JiraIssue, JiraResponse } from '@/types'

const jiraClient = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  auth: {
    username: process.env.JIRA_EMAIL!,
    password: process.env.JIRA_API_TOKEN!
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export class JiraService {
  static async createIssue(issueData: {
    fields: {
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
  }): Promise<JiraResponse> {
    const issue: JiraIssue = {
      fields: {
        ...issueData.fields,
        project: {
          key: process.env.JIRA_PROJECT_KEY!
        }
      }
    }

    const response = await jiraClient.post<JiraResponse>('/rest/api/3/issue', issue)
    return response.data
  }

  static async getIssue(issueKey: string): Promise<JiraIssue> {
    const response = await jiraClient.get<JiraIssue>(`/rest/api/3/issue/${issueKey}`)
    return response.data
  }

  static async updateIssue(issueKey: string, issueData: Partial<JiraIssue>): Promise<void> {
    await jiraClient.put(`/rest/api/3/issue/${issueKey}`, issueData)
  }

  static getIssueUrl(issueKey: string): string {
    return `${process.env.JIRA_BASE_URL}/browse/${issueKey}`
  }
}
