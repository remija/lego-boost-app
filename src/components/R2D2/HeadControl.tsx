import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './HeadControl.css';

interface HeadControlProps {
  onRotate: (speed: number) => void;
  onStop: () => void;
  disabled: boolean;
}

export function HeadControl({ onRotate, onStop, disabled }: HeadControlProps) {
  const { t } = useTranslation();
  const isActiveRef = useRef(false);

  const handleStart = useCallback((speed: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled || isActiveRef.current) return;
    isActiveRef.current = true;
    onRotate(speed);
  }, [disabled, onRotate]);

  const handleEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    onStop();
  }, [onStop]);

  return (
    <div className={`head-control ${disabled ? 'head-control--disabled' : ''}`}>
      <h3 className="head-control__title">{t('headControl.title')}</h3>
      <div className="head-control__buttons">
        <button
          className="head-control__button head-control__button--left"
          onMouseDown={handleStart(-70)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart(-70)}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          disabled={disabled}
        >
          ↶
        </button>
        <div className="head-control__icon">◉</div>
        <button
          className="head-control__button head-control__button--right"
          onMouseDown={handleStart(70)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart(70)}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          disabled={disabled}
        >
          ↷
        </button>
      </div>
    </div>
  );
}
