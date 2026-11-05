import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocalizedLayout } from '../components/AppLayout'
import { useLanguage } from '../contexts/LanguageContext'
import { ChatPage } from '../pages/ChatPage'
import { LegalPage } from '../pages/LegalPage'
import NotFoundPage from '../pages/NotFoundPage'

function RedirectToCurrentLanguage() {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  const path = pathname === '/' ? '' : pathname

  return <Navigate to={`/${language}${path}`} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirectToCurrentLanguage />} />
      <Route path="/:lang" element={<LocalizedLayout />}>
        <Route index element={<ChatPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="recruit-me" element={<Navigate to=".." replace relative="path" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
