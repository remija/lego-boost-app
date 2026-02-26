import { useState, useCallback, useRef, useEffect } from 'react';
import type { ConnectionStatus, LogEntry, LogType, LegoHub } from '../types';

const LEGO_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
const LEGO_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

// LEGO Wireless Protocol 3.0 - Hub Properties
const HUB_PROPERTY_MSG_TYPE = 0x01;
const PROPERTY_BUTTON = 0x02;
const PROPERTY_BATTERY = 0x06;
const OPERATION_ENABLE_UPDATES = 0x02;

// Motor ports
export const MOTOR_PORT = {
  A: 0x00,
  B: 0x01,
  AB: 0x39, // Combined motors for synchronized movement
  C: 0x02,
  D: 0x03,
} as const;

export type MotorPort = typeof MOTOR_PORT[keyof typeof MOTOR_PORT];

// Port Output Command
const PORT_OUTPUT_MSG_TYPE = 0x81;
const STARTUP_IMMEDIATE = 0x11;
const CMD_START_SPEED = 0x07;

// LED Control
const LED_PORT = 0x32;
const CMD_WRITE_DIRECT_MODE = 0x51;
const LED_COLOR_MODE = 0x00;

export const LED_COLOR = {
  OFF: 0,
  PINK: 1,
  PURPLE: 2,
  BLUE: 3,
  LIGHT_BLUE: 4,
  CYAN: 5,
  GREEN: 6,
  YELLOW: 7,
  ORANGE: 8,
  RED: 9,
  WHITE: 10,
} as const;

export type LedColor = typeof LED_COLOR[keyof typeof LED_COLOR];

// Sensor constants
const PORT_INPUT_FORMAT_SETUP = 0x41;
const PORT_VALUE_SINGLE = 0x45;
const SENSOR_MODE_DISTANCE = 0x00;

// Tilt sensor (built-in accelerometer)
const TILT_SENSOR_PORT = 0x3A;
const TILT_MODE_ANGLE = 0x00; // Returns pitch and roll

export interface TiltData {
  pitch: number; // -45 to 45 degrees (forward/backward)
  roll: number;  // -45 to 45 degrees (left/right)
}

export const SENSOR_COLOR = {
  NONE: -1,
  BLACK: 0,
  PINK: 1,
  PURPLE: 2,
  BLUE: 3,
  LIGHT_BLUE: 4,
  CYAN: 5,
  GREEN: 6,
  YELLOW: 7,
  ORANGE: 8,
  RED: 9,
  WHITE: 10,
} as const;

export type SensorColor = typeof SENSOR_COLOR[keyof typeof SENSOR_COLOR];

export interface SensorData {
  distance: number | null; // Distance in approximate cm (0-10)
  color: SensorColor | null;
}

export function useLegoBoost() {
  const [hub, setHub] = useState<LegoHub | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>({ distance: null, color: null });
  const [tiltData, setTiltData] = useState<TiltData | null>(null);
  const [isTiltActive, setIsTiltActive] = useState(false);
  const activeSensorPortRef = useRef<number | null>(null);

  const keepaliveIntervalRef = useRef<number | null>(null);

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const stopKeepalive = useCallback(() => {
    if (keepaliveIntervalRef.current !== null) {
      clearInterval(keepaliveIntervalRef.current);
      keepaliveIntervalRef.current = null;
    }
  }, []);

  const handleNotification = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (value) {
      const data = new Uint8Array(value.buffer);
      const msgType = data[2];

      // Parse sensor data
      if (msgType === PORT_VALUE_SINGLE) {
        const port = data[3];

        // Distance sensor
        if (port === activeSensorPortRef.current) {
          const sensorValue = data[4];
          setSensorData(prev => ({
            ...prev,
            distance: sensorValue === 255 ? null : sensorValue
          }));
          return;
        }

        // Tilt sensor (built-in)
        if (port === TILT_SENSOR_PORT) {
          // Les valeurs sont des signed bytes (-45 à 45)
          const pitchRaw = data[4];
          const rollRaw = data[5];
          const pitch = pitchRaw > 127 ? pitchRaw - 256 : pitchRaw;
          const roll = rollRaw > 127 ? rollRaw - 256 : rollRaw;
          setTiltData({ pitch, roll });
          return;
        }

        return;
      }

      // Filtrer les messages de keepalive (hub properties) pour ne pas polluer les logs
      if (msgType !== HUB_PROPERTY_MSG_TYPE) {
        addLog(`Données reçues : [${Array.from(data).join(', ')}]`, 'data');
      }
    }
  }, [addLog]);

  const handleDisconnection = useCallback(() => {
    stopKeepalive();
    addLog('Hub déconnecté', 'warning');
    setConnectionStatus('disconnected');
    setHub(null);
  }, [addLog, stopKeepalive]);

  const enableHubPropertyUpdates = async (characteristic: BluetoothRemoteGATTCharacteristic) => {
    // Active les notifications pour le bouton du hub
    const enableButton = new Uint8Array([
      0x05, // Longueur
      0x00, // Hub ID
      HUB_PROPERTY_MSG_TYPE,
      PROPERTY_BUTTON,
      OPERATION_ENABLE_UPDATES
    ]);
    await characteristic.writeValue(enableButton);

    // Active les notifications pour la batterie
    const enableBattery = new Uint8Array([
      0x05,
      0x00,
      HUB_PROPERTY_MSG_TYPE,
      PROPERTY_BATTERY,
      OPERATION_ENABLE_UPDATES
    ]);
    await characteristic.writeValue(enableBattery);
  };

  const startKeepalive = useCallback((characteristic: BluetoothRemoteGATTCharacteristic) => {
    stopKeepalive();

    // Envoie une requête de lecture de batterie toutes les 30 secondes
    const OPERATION_REQUEST_UPDATE = 0x05;

    keepaliveIntervalRef.current = window.setInterval(async () => {
      try {
        const requestBattery = new Uint8Array([
          0x05,
          0x00,
          HUB_PROPERTY_MSG_TYPE,
          PROPERTY_BATTERY,
          OPERATION_REQUEST_UPDATE
        ]);
        await characteristic.writeValue(requestBattery);
      } catch {
        // Ignorer les erreurs de keepalive
      }
    }, 30000);
  }, [stopKeepalive]);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      addLog('Web Bluetooth API non disponible. Utilisez Chrome, Edge ou Opera.', 'error');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    addLog('Recherche du hub Lego Boost...', 'info');

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'LEGO Move Hub' },
          { namePrefix: 'Boost' }
        ],
        optionalServices: [LEGO_SERVICE_UUID]
      });

      addLog(`Hub trouvé : ${device.name}`, 'success');

      const server = await device.gatt!.connect();
      addLog('Connexion GATT établie', 'success');

      const service = await server.getPrimaryService(LEGO_SERVICE_UUID);
      addLog('Service Lego trouvé', 'success');

      const characteristic = await service.getCharacteristic(LEGO_CHARACTERISTIC_UUID);
      addLog('Caractéristique obtenue', 'success');

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleNotification);
      addLog('Notifications activées', 'success');

      // Active les notifications du hub pour maintenir la connexion
      await enableHubPropertyUpdates(characteristic);
      addLog('Keepalive activé', 'success');

      // Démarre le keepalive périodique
      startKeepalive(characteristic);

      setHub({ device, server, characteristic });
      setConnectionStatus('connected');
      addLog('✓ Connecté avec succès au Lego Boost !', 'success');

      device.addEventListener('gattserverdisconnected', handleDisconnection);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur de connexion : ${errorMessage}`, 'error');
      setConnectionStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  }, [addLog, handleNotification, handleDisconnection, startKeepalive]);

  const disconnect = useCallback(() => {
    stopKeepalive();
    if (hub && hub.device.gatt?.connected) {
      hub.device.gatt.disconnect();
      addLog('Déconnexion manuelle', 'info');
    }
  }, [hub, addLog, stopKeepalive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopKeepalive();
    };
  }, [stopKeepalive]);

  // Motor control functions
  const setMotorSpeed = useCallback(async (port: MotorPort, speed: number) => {
    if (!hub) return;

    // Clamp speed between -100 and 100
    const clampedSpeed = Math.max(-100, Math.min(100, speed));
    // Convert to signed byte
    const speedByte = clampedSpeed < 0 ? 256 + clampedSpeed : clampedSpeed;

    const message = new Uint8Array([
      0x08, // Length (8 bytes total - sans le profil)
      0x00, // Hub ID
      PORT_OUTPUT_MSG_TYPE,
      port,
      STARTUP_IMMEDIATE,
      CMD_START_SPEED,
      speedByte,
      0x64, // Max power (100%)
    ]);

    try {
      await hub.characteristic.writeValue(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur moteur : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  const setMotorsSpeed = useCallback(async (speedA: number, speedB: number) => {
    if (!hub) return;

    // Envoie les commandes séquentiellement (GATT ne supporte pas les écritures parallèles)
    await setMotorSpeed(MOTOR_PORT.A, speedA);
    await setMotorSpeed(MOTOR_PORT.B, speedB);
  }, [hub, setMotorSpeed]);

  const stopMotor = useCallback(async (port: MotorPort) => {
    await setMotorSpeed(port, 0);
  }, [setMotorSpeed]);

  const stopAllMotors = useCallback(async () => {
    await setMotorsSpeed(0, 0);
  }, [setMotorsSpeed]);

  // Convenience functions for driving
  const drive = useCallback(async (speed: number) => {
    await setMotorsSpeed(speed, speed);
  }, [setMotorsSpeed]);

  const turn = useCallback(async (speed: number) => {
    // Positive = turn right, Negative = turn left
    await setMotorsSpeed(speed, -speed);
  }, [setMotorsSpeed]);

  // LED control
  const setLedColor = useCallback(async (color: LedColor) => {
    if (!hub) return;

    const message = new Uint8Array([
      0x08, // Length
      0x00, // Hub ID
      PORT_OUTPUT_MSG_TYPE,
      LED_PORT,
      STARTUP_IMMEDIATE,
      CMD_WRITE_DIRECT_MODE,
      LED_COLOR_MODE,
      color
    ]);

    try {
      await hub.characteristic.writeValue(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur LED : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  // Distance sensor
  const subscribeSensor = useCallback(async (port: MotorPort) => {
    if (!hub) return;

    activeSensorPortRef.current = port;
    setSensorData({ distance: null, color: null });

    // Configure le port pour recevoir les données du capteur de distance
    const message = new Uint8Array([
      0x0A, // Length
      0x00, // Hub ID
      PORT_INPUT_FORMAT_SETUP,
      port,
      SENSOR_MODE_DISTANCE, // Mode distance
      0x01, 0x00, 0x00, 0x00, // Delta (1) - envoie une notification à chaque changement
      0x01  // Enable notifications
    ]);

    try {
      await hub.characteristic.writeValue(message);
      addLog(`Capteur activé sur port ${port === MOTOR_PORT.C ? 'C' : 'D'}`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur capteur : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  const unsubscribeSensor = useCallback(async (port: MotorPort) => {
    if (!hub) return;

    const message = new Uint8Array([
      0x0A, // Length
      0x00, // Hub ID
      PORT_INPUT_FORMAT_SETUP,
      port,
      SENSOR_MODE_DISTANCE,
      0x01, 0x00, 0x00, 0x00,
      0x00  // Disable notifications
    ]);

    try {
      await hub.characteristic.writeValue(message);
      activeSensorPortRef.current = null;
      setSensorData({ distance: null, color: null });
      addLog(`Capteur désactivé`, 'info');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur capteur : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  // Tilt sensor (built-in)
  const subscribeTilt = useCallback(async () => {
    if (!hub) return;

    const message = new Uint8Array([
      0x0A, // Length
      0x00, // Hub ID
      PORT_INPUT_FORMAT_SETUP,
      TILT_SENSOR_PORT,
      TILT_MODE_ANGLE,
      0x01, 0x00, 0x00, 0x00, // Delta (1)
      0x01  // Enable notifications
    ]);

    try {
      await hub.characteristic.writeValue(message);
      setIsTiltActive(true);
      addLog('Capteur d\'inclinaison activé', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur capteur inclinaison : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  const unsubscribeTilt = useCallback(async () => {
    if (!hub) return;

    const message = new Uint8Array([
      0x0A, // Length
      0x00, // Hub ID
      PORT_INPUT_FORMAT_SETUP,
      TILT_SENSOR_PORT,
      TILT_MODE_ANGLE,
      0x01, 0x00, 0x00, 0x00,
      0x00  // Disable notifications
    ]);

    try {
      await hub.characteristic.writeValue(message);
      setIsTiltActive(false);
      setTiltData(null);
      addLog('Capteur d\'inclinaison désactivé', 'info');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      addLog(`Erreur capteur inclinaison : ${errorMessage}`, 'error');
    }
  }, [hub, addLog]);

  return {
    hub,
    isConnecting,
    connectionStatus,
    logs,
    connect,
    disconnect,
    clearLogs,
    // Motor controls
    setMotorSpeed,
    setMotorsSpeed,
    stopMotor,
    stopAllMotors,
    drive,
    turn,
    // LED control
    setLedColor,
    // Distance sensor
    sensorData,
    subscribeSensor,
    unsubscribeSensor,
    // Tilt sensor
    tiltData,
    isTiltActive,
    subscribeTilt,
    unsubscribeTilt
  };
}
