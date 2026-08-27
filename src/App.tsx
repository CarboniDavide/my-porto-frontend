import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { useBrowserVisit } from './hooks/useBrowserVisit'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  useBrowserVisit()

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

