import { useTranslation } from 'react-i18next';
import { LED_COLOR } from '../../hooks/useLegoBoost';
import type { LedColor } from '../../hooks/useLegoBoost';
import { LED_COLORS } from '../../constants';
import './LedControl.css';

interface LedControlProps {
  onColorChange: (color: LedColor) => void;
  disabled: boolean;
}

export function LedControl({ onColorChange, disabled }: LedControlProps) {
  const { t } = useTranslation();
  return (
    <div className={`led-control brick ${disabled ? 'led-control--disabled' : ''}`}>
      <h2 className="led-control__title">{t('ledControl.title')}</h2>

      <div className="led-control__colors">
        {LED_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className="led-control__color-button"
            style={{ backgroundColor: color.cssColor }}
            disabled={disabled}
            title={t(color.key)}
          >
            {color.value === LED_COLOR.OFF && '✕'}
          </button>
        ))}
      </div>
    </div>
  );
}
