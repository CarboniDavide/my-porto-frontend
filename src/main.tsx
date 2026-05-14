
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import './i18n/index'
import App from './App.tsx'
import { RecaptchaProvider } from './contexts/RecaptchaContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''}>
      <RecaptchaProvider>
        <App />
      </RecaptchaProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>,
)
