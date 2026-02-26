import { useTranslation } from 'react-i18next';
import './ProgramControls.css';

interface ProgramControlsProps {
  isExecuting: boolean;
  isConnected: boolean;
  hasBlocks: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onClear: () => void;
}

export function ProgramControls({
  isExecuting,
  isConnected,
  hasBlocks,
  onPlay,
  onStop,
  onSave,
  onClear,
}: ProgramControlsProps) {
  const { t } = useTranslation();

  const canPlay = isConnected && hasBlocks && !isExecuting;

  return (
    <div className="program-controls">
      {isExecuting ? (
        <button
          className="program-controls__button program-controls__button--stop"
          onClick={onStop}
        >
          <span className="program-controls__icon">⏹️</span>
          <span className="program-controls__label">{t('codeLab.stop')}</span>
        </button>
      ) : (
        <button
          className={`program-controls__button program-controls__button--play ${!canPlay ? 'program-controls__button--disabled' : ''}`}
          onClick={onPlay}
          disabled={!canPlay}
          title={!isConnected ? t('codeLab.connectFirst') : undefined}
        >
          <span className="program-controls__icon">▶️</span>
          <span className="program-controls__label">{t('codeLab.play')}</span>
        </button>
      )}

      <button
        className="program-controls__button program-controls__button--secondary"
        onClick={onSave}
      >
        <span className="program-controls__icon">💾</span>
        <span className="program-controls__label">{t('codeLab.save')}</span>
      </button>

      <button
        className={`program-controls__button program-controls__button--secondary ${!hasBlocks ? 'program-controls__button--disabled' : ''}`}
        onClick={onClear}
        disabled={!hasBlocks || isExecuting}
      >
        <span className="program-controls__icon">🗑️</span>
        <span className="program-controls__label">{t('codeLab.clear')}</span>
      </button>
    </div>
  );
}
