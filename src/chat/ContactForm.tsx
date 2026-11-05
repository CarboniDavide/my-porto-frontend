import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecaptcha } from '../contexts/RecaptchaContext'

const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''
const contactEndpoint = `${baseUrl}/api/contact`

type FormState = 'idle' | 'sending' | 'success' | 'error'

const fieldClass =
  'w-full rounded-xl border border-[#ebdcc9] bg-white/90 px-4 py-3 text-[#1f2327] placeholder:text-[#b5b5b5] focus:outline-none focus:ring-2 focus:ring-[#d66d28] disabled:opacity-50'

function isRecaptchaTimeoutError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /recaptcha\s*timeout/i.test(message)
}

export function ContactForm() {
  const { t } = useTranslation('translation')
  const { getRecaptchaToken } = useRecaptcha()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }

    if (Object.values(payload).some((value) => !value)) {
      setSubmitError(t('contact.form.error'))
      setFormState('error')
      return
    }

    setSubmitError('')
    setFormState('sending')

    try {
      const recaptchaToken = await getRecaptchaToken('contact_form')
      const res = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      })
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Send failed')
      setFormState('success')
    } catch (error) {
      setSubmitError(isRecaptchaTimeoutError(error) ? t('contact.form.recaptchaTimeout') : t('contact.form.error'))
      setFormState('error')
    }
  }

  const isSending = formState === 'sending'

  if (formState === 'success') {
    return <p className="topic-form mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{t('contact.form.success')}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="topic-form mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#1f2327]">
          <span className="mb-1.5 block">{t('contact.form.name')}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isSending} className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-[#1f2327]">
          <span className="mb-1.5 block">{t('contact.form.email')}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSending} className={fieldClass} />
        </label>
      </div>
      <label className="block text-sm font-semibold text-[#1f2327]">
        <span className="mb-1.5 block">{t('contact.form.subject')}</span>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isSending} className={fieldClass} />
      </label>
      <label className="block text-sm font-semibold text-[#1f2327]">
        <span className="mb-1.5 block">{t('contact.form.message')}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
          rows={5}
          className={`${fieldClass} resize-none`}
        />
      </label>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={isSending}
        className="self-start rounded-full bg-[#d66d28] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? t('contact.form.sending') : t('contact.form.send')}
      </button>
    </form>
  )
}
