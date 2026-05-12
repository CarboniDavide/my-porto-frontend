import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const RETRY_DELAY_MS = 400

type RecaptchaContextValue = {
  getRecaptchaToken: (action: string) => Promise<string>
}

const RecaptchaContext = createContext<RecaptchaContextValue | null>(null)

function isRecaptchaTimeoutError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /recaptcha\s*timeout/i.test(message)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getRecaptchaToken = useCallback(
    async (action: string): Promise<string> => {
      if (!executeRecaptcha) {
        throw new Error('reCAPTCHA is not ready')
      }

      try {
        return await executeRecaptcha(action)
      } catch (firstError) {
        if (!isRecaptchaTimeoutError(firstError)) {
          throw firstError
        }

        await delay(RETRY_DELAY_MS)
        return executeRecaptcha(action)
      }
    },
    [executeRecaptcha],
  )

  return (
    <RecaptchaContext.Provider value={{ getRecaptchaToken }}>
      {children}
    </RecaptchaContext.Provider>
  )
}

export function useRecaptcha() {
  const context = useContext(RecaptchaContext)
  if (!context) {
    throw new Error('useRecaptcha must be used within RecaptchaProvider')
  }
  return context
}
