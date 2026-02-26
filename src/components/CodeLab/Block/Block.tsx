import { useTranslation } from 'react-i18next';
import type { Block as BlockType, BlockCategory } from '../../../types/blocks';
import { getBlockTemplate } from '../../../types/blocks';
import './Block.css';

interface BlockProps {
  block: BlockType;
  isExecuting?: boolean;
  isDragging?: boolean;
  isInPalette?: boolean;
  onClick?: () => void;
}

const CATEGORY_CLASSES: Record<BlockCategory, string> = {
  movement: 'block--movement',
  motors: 'block--motors',
  led: 'block--led',
  control: 'block--control',
};

export function Block({
  block,
  isExecuting = false,
  isDragging = false,
  isInPalette = false,
  onClick,
}: BlockProps) {
  const { t } = useTranslation();
  const template = getBlockTemplate(block.type);

  if (!template) return null;

  const categoryClass = CATEGORY_CLASSES[template.category];
  const label = t(template.labelKey);

  const getBlockInfo = () => {
    const parts: string[] = [];

    if (block.speed !== undefined) {
      const speedLabel = getSpeedLabel(block.speed);
      parts.push(t(`codeLab.speed.${speedLabel}`));
    }

    if (block.duration !== undefined) {
      parts.push(t('codeLab.editor.seconds', { value: block.duration }));
    }

    if (block.port !== undefined) {
      parts.push(block.port);
    }

    if (block.times !== undefined) {
      parts.push(`x${block.times}`);
    }

    return parts.join(' · ');
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 25) return 'slow';
    if (speed <= 50) return 'medium';
    if (speed <= 75) return 'fast';
    return 'veryFast';
  };

  const blockInfo = getBlockInfo();

  return (
    <div
      className={`block ${categoryClass} ${isExecuting ? 'block--executing' : ''} ${isDragging ? 'block--dragging' : ''} ${isInPalette ? 'block--palette' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <span className="block__icon">{template.icon}</span>
      <div className="block__content">
        <span className="block__label">{label}</span>
        {blockInfo && !isInPalette && (
          <span className="block__info">{blockInfo}</span>
        )}
      </div>
      {block.type === 'led' && block.color !== undefined && (
        <span
          className={`block__color-preview ${block.color === -1 ? 'block__color-preview--random' : ''}`}
          style={{ background: getLedCssColor(block.color) }}
        />
      )}
    </div>
  );
}

function getLedCssColor(colorIndex: number): string {
  if (colorIndex === -1) {
    return 'conic-gradient(#ff69b4, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444, #ff69b4)';
  }
  const colors: Record<number, string> = {
    0: '#333', // Off
    1: '#ff69b4', // Pink
    2: '#8b5cf6', // Purple
    3: '#3b82f6', // Blue
    4: '#22d3ee', // Light blue
    5: '#06b6d4', // Cyan
    6: '#22c55e', // Green
    7: '#eab308', // Yellow
    8: '#f97316', // Orange
    9: '#ef4444', // Red
    10: '#ffffff', // White
  };
  return colors[colorIndex] || '#333';
}
