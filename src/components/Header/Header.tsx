import { useTranslation } from 'react-i18next';
import './Header.css';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="header">
      <h1 className="header__title">{t('header.title')}</h1>
      <p className="header__subtitle">{t('header.subtitle')}</p>
    </header>
  );
}
