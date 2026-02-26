import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './MotorControls.css';

interface MotorControlsProps {
  onDrive: (speed: number) => void;
  onTurn: (speed: number) => void;
  onStop: () => void;
  disabled: boolean;
}

export function MotorControls({ onDrive, onTurn, onStop, disabled }: MotorControlsProps) {
  const { t } = useTranslation();
  const [speed, setSpeed] = useState(50);

  const handleDriveForward = () => onDrive(speed);
  const handleDriveBackward = () => onDrive(-speed);
  const handleTurnLeft = () => onTurn(-speed);
  const handleTurnRight = () => onTurn(speed);

  return (
    <div className={`motor-controls brick ${disabled ? 'motor-controls--disabled' : ''}`}>
      <h2 className="motor-controls__title">{t('motorControls.title')}</h2>

      <div className="motor-controls__speed">
        <label className="motor-controls__speed-label">
          {t('common.speed', { value: speed })}
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="motor-controls__speed-slider"
          disabled={disabled}
        />
      </div>

      <div className="motor-controls__pad">
        <div className="motor-controls__row">
          <button
            className="motor-controls__button motor-controls__button--forward"
            onMouseDown={handleDriveForward}
            onMouseUp={onStop}
            onMouseLeave={onStop}
            onTouchStart={handleDriveForward}
            onTouchEnd={onStop}
            disabled={disabled}
          >
            ▲
          </button>
        </div>
        <div className="motor-controls__row motor-controls__row--middle">
          <button
            className="motor-controls__button motor-controls__button--left"
            onMouseDown={handleTurnLeft}
            onMouseUp={onStop}
            onMouseLeave={onStop}
            onTouchStart={handleTurnLeft}
            onTouchEnd={onStop}
            disabled={disabled}
          >
            ◀
          </button>
          <button
            className="motor-controls__button motor-controls__button--stop"
            onClick={onStop}
            disabled={disabled}
          >
            ■
          </button>
          <button
            className="motor-controls__button motor-controls__button--right"
            onMouseDown={handleTurnRight}
            onMouseUp={onStop}
            onMouseLeave={onStop}
            onTouchStart={handleTurnRight}
            onTouchEnd={onStop}
            disabled={disabled}
          >
            ▶
          </button>
        </div>
        <div className="motor-controls__row">
          <button
            className="motor-controls__button motor-controls__button--backward"
            onMouseDown={handleDriveBackward}
            onMouseUp={onStop}
            onMouseLeave={onStop}
            onTouchStart={handleDriveBackward}
            onTouchEnd={onStop}
            disabled={disabled}
          >
            ▼
          </button>
        </div>
      </div>

      <p className="motor-controls__hint">
        {t('motorControls.hint')}
      </p>
    </div>
  );
}
