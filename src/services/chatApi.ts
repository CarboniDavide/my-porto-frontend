import type { ChatMessage, ChatResponse } from '../types/chat'

const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''

// Upload file (txt/pdf) to recruiter backend
export type FileUploadResponse = {
  reply: string
  extractedText?: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  } | null
  model?: string
  error?: string
}

export async function uploadFile(file: File, endpoint: string): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}${endpoint}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'File upload failed');
  }
  return data as FileUploadResponse;
}

export async function sendChat(
  endpoint: string,
  messages: ChatMessage[],
  recaptchaToken: string,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, recaptchaToken }),
    signal,
  })

  const data = (await response.json()) as ChatResponse

  if (!response.ok) {
    throw new Error(data.error || 'Chat request failed')
  }

  return data
}
