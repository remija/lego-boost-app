import { Block } from '../Block';
import type { BlockTemplate } from '../../../types/blocks';
import { BLOCK_TEMPLATES, createBlockFromTemplate } from '../../../types/blocks';
import './BlockPalette.css';

interface BlockPaletteProps {
  onAddBlock: (template: BlockTemplate) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="block-palette">
      <div className="block-palette__scroll">
        {BLOCK_TEMPLATES.map((template) => {
          const previewBlock = createBlockFromTemplate(template);
          return (
            <div
              key={template.type}
              className="block-palette__item"
              onClick={() => onAddBlock(template)}
              onKeyDown={(e) => e.key === 'Enter' && onAddBlock(template)}
              role="button"
              tabIndex={0}
            >
              <Block block={previewBlock} isInPalette />
            </div>
          );
        })}
      </div>
    </div>
  );
}
