import { useState } from 'react'
import { ArrowUp, FileText, Plus, SquarePen, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  embedded?: boolean
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
  embedded = false,
}: ChatInputProps) {
  const { t } = useTranslation('translation')
  const { getRecaptchaToken } = useRecaptcha()
  const uploadLabel = t('chat.upload', 'Upload file')
  const newChatLabel = t('chat.newChat', 'New chat')
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
        const recaptchaToken = await getRecaptchaToken('chat_file_upload')
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
      e.currentTarget.form?.requestSubmit()
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
      className={`chat-input-form flex flex-col gap-2 border border-[#ebdcc9] bg-[#fffaf4] p-3 ${embedded ? 'chat-input-form-embedded' : 'rounded-3xl'}`}
    >
      {file && (
        <div className="flex">
          <div className="flex max-w-full items-center gap-2 rounded-xl bg-[#fdf4e8] py-1.5 pl-1.5 pr-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fffaf4] text-[#d66d28]">
              <FileText className="size-4" />
            </span>
            <span className="max-w-[14rem] truncate text-sm text-[#1f2327]">{file.name}</span>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove file"
              disabled={uploading}
              className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#ebdcc9] hover:text-[#1f2327]"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="w-full resize-none bg-transparent px-2 py-2 text-sm text-[#1f2327] placeholder:text-[#d66d28] focus:outline-none"
        style={{ minHeight: 40, maxHeight: 160 }}
      />

      {fileError && <div className="px-2 text-xs text-red-600">{fileError}</div>}
      {uploading && <div className="px-2 text-xs text-[#d66d28]">Uploading…</div>}

      <div className="flex items-center justify-between">
        {showUpload ? (
          <label
            aria-label={uploadLabel}
            className="chat-upload-button group relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#ebdcc9] bg-[#fdf4e8] text-[#d66d28] transition hover:bg-[#d66d28] hover:text-white"
          >
            <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 whitespace-nowrap rounded-md bg-[#1f2327] px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition group-hover:opacity-100 group-focus-within:opacity-100" role="tooltip">
              {uploadLabel}
            </span>
            <Plus className="size-5" />
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={e => {
                handleFileChange(e)
                e.target.value = ''
              }}
              className="hidden"
              disabled={disabled || uploading}
            />
          </label>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          {showReset && (
            <button
              type="button"
              onClick={resetAll}
              aria-label={newChatLabel}
              title={newChatLabel}
              className="chat-reset-button flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#ebdcc9] bg-[#fdf4e8] text-[#d66d28] transition hover:bg-[#d66d28] hover:text-white"
            >
              <SquarePen className="size-5" />
            </button>
          )}
          <button
            type="submit"
            aria-label={t('chat.send')}
            disabled={disabled || uploading || (!draft.trim() && !file)}
            className="chat-submit-button flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#d66d28] text-white transition hover:bg-[#c05e20] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </form>
  )
}
