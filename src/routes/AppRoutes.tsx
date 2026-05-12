import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocalizedLayout } from '../components/AppLayout'
import { useLanguage } from '../contexts/LanguageContext'
import { ChatPage } from '../pages/ChatPage'
import { ContactPage } from '../pages/ContactPage'
import { OverviewPage } from '../pages/OverviewPage'
import { PortfolioPage } from '../pages/PortfolioPage'
import { RecruitMePage } from '../pages/RecruitMePage'
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
        <Route path="showcase" element={<OverviewPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="recruit-me" element={<RecruitMePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
