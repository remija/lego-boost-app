export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export type LogType = 'info' | 'success' | 'warning' | 'error' | 'data';

export interface LogEntry {
  message: string;
  type: LogType;
  timestamp: string;
}

export interface LegoHub {
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  characteristic: BluetoothRemoteGATTCharacteristic;
}
