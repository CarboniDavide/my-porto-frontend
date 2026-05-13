
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import './i18n/index'
import App from './App.tsx'
import { RecaptchaProvider } from './contexts/RecaptchaContext.tsx'


// Handle GitHub Pages SPA redirect fallback
function handleGithubPagesRedirect() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect) {
    window.history.replaceState(null, '', redirect + window.location.hash);
  }
}

handleGithubPagesRedirect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''}>
      <RecaptchaProvider>
        <App />
      </RecaptchaProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>,
)
