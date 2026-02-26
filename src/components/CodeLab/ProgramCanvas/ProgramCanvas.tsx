import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Block } from '../Block';
import { useDragDrop } from '../../../hooks/useDragDrop';
import type { Block as BlockType } from '../../../types/blocks';
import { getBlockTemplate } from '../../../types/blocks';
import './ProgramCanvas.css';

interface ProgramCanvasProps {
  blocks: BlockType[];
  currentBlockId: string | null;
  onReorder: (blocks: BlockType[]) => void;
  onEditBlock: (block: BlockType) => void;
  onDeleteBlock: (blockId: string) => void;
}

export function ProgramCanvas({
  blocks,
  currentBlockId,
  onReorder,
  onEditBlock,
  onDeleteBlock,
}: ProgramCanvasProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { dragState, handleDragStart, setContainerRef } = useDragDrop({
    items: blocks,
    onReorder,
  });

  const handleRef = useCallback(
    (element: HTMLDivElement | null) => {
      setContainerRef(element);
    },
    [setContainerRef]
  );

  const handleBlockMouseDown = useCallback(
    (index: number, e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      handleDragStart(index, target, e);
    },
    [handleDragStart]
  );

  const handleBlockTouchStart = useCallback(
    (index: number, e: React.TouchEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      handleDragStart(index, target, e);
    },
    [handleDragStart]
  );

  const handleBlockClick = useCallback(
    (block: BlockType) => {
      // Only trigger edit if we're not dragging
      if (!dragState.isDragging) {
        onEditBlock(block);
      }
    },
    [dragState.isDragging, onEditBlock]
  );

  const handleTrashDrop = useCallback(() => {
    if (dragState.isDragging && dragState.draggedIndex !== null) {
      const blockToDelete = blocks[dragState.draggedIndex];
      if (blockToDelete) {
        onDeleteBlock(blockToDelete.id);
      }
    }
  }, [dragState, blocks, onDeleteBlock]);

  const renderBlock = (block: BlockType, index: number, isChild = false) => {
    const isBeingDragged =
      !isChild && dragState.isDragging && dragState.draggedIndex === index;
    const isDropTarget =
      !isChild &&
      dragState.isDragging &&
      dragState.targetIndex === index &&
      dragState.draggedIndex !== index;

    const hasChildren = block.type === 'repeat' && block.children && block.children.length > 0;

    return (
      <div
        key={block.id}
        className={`program-canvas__block-wrapper ${isDropTarget ? 'program-canvas__block-wrapper--drop-target' : ''} ${isChild ? 'program-canvas__block-wrapper--child' : ''}`}
        onMouseDown={isChild ? undefined : (e) => handleBlockMouseDown(index, e)}
        onTouchStart={isChild ? undefined : (e) => handleBlockTouchStart(index, e)}
        onClick={() => handleBlockClick(block)}
      >
        {index > 0 && !isChild && (
          <span className="program-canvas__connector">→</span>
        )}
        <div className={`program-canvas__block-container ${hasChildren ? 'program-canvas__block-container--repeat' : ''}`}>
          <Block
            block={block}
            isExecuting={currentBlockId === block.id}
            isDragging={isBeingDragged}
          />
          {hasChildren && (
            <div className="program-canvas__repeat-children">
              <div className="program-canvas__repeat-bracket">
                {block.children!.map((child, childIndex) => {
                  const childTemplate = getBlockTemplate(child.type);
                  return (
                    <div key={child.id} className="program-canvas__repeat-child">
                      {childIndex > 0 && (
                        <span className="program-canvas__child-connector">→</span>
                      )}
                      <div className="program-canvas__mini-block">
                        <span className="program-canvas__mini-icon">{childTemplate?.icon}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="program-canvas__repeat-indicator">x{block.times}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="program-canvas" ref={containerRef}>
      {blocks.length === 0 ? (
        <div className="program-canvas__empty">
          <span className="program-canvas__empty-icon">👆</span>
          <span className="program-canvas__empty-text">
            {t('codeLab.emptyCanvas')}
          </span>
        </div>
      ) : (
        <>
          <div className="program-canvas__blocks" ref={handleRef}>
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
          <div
            className={`program-canvas__trash ${dragState.isDragging ? 'program-canvas__trash--active' : ''}`}
            onMouseUp={handleTrashDrop}
            onTouchEnd={handleTrashDrop}
          >
            🗑️
          </div>
        </>
      )}
    </div>
  );
}
