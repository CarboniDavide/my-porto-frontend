export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type Message = {
  id: string
  role: ChatMessage['role']
  content: string
}

export type ChatResponse = {
  reply: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  } | null
  model?: string
  error?: string
}