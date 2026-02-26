import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`language-switcher__button ${i18n.language === 'fr' ? 'language-switcher__button--active' : ''}`}
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
      <button
        className={`language-switcher__button ${i18n.language === 'en' ? 'language-switcher__button--active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
