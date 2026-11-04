import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'

interface RecaptchaNoticeProps {
  className?: string;
}

export function RecaptchaNotice({ className }: RecaptchaNoticeProps) {
  const { t } = useTranslation('translation')
  const { language } = useLanguage()

  return (
    <p className={`text-center text-[10px] leading-relaxed sm:text-[11px] ${className || ''}`}>
      {t('footer.formNotice')}{' '}
      <Link to={`/${language}/legal?doc=privacy`} className="underline">
        {t('footer.formNoticeLink')}
      </Link>
      .
    </p>
  );
}