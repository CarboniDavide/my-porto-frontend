declare module 'react-google-recaptcha-v3' {
  import type { ReactNode } from 'react'

  export interface GoogleReCaptchaProviderProps {
    reCaptchaKey: string
    children: ReactNode
    scriptProps?: {
      async?: boolean
      defer?: boolean
      appendTo?: 'head' | 'body'
      nonce?: string
    }
    container?: {
      element?: string | HTMLElement
      parameters?: {
        badge?: 'bottomright' | 'bottomleft' | 'inline'
        theme?: 'dark' | 'light'
      }
    }
    language?: string
    useEnterprise?: boolean
    useRecaptchaNet?: boolean
  }

  export function GoogleReCaptchaProvider(props: GoogleReCaptchaProviderProps): JSX.Element

  export function useGoogleReCaptcha(): {
    executeRecaptcha?: (action?: string) => Promise<string>
  }
}
