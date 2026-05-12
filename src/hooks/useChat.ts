import { useState } from 'react'
import { useRecaptcha } from '../contexts/RecaptchaContext'
import { sendChat } from '../services/chatApi'
import type { ChatMessage, Message } from '../types/chat'

export function useChat(endpoint: string) {
  const { getRecaptchaToken } = useRecaptcha()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setError(null)
    setIsLoading(true)

    const history: ChatMessage[] = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }))

    try {
      const recaptchaToken = await getRecaptchaToken('chat_message')
      const response = await sendChat(endpoint, history, recaptchaToken)

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.reply || '...',
        },
      ])
    } catch {
      setError('The assistant is unavailable right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setMessages([])
    setError(null)
  }

  function addAssistantMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
      },
    ])
  }

  return { messages, isLoading, error, send, reset, addAssistantMessage }
}
