import { useTranslation } from 'react-i18next';
import type { TiltData } from '../../hooks/useLegoBoost';
import './TiltSensor.css';

interface TiltSensorProps {
  tiltData: TiltData | null;
  isActive: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  disabled: boolean;
}

export function TiltSensor({
  tiltData,
  isActive,
  onSubscribe,
  onUnsubscribe,
  disabled
}: TiltSensorProps) {
  const { t } = useTranslation();

  const handleToggle = () => {
    if (isActive) {
      onUnsubscribe();
    } else {
      onSubscribe();
    }
  };

  // Calcule la position du point indicateur (pitch = Y, roll = X)
  const getIndicatorStyle = () => {
    if (!tiltData) return { left: '50%', top: '50%' };
    // Convertit -45/45 en 0%/100%
    const x = ((tiltData.roll + 45) / 90) * 100;
    const y = ((tiltData.pitch + 45) / 90) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className={`tilt-sensor brick ${disabled ? 'tilt-sensor--disabled' : ''}`}>
      <h2 className="tilt-sensor__title">{t('tiltSensor.title')}</h2>

      <div className="tilt-sensor__display">
        <div className="tilt-sensor__visualizer">
          <div className="tilt-sensor__grid">
            <div className="tilt-sensor__axis tilt-sensor__axis--horizontal" />
            <div className="tilt-sensor__axis tilt-sensor__axis--vertical" />
          </div>
          <div
            className={`tilt-sensor__indicator ${tiltData ? 'tilt-sensor__indicator--active' : ''}`}
            style={getIndicatorStyle()}
          />
          <div className="tilt-sensor__labels">
            <span className="tilt-sensor__label tilt-sensor__label--top">{t('tiltSensor.front')}</span>
            <span className="tilt-sensor__label tilt-sensor__label--bottom">{t('tiltSensor.back')}</span>
            <span className="tilt-sensor__label tilt-sensor__label--left">{t('tiltSensor.left')}</span>
            <span className="tilt-sensor__label tilt-sensor__label--right">{t('tiltSensor.right')}</span>
          </div>
        </div>

        <div className="tilt-sensor__values">
          <div className="tilt-sensor__value">
            <span className="tilt-sensor__value-label">Pitch</span>
            <span className="tilt-sensor__value-number">
              {tiltData ? `${tiltData.pitch}°` : '--'}
            </span>
          </div>
          <div className="tilt-sensor__value">
            <span className="tilt-sensor__value-label">Roll</span>
            <span className="tilt-sensor__value-number">
              {tiltData ? `${tiltData.roll}°` : '--'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`tilt-sensor__toggle ${isActive ? 'tilt-sensor__toggle--active' : ''}`}
        disabled={disabled}
      >
        {isActive ? t('common.deactivate') : t('common.activate')}
      </button>

      <p className="tilt-sensor__hint">
        {t('tiltSensor.hint')}
      </p>
    </div>
  );
}
