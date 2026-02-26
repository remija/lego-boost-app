import { useTranslation } from 'react-i18next';
import type { LedColor } from '../../hooks/useLegoBoost';
import { LED_COLORS } from '../../constants';
import './R2D2LedEffects.css';

interface R2D2LedEffectsProps {
  onColorChange: (color: LedColor) => void;
  disabled: boolean;
}

export function R2D2LedEffects({ onColorChange, disabled }: R2D2LedEffectsProps) {
  const { t } = useTranslation();
  return (
    <div className={`r2d2-led ${disabled ? 'r2d2-led--disabled' : ''}`}>
      <h3 className="r2d2-led__title">{t('r2d2LedEffects.title')}</h3>
      <div className="r2d2-led__effects">
        {LED_COLORS.map((color) => (
          <button
            key={color.value}
            className="r2d2-led__button"
            style={{ '--effect-color': color.cssColor } as React.CSSProperties}
            onClick={() => onColorChange(color.value)}
            disabled={disabled}
          >
            <span
              className="r2d2-led__indicator"
              style={{ backgroundColor: color.cssColor }}
            />
            <span className="r2d2-led__name">{t(color.key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
