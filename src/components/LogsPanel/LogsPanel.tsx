import { useTranslation } from 'react-i18next';
import type { LogEntry } from '../../types';
import './LogsPanel.css';

interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function LogsPanel({ logs, onClear }: LogsPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="logs-panel brick">
      <div className="logs-panel__header">
        <h3 className="logs-panel__title">{t('logsPanel.title')}</h3>
        {logs.length > 0 && (
          <button onClick={onClear} className="logs-panel__clear-button">
            {t('logsPanel.clear')}
          </button>
        )}
      </div>

      <div className="logs-panel__content">
        {logs.length === 0 ? (
          <div className="logs-panel__empty">
            {t('logsPanel.empty')}
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`logs-panel__entry logs-panel__entry--${log.type}`}
            >
              <span className="logs-panel__timestamp">{log.timestamp}</span>
              <span className="logs-panel__message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
