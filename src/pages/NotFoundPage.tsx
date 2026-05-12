import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404</h1>
      <h2>{t('notFound.title', 'Page not found')}</h2>
      <p>{t('notFound.description', 'The page you are looking for does not exist or has been moved.')}</p>
    </div>
  );
};

export default NotFoundPage;
