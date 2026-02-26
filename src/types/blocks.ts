export type BlockType =
  | 'move-forward'
  | 'move-backward'
  | 'turn-left'
  | 'turn-right'
  | 'stop'
  | 'motor'
  | 'led'
  | 'wait'
  | 'repeat';

export type BlockCategory = 'movement' | 'motors' | 'led' | 'control';

export type SpeedLevel = 25 | 50 | 75 | 100;

export interface Block {
  id: string;
  type: BlockType;
  speed?: SpeedLevel;
  duration?: number;
  port?: 'C' | 'D';
  color?: number;
  times?: number;
  children?: Block[];
}

export interface Program {
  id: string;
  name: string;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
}

export interface BlockTemplate {
  type: BlockType;
  category: BlockCategory;
  icon: string;
  labelKey: string;
  defaultSpeed?: SpeedLevel;
  defaultDuration?: number;
  defaultPort?: 'C' | 'D';
  defaultColor?: number;
  defaultTimes?: number;
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  // Movement blocks
  {
    type: 'move-forward',
    category: 'movement',
    icon: '⬆️',
    labelKey: 'codeLab.blocks.moveForward',
    defaultSpeed: 50,
    defaultDuration: 1,
  },
  {
    type: 'move-backward',
    category: 'movement',
    icon: '⬇️',
    labelKey: 'codeLab.blocks.moveBackward',
    defaultSpeed: 50,
    defaultDuration: 1,
  },
  {
    type: 'turn-left',
    category: 'movement',
    icon: '↪️',
    labelKey: 'codeLab.blocks.turnLeft',
    defaultSpeed: 50,
    defaultDuration: 0.5,
  },
  {
    type: 'turn-right',
    category: 'movement',
    icon: '↩️',
    labelKey: 'codeLab.blocks.turnRight',
    defaultSpeed: 50,
    defaultDuration: 0.5,
  },
  {
    type: 'stop',
    category: 'movement',
    icon: '⏹️',
    labelKey: 'codeLab.blocks.stop',
  },
  // Motor blocks
  {
    type: 'motor',
    category: 'motors',
    icon: '⚙️',
    labelKey: 'codeLab.blocks.motor',
    defaultSpeed: 50,
    defaultDuration: 1,
    defaultPort: 'C',
  },
  // LED blocks
  {
    type: 'led',
    category: 'led',
    icon: '💡',
    labelKey: 'codeLab.blocks.led',
    defaultColor: 6, // Green
  },
  // Control blocks
  {
    type: 'wait',
    category: 'control',
    icon: '⏳',
    labelKey: 'codeLab.blocks.wait',
    defaultDuration: 1,
  },
  {
    type: 'repeat',
    category: 'control',
    icon: '🔄',
    labelKey: 'codeLab.blocks.repeat',
    defaultTimes: 3,
  },
];

export function getBlockTemplate(type: BlockType): BlockTemplate | undefined {
  return BLOCK_TEMPLATES.find((t) => t.type === type);
}

export function createBlockFromTemplate(template: BlockTemplate): Block {
  const block: Block = {
    id: crypto.randomUUID(),
    type: template.type,
  };

  if (template.defaultSpeed !== undefined) {
    block.speed = template.defaultSpeed;
  }
  if (template.defaultDuration !== undefined) {
    block.duration = template.defaultDuration;
  }
  if (template.defaultPort !== undefined) {
    block.port = template.defaultPort;
  }
  if (template.defaultColor !== undefined) {
    block.color = template.defaultColor;
  }
  if (template.defaultTimes !== undefined) {
    block.times = template.defaultTimes;
  }
  if (template.type === 'repeat') {
    block.children = [];
  }

  return block;
}
