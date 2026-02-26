import { useTranslation } from 'react-i18next';
import './ObstacleDetector.css';

interface ObstacleDetectorProps {
  distance: number | null;
}

export function ObstacleDetector({ distance }: ObstacleDetectorProps) {
  const { t } = useTranslation();

  const getStatusClass = () => {
    if (distance === null) return '';
    if (distance <= 3) return 'obstacle-detector--danger';
    if (distance <= 6) return 'obstacle-detector--warning';
    return 'obstacle-detector--safe';
  };

  const getStatusKey = () => {
    if (distance === null) return 'obstacleDetector.inactive';
    if (distance <= 3) return 'obstacleDetector.danger';
    if (distance <= 6) return 'obstacleDetector.warning';
    return 'obstacleDetector.safe';
  };

  return (
    <div className={`obstacle-detector ${getStatusClass()}`}>
      <div className="obstacle-detector__radar">
        <div className="obstacle-detector__rings">
          <div className="obstacle-detector__ring obstacle-detector__ring--1" />
          <div className="obstacle-detector__ring obstacle-detector__ring--2" />
          <div className="obstacle-detector__ring obstacle-detector__ring--3" />
        </div>
        {distance !== null && (
          <div
            className="obstacle-detector__blip"
            style={{
              // Position du blip : 0% = obstacle proche, 90% = loin
              // Le capteur renvoie ~0-10 pour les objets proches
              bottom: `${Math.min(90, distance * 9)}%`
            }}
          />
        )}
      </div>
      <div className="obstacle-detector__info">
        <div className="obstacle-detector__value">
          {distance !== null ? distance : '--'}
        </div>
        <div className="obstacle-detector__status">
          {t(getStatusKey())}
        </div>
      </div>
    </div>
  );
}
