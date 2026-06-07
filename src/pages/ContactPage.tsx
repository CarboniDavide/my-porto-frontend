import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecaptcha } from '../contexts/RecaptchaContext'
import { usePageSeo } from '../hooks/usePageSeo'
import { ChevronDown } from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'
import { RecaptchaNotice } from '../components/RecapchaNotice'

const EMAIL = 'studio.ing.dci@gmail.com'
const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''
const contactEndpoint = `${baseUrl}/api/contact`

type FormState = 'idle' | 'sending' | 'success' | 'error'

function isRecaptchaTimeoutError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /recaptcha\s*timeout/i.test(message)
}

function GithubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  )
}

export function ContactPage() {
  usePageSeo('contact')
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

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
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
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          recaptchaToken,
        }),
      })

      const data = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) {
        throw new Error(data?.error || 'Send failed')
      }

      setFormState('success')
    } catch (error) {
      if (isRecaptchaTimeoutError(error)) {
        setSubmitError(t('contact.form.recaptchaTimeout'))
      } else {
        setSubmitError(t('contact.form.error'))
      }
      setFormState('error')
    }
  }

  const isSending = formState === 'sending'

  return (
    <ObserverSlidePage>

        {/* Hero section */}
        <section className="relative box-border flex items-center justify-center bg-[#fffaf4] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
          <div className="w-full max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#d66d28]/10 px-4 py-2 text-xs font-bold text-[#d66d28] mb-6">
                <span className="size-2 rounded-full bg-[#d66d28] animate-pulse" />
                {t('contact.availability')}
              </span>
              <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">
                {t('contact.title')}
              </h1>
              <p className="text-lg leading-relaxed text-[#50575d] sm:text-xl">{t('contact.text')}</p>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#d66d28] hidden md:block" aria-hidden="true">
            <ChevronDown className="size-8" />
          </div>
        </section>

        {/* Form + Contact info — single slide, 60/40 split */}
        <section className="box-border flex items-center justify-center border-t border-[#ebdcc9] bg-white px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
          <div className="w-full max-w-6xl flex flex-col gap-12 lg:flex-row lg:gap-0">

            {/* Contact info — 30% */}
            <div className="flex flex-col gap-8 lg:w-[30%] lg:pt-20 lg:pr-16 order-2 lg:order-1 mb-8 lg:mb-0">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#7d7f80] mb-4">Email</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-xl font-semibold text-[#d66d28] hover:underline break-all"
                >
                  {EMAIL}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#7d7f80] mb-4">
                  {t('contact.socials')}
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://github.com/CarboniDavide/my-porto-frontend"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-[#ebdcc9] bg-[#fdf4e8] px-5 py-3 font-semibold text-[#1f2327] transition hover:-translate-y-0.5 hover:border-[#d66d28]"
                  >
                    <GithubIcon />
                    {t('footer.github')}
                  </a>
                  <a
                    href="https://www.linkedin.com/in/davide-carboni-dc"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-[#ebdcc9] bg-[#fdf4e8] px-5 py-3 font-semibold text-[#1f2327] transition hover:-translate-y-0.5 hover:border-[#d66d28]"
                  >
                    <LinkedInIcon />
                    {t('footer.linkedin')}
                  </a>
                </div>
              </div>
            </div>

            {/* Form — 70% */}
            <div className="order-1 lg:order-2 lg:w-[70%] lg:pl-16 lg:border-l lg:border-[#ebdcc9]">
              <h2 className="mb-8 font-serif text-3xl font-bold text-[#1f2327] sm:text-4xl">Send a message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1f2327] mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSending}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#ebdcc9] bg-white px-4 py-3 text-[#1f2327] placeholder:text-[#c5c5c5] focus:outline-none focus:ring-2 focus:ring-[#d66d28] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1f2327] mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSending}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-[#ebdcc9] bg-white px-4 py-3 text-[#1f2327] placeholder:text-[#c5c5c5] focus:outline-none focus:ring-2 focus:ring-[#d66d28] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#1f2327] mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSending}
                    placeholder="Project subject"
                    className="w-full rounded-xl border border-[#ebdcc9] bg-white px-4 py-3 text-[#1f2327] placeholder:text-[#c5c5c5] focus:outline-none focus:ring-2 focus:ring-[#d66d28] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1f2327] mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                    placeholder="Tell me about your project..."
                    rows={6}
                    className="w-full rounded-xl border border-[#ebdcc9] bg-white px-4 py-3 text-[#1f2327] placeholder:text-[#c5c5c5] focus:outline-none focus:ring-2 focus:ring-[#d66d28] disabled:opacity-50 resize-none"
                  />
                </div>

                {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
                {formState === 'success' && <p className="text-green-600 text-sm">{t('contact.form.success')}</p>}

                <button
                  type="submit"
                  disabled={isSending}
                  className="rounded-full bg-[#d66d28] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? t('contact.form.sending') : t('contact.form.send')}
                </button>

                <RecaptchaNotice className="text-xs leading-relaxed text-[#7d7f80] text-center"/>
              </form>
            </div>

          </div>
        </section>

    </ObserverSlidePage>
  )
}
