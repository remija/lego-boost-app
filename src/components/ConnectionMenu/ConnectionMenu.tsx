import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLegoBoostContext } from '../../context';
import './ConnectionMenu.css';

export function ConnectionMenu() {
  const { t } = useTranslation();
  const {
    hub,
    isConnecting,
    connectionStatus,
    connect,
    disconnect
  } = useLegoBoostContext();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isConnected = connectionStatus === 'connected';

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="connection-menu" ref={menuRef}>
      <button
        className={`connection-menu__trigger ${isConnected ? 'connection-menu__trigger--connected' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`connection-menu__dot ${isConnected ? 'connection-menu__dot--connected' : isConnecting ? 'connection-menu__dot--connecting' : ''}`} />
        <span className="connection-menu__label">
          {isConnecting ? t('common.connecting') : isConnected ? t('common.connected') : t('common.disconnected')}
        </span>
        <span className="connection-menu__arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="connection-menu__dropdown">
          {isConnected ? (
            <>
              <div className="connection-menu__info">
                <div className="connection-menu__info-label">{t('connectionMenu.hubConnected')}</div>
                <div className="connection-menu__info-value">{hub?.device.name}</div>
              </div>
              <button
                className="connection-menu__button connection-menu__button--disconnect"
                onClick={handleDisconnect}
              >
                {t('connectionMenu.disconnect')}
              </button>
            </>
          ) : (
            <>
              <div className="connection-menu__info">
                <div className="connection-menu__info-label">{t('connectionMenu.noHub')}</div>
                <div className="connection-menu__info-hint">
                  {t('connectionMenu.turnOnHub')}
                </div>
              </div>
              <button
                className="connection-menu__button connection-menu__button--connect"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? t('connectionMenu.searching') : t('connectionMenu.connect')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
