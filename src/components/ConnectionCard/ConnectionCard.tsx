import { useTranslation } from 'react-i18next';
import type { ConnectionStatus, LegoHub } from '../../types';
import './ConnectionCard.css';

interface ConnectionCardProps {
  connectionStatus: ConnectionStatus;
  hub: LegoHub | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectionCard({
  connectionStatus,
  hub,
  isConnecting,
  onConnect,
  onDisconnect
}: ConnectionCardProps) {
  const { t } = useTranslation();

  const getStatusLabel = () => {
    switch (connectionStatus) {
      case 'connected': return t('common.connected');
      case 'connecting': return t('common.connecting');
      case 'disconnected': return t('common.disconnected');
    }
  };

  const getButtonLabel = () => {
    if (isConnecting) return t('connectionCard.connectingButton');
    if (connectionStatus === 'connected') return t('connectionCard.connectedButton');
    return t('connectionCard.connectButton');
  };

  return (
    <div className="connection-card brick">
      <div className="connection-card__header">
        <div>
          <h2 className="connection-card__title">{t('connectionCard.title')}</h2>
          <div className="connection-card__status">
            <div
              className={`connection-card__indicator connection-card__indicator--${connectionStatus}`}
            />
            <span className="connection-card__status-text">
              {getStatusLabel()}
            </span>
          </div>
        </div>

        {connectionStatus === 'connected' && hub && (
          <div className="connection-card__hub-info">
            <div className="connection-card__hub-label">{t('connectionCard.hubConnected')}</div>
            <div className="connection-card__hub-name">{hub.device.name}</div>
          </div>
        )}
      </div>

      <div className="connection-card__actions">
        <button
          onClick={onConnect}
          disabled={isConnecting || connectionStatus === 'connected'}
          className={`connection-card__button connection-card__button--connect ${
            connectionStatus === 'connected' ? 'connection-card__button--disabled' : ''
          }`}
        >
          {getButtonLabel()}
        </button>

        {connectionStatus === 'connected' && (
          <button
            onClick={onDisconnect}
            className="connection-card__button connection-card__button--disconnect"
          >
            {t('connectionCard.disconnectButton')}
          </button>
        )}
      </div>
    </div>
  );
}
