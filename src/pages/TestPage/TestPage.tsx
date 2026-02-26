import { useTranslation } from 'react-i18next';
import { MotorControls, ExternalMotors, LedControl, DistanceSensor, TiltSensor, LogsPanel } from '../../components';
import { useLegoBoostContext } from '../../context';
import { MOTOR_PORT } from '../../hooks/useLegoBoost';
import './TestPage.css';

export function TestPage() {
  const { t } = useTranslation();
  const {
    connectionStatus,
    logs,
    clearLogs,
    drive,
    turn,
    stopAllMotors,
    setMotorSpeed,
    stopMotor,
    setLedColor,
    sensorData,
    subscribeSensor,
    unsubscribeSensor,
    tiltData,
    isTiltActive,
    subscribeTilt,
    unsubscribeTilt
  } = useLegoBoostContext();

  const isConnected = connectionStatus === 'connected';

  return (
    <div className="test-page">
      <h1 className="test-page__title">{t('testPage.title')}</h1>
      <p className="test-page__subtitle">{t('testPage.subtitle')}</p>

      <MotorControls
        onDrive={drive}
        onTurn={turn}
        onStop={stopAllMotors}
        disabled={!isConnected}
      />
      <ExternalMotors
        onMotorChange={setMotorSpeed}
        onMotorStop={stopMotor}
        portC={MOTOR_PORT.C}
        portD={MOTOR_PORT.D}
        disabled={!isConnected}
      />
      <LedControl
        onColorChange={setLedColor}
        disabled={!isConnected}
      />
      <DistanceSensor
        sensorData={sensorData}
        onSubscribe={subscribeSensor}
        onUnsubscribe={unsubscribeSensor}
        disabled={!isConnected}
      />
      <TiltSensor
        tiltData={tiltData}
        isActive={isTiltActive}
        onSubscribe={subscribeTilt}
        onUnsubscribe={unsubscribeTilt}
        disabled={!isConnected}
      />
      <LogsPanel logs={logs} onClear={clearLogs} />
    </div>
  );
}
