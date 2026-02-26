import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MotorPort } from '../../hooks/useLegoBoost';
import './ExternalMotors.css';

interface ExternalMotorsProps {
  onMotorChange: (port: MotorPort, speed: number) => void;
  onMotorStop: (port: MotorPort) => void;
  portC: MotorPort;
  portD: MotorPort;
  disabled: boolean;
}

export function ExternalMotors({
  onMotorChange,
  onMotorStop,
  portC,
  portD,
  disabled
}: ExternalMotorsProps) {
  const { t } = useTranslation();
  const [speedC, setSpeedC] = useState(0);
  const [speedD, setSpeedD] = useState(0);

  const handleSpeedChangeC = (value: number) => {
    setSpeedC(value);
    onMotorChange(portC, value);
  };

  const handleSpeedChangeD = (value: number) => {
    setSpeedD(value);
    onMotorChange(portD, value);
  };

  const handleStopC = () => {
    setSpeedC(0);
    onMotorStop(portC);
  };

  const handleStopD = () => {
    setSpeedD(0);
    onMotorStop(portD);
  };

  return (
    <div className={`external-motors brick ${disabled ? 'external-motors--disabled' : ''}`}>
      <h2 className="external-motors__title">{t('externalMotors.title')}</h2>

      <div className="external-motors__controls">
        {/* Motor C */}
        <div className="external-motors__motor">
          <div className="external-motors__motor-header">
            <span className="external-motors__motor-label">{t('common.port')} C</span>
            <span className="external-motors__motor-value">{speedC}%</span>
          </div>
          <div className="external-motors__motor-control">
            <input
              type="range"
              min="-100"
              max="100"
              value={speedC}
              onChange={(e) => handleSpeedChangeC(Number(e.target.value))}
              className="external-motors__slider"
              disabled={disabled}
            />
            <button
              onClick={handleStopC}
              className="external-motors__stop-button"
              disabled={disabled}
            >
              {t('common.stop')}
            </button>
          </div>
        </div>

        {/* Motor D */}
        <div className="external-motors__motor">
          <div className="external-motors__motor-header">
            <span className="external-motors__motor-label">{t('common.port')} D</span>
            <span className="external-motors__motor-value">{speedD}%</span>
          </div>
          <div className="external-motors__motor-control">
            <input
              type="range"
              min="-100"
              max="100"
              value={speedD}
              onChange={(e) => handleSpeedChangeD(Number(e.target.value))}
              className="external-motors__slider"
              disabled={disabled}
            />
            <button
              onClick={handleStopD}
              className="external-motors__stop-button"
              disabled={disabled}
            >
              {t('common.stop')}
            </button>
          </div>
        </div>
      </div>

      <p className="external-motors__hint">
        {t('externalMotors.hint')}
      </p>
    </div>
  );
}
