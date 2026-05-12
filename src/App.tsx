import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { useWakeup } from './hooks/useWakeup'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  useWakeup()

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

