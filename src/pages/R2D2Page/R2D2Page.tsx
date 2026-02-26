import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Joystick, HeadControl, ObstacleDetector, R2D2LedEffects } from '../../components/R2D2';
import { useLegoBoostContext } from '../../context';
import { MOTOR_PORT } from '../../hooks/useLegoBoost';
import './R2D2Page.css';

export function R2D2Page() {
  const { t } = useTranslation();
  const {
    connectionStatus,
    setMotorsSpeed,
    stopAllMotors,
    setMotorSpeed,
    stopMotor,
    setLedColor,
    sensorData,
    subscribeSensor,
    unsubscribeSensor
  } = useLegoBoostContext();

  const isConnected = connectionStatus === 'connected';

  // Active automatiquement le capteur de distance à la connexion
  useEffect(() => {
    if (isConnected) {
      subscribeSensor(MOTOR_PORT.C); // Capteur sur port C pour R2D2
    }
    return () => {
      if (isConnected) {
        unsubscribeSensor(MOTOR_PORT.C);
      }
    };
  }, [isConnected, subscribeSensor, unsubscribeSensor]);

  const handleJoystickMove = (x: number, y: number) => {
    // Convertir le joystick en vitesse des moteurs (tank drive)
    // y = avancer/reculer, x = tourner
    const left = Math.max(-100, Math.min(100, y + x));
    const right = Math.max(-100, Math.min(100, y - x));
    setMotorsSpeed(left, right);
  };

  const handleHeadRotate = (speed: number) => {
    setMotorSpeed(MOTOR_PORT.D, speed); // Moteur tête sur port D
  };

  const handleHeadStop = () => {
    stopMotor(MOTOR_PORT.D);
  };

  return (
    <div className="r2d2-page">
      <div className="r2d2-page__header">
        <div className="r2d2-page__logo">R2-D2</div>
        <div className="r2d2-page__status">
          <span className={`r2d2-page__status-dot ${isConnected ? 'r2d2-page__status-dot--connected' : ''}`} />
          {isConnected ? t('common.connected') : t('common.disconnected')}
        </div>
      </div>

      {!isConnected ? (
        <div className="r2d2-page__disconnected">
          <p>{t('r2d2Page.disconnected')}</p>
        </div>
      ) : (
        <div className="r2d2-page__controls">
          <div className="r2d2-page__main">
            <div className="r2d2-page__section r2d2-page__section--joystick">
              <Joystick
                onMove={handleJoystickMove}
                onRelease={stopAllMotors}
                disabled={!isConnected}
              />
            </div>

            <div className="r2d2-page__section r2d2-page__section--head">
              <HeadControl
                onRotate={handleHeadRotate}
                onStop={handleHeadStop}
                disabled={!isConnected}
              />
            </div>
          </div>

          <div className="r2d2-page__section r2d2-page__section--sensors">
            <ObstacleDetector distance={sensorData.distance} />
          </div>

          <div className="r2d2-page__section r2d2-page__section--led">
            <R2D2LedEffects
              onColorChange={setLedColor}
              disabled={!isConnected}
            />
          </div>
        </div>
      )}
    </div>
  );
}
