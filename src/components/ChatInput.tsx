import { useState } from 'react'
import { useRecaptcha } from '../contexts/RecaptchaContext'
import type { FileUploadResponse } from '../services/chatApi'
import { uploadFile } from '../services/chatApi'

interface ChatInputProps {
  placeholder: string
  onSend: (text: string) => Promise<void>
  onAssistantMessage?: (text: string) => void
  onReset?: () => void
  showUpload?: boolean
  showReset?: boolean
  uploadEndpoint?: string
  disabled?: boolean
}

export function ChatInput({
  placeholder,
  onSend,
  onAssistantMessage,
  onReset,
  showUpload = false,
  showReset = false,
  uploadEndpoint,
  disabled = false,
}: ChatInputProps) {
  const { getRecaptchaToken } = useRecaptcha()
  const [draft, setDraft] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (
        selected.type === 'text/plain' ||
        selected.name.endsWith('.txt') ||
        selected.type === 'application/pdf' ||
        selected.name.endsWith('.pdf')
      ) {
        setFile(selected)
      } else {
        setFile(null)
        setFileError('Only .txt or .pdf allowed')
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Upload file
    if (file && uploadEndpoint) {
      setUploading(true)
      try {
        const recaptchaToken = await getRecaptchaToken('recruit_file_upload')
        const res: FileUploadResponse = await uploadFile(file, uploadEndpoint, recaptchaToken)
        setFile(null)
        if (res.reply && onAssistantMessage) {
          onAssistantMessage(res.reply)
        }
      } catch {
        setFileError('Upload error')
      } finally {
        setUploading(false)
      }
      return
    }

    // Send text
    if (draft.trim()) {
      await onSend(draft)
      setDraft('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void onSend(draft)
      setDraft('')
    }
  }

  function resetAll() {
    setDraft('')
    setFile(null)
    setFileError(null)
    onReset?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl bg-[#fffaf4] p-2 sm:flex-row sm:items-stretch sm:p-4"
    >
      <div className="relative flex-1 flex items-center">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={file ? file.name : placeholder}
          rows={2}
          disabled={disabled}
          className="overflow-hidden h-[52px] flex-1 resize-none rounded-xl border border-[#ebdcc9] bg-white px-3 py-3 pr-20 text-sm text-[#1f2327] placeholder:text-[#d66d28] focus:outline-none focus:ring-2 focus:ring-[#d66d28] sm:px-4"
          style={{ minHeight: 52, maxHeight: 160 }}
        />

        {/* Upload file */}
        {showUpload && (
          <label className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center cursor-pointer group">
            <span className="relative flex items-center">
              <span className="flex items-center justify-center size-7 rounded-full bg-[#fdf4e8] border border-[#ebdcc9] text-[#d66d28] text-xl font-bold transition group-hover:bg-[#d66d28] group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
                </svg>
              </span>
            </span>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || uploading}
            />
          </label>
        )}

        {/* Reset chat */}
        {showReset && (
          <button
            type="button"
            onClick={resetAll}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-full bg-[#fdf4e8] border border-[#ebdcc9] text-[#d66d28] text-xl font-bold transition hover:bg-[#d66d28] hover:text-white cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {fileError && <div className="text-xs text-red-600 self-center">{fileError}</div>}
      {uploading && <div className="text-xs text-[#d66d28] self-center">Uploading…</div>}

      <button
        type="submit"
        disabled={disabled || (!draft.trim() && !file)}
        className="h-[52px] w-full rounded-xl bg-[#d66d28] px-5 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-[#c05e20] disabled:translate-y-0 sm:w-auto"
      >
        Send
      </button>
    </form>
  )
}
