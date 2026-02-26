import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTOR_PORT } from '../../hooks/useLegoBoost';
import type { MotorPort, SensorData } from '../../hooks/useLegoBoost';
import './DistanceSensor.css';

interface DistanceSensorProps {
  sensorData: SensorData;
  onSubscribe: (port: MotorPort) => void;
  onUnsubscribe: (port: MotorPort) => void;
  disabled: boolean;
}

export function DistanceSensor({
  sensorData,
  onSubscribe,
  onUnsubscribe,
  disabled
}: DistanceSensorProps) {
  const { t } = useTranslation();
  const [selectedPort, setSelectedPort] = useState<MotorPort>(MOTOR_PORT.C);
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (isActive) {
      onUnsubscribe(selectedPort);
      setIsActive(false);
    } else {
      onSubscribe(selectedPort);
      setIsActive(true);
    }
  };

  const handlePortChange = (port: MotorPort) => {
    if (isActive) {
      onUnsubscribe(selectedPort);
      setIsActive(false);
    }
    setSelectedPort(port);
  };

  const getDistanceBarWidth = () => {
    if (sensorData.distance === null) return 0;
    // Distance va de 0 à 10, on le convertit en pourcentage
    return Math.min(100, (sensorData.distance / 10) * 100);
  };

  return (
    <div className={`distance-sensor brick ${disabled ? 'distance-sensor--disabled' : ''}`}>
      <h2 className="distance-sensor__title">{t('distanceSensor.title')}</h2>

      <div className="distance-sensor__port-select">
        <span className="distance-sensor__port-label">{t('common.port')} :</span>
        <button
          className={`distance-sensor__port-button ${selectedPort === MOTOR_PORT.C ? 'distance-sensor__port-button--active' : ''}`}
          onClick={() => handlePortChange(MOTOR_PORT.C)}
          disabled={disabled}
        >
          C
        </button>
        <button
          className={`distance-sensor__port-button ${selectedPort === MOTOR_PORT.D ? 'distance-sensor__port-button--active' : ''}`}
          onClick={() => handlePortChange(MOTOR_PORT.D)}
          disabled={disabled}
        >
          D
        </button>
      </div>

      <div className="distance-sensor__display">
        <div className="distance-sensor__value">
          {sensorData.distance !== null ? (
            <>
              <span className="distance-sensor__number">{sensorData.distance}</span>
              <span className="distance-sensor__unit">/ 10</span>
            </>
          ) : (
            <span className="distance-sensor__placeholder">--</span>
          )}
        </div>
        <div className="distance-sensor__bar-container">
          <div
            className="distance-sensor__bar"
            style={{ width: `${getDistanceBarWidth()}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`distance-sensor__toggle ${isActive ? 'distance-sensor__toggle--active' : ''}`}
        disabled={disabled}
      >
        {isActive ? t('common.deactivate') : t('common.activate')}
      </button>

      <p className="distance-sensor__hint">
        {t('distanceSensor.hint')}
      </p>
    </div>
  );
}
