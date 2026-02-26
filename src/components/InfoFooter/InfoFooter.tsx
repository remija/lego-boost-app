import { useTranslation } from 'react-i18next';
import './InfoFooter.css';

export function InfoFooter() {
  const { t } = useTranslation();
  return (
    <footer className="info-footer">
      <p className="info-footer__text">
        {t('infoFooter.text')}
      </p>
    </footer>
  );
}
