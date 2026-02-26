import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLegoBoostContext } from '../../context';
import { BlockPalette } from '../../components/CodeLab/BlockPalette';
import { ProgramCanvas } from '../../components/CodeLab/ProgramCanvas';
import { ProgramControls } from '../../components/CodeLab/ProgramControls';
import { BlockEditor } from '../../components/CodeLab/BlockEditor';
import { SaveLoadModal } from '../../components/CodeLab/SaveLoadModal';
import { useProgramExecutor } from '../../hooks/useProgramExecutor';
import type { Block, BlockTemplate } from '../../types/blocks';
import { createBlockFromTemplate } from '../../types/blocks';
import './CodeLabPage.css';

export function CodeLabPage() {
  const { t } = useTranslation();
  const { connectionStatus } = useLegoBoostContext();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentProgramId, setCurrentProgramId] = useState<string | null>(null);

  const { isExecuting, currentBlockId, execute, stop } = useProgramExecutor();

  const isConnected = connectionStatus === 'connected';

  const handleAddBlock = useCallback((template: BlockTemplate) => {
    const newBlock = createBlockFromTemplate(template);
    setBlocks((prev) => [...prev, newBlock]);
  }, []);

  const handleReorderBlocks = useCallback((reorderedBlocks: Block[]) => {
    setBlocks(reorderedBlocks);
  }, []);

  const handleEditBlock = useCallback((block: Block) => {
    setEditingBlock(block);
  }, []);

  const handleUpdateBlock = useCallback((updatedBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    setEditingBlock(null);
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setEditingBlock(null);
  }, []);

  const handlePlay = useCallback(() => {
    if (blocks.length > 0) {
      execute(blocks);
    }
  }, [blocks, execute]);

  const handleClear = useCallback(() => {
    setBlocks([]);
    setCurrentProgramId(null);
  }, []);

  const handleLoadProgram = useCallback((programBlocks: Block[], programId: string) => {
    setBlocks(programBlocks);
    setCurrentProgramId(programId);
    setShowSaveModal(false);
  }, []);

  const handleSaveComplete = useCallback((programId: string) => {
    setCurrentProgramId(programId);
    setShowSaveModal(false);
  }, []);

  return (
    <div className="code-lab">
      <div className="code-lab__header">
        <h1 className="code-lab__title">{t('codeLab.title')}</h1>
        <ProgramControls
          isExecuting={isExecuting}
          isConnected={isConnected}
          hasBlocks={blocks.length > 0}
          onPlay={handlePlay}
          onStop={stop}
          onSave={() => setShowSaveModal(true)}
          onClear={handleClear}
        />
      </div>

      <BlockPalette onAddBlock={handleAddBlock} />

      <ProgramCanvas
        blocks={blocks}
        currentBlockId={currentBlockId}
        onReorder={handleReorderBlocks}
        onEditBlock={handleEditBlock}
        onDeleteBlock={handleDeleteBlock}
      />

      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onUpdate={handleUpdateBlock}
          onDelete={() => handleDeleteBlock(editingBlock.id)}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {showSaveModal && (
        <SaveLoadModal
          blocks={blocks}
          currentProgramId={currentProgramId}
          onLoad={handleLoadProgram}
          onSave={handleSaveComplete}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}
