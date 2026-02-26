import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Block, Program } from '../../../types/blocks';
import {
  getAllPrograms,
  saveProgram,
  deleteProgram,
  EXAMPLE_PROGRAMS,
} from '../../../utils/programStorage';
import './SaveLoadModal.css';

interface SaveLoadModalProps {
  blocks: Block[];
  currentProgramId: string | null;
  onLoad: (blocks: Block[], programId: string) => void;
  onSave: (programId: string) => void;
  onClose: () => void;
}

const PROGRAM_EMOJIS = ['🤖', '🚀', '⭐', '🎮', '🎨', '🔧', '💫', '🌈', '🎯', '🏆'];

export function SaveLoadModal({
  blocks,
  currentProgramId,
  onLoad,
  onSave,
  onClose,
}: SaveLoadModalProps) {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>(() => getAllPrograms());
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [programName, setProgramName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(PROGRAM_EMOJIS[0]);

  const handleSave = useCallback(() => {
    if (!programName.trim()) return;

    const fullName = `${selectedEmoji} ${programName.trim()}`;
    const program = saveProgram(fullName, blocks);
    setPrograms(getAllPrograms());
    onSave(program.id);
    setShowSaveForm(false);
    setProgramName('');
  }, [programName, selectedEmoji, blocks, onSave]);

  const handleLoad = useCallback(
    (program: Program) => {
      onLoad(program.blocks, program.id);
    },
    [onLoad]
  );

  const handleLoadExample = useCallback(
    (example: (typeof EXAMPLE_PROGRAMS)[0]) => {
      // Generate IDs for example blocks
      const blocksWithIds = structuredClone(example.blocks).map((block) => ({
        ...block,
        id: crypto.randomUUID(),
        children: block.children?.map((child) => ({
          ...child,
          id: crypto.randomUUID(),
        })),
      }));
      onLoad(blocksWithIds, '');
    },
    [onLoad]
  );

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteProgram(id)) {
      setPrograms(getAllPrograms());
    }
  }, []);

  return (
    <div className="save-load-overlay" onClick={onClose}>
      <div className="save-load-modal" onClick={(e) => e.stopPropagation()}>
        <div className="save-load-modal__header">
          <h2 className="save-load-modal__title">{t('codeLab.saveModal.title')}</h2>
          <button className="save-load-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="save-load-modal__content">
          {/* Save section */}
          {blocks.length > 0 && (
            <div className="save-load-modal__section">
              {showSaveForm ? (
                <div className="save-load-modal__save-form">
                  <div className="save-load-modal__emoji-picker">
                    {PROGRAM_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        className={`save-load-modal__emoji ${selectedEmoji === emoji ? 'save-load-modal__emoji--selected' : ''}`}
                        onClick={() => setSelectedEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="save-load-modal__input"
                    placeholder={t('codeLab.saveModal.programName')}
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    autoFocus
                    maxLength={20}
                  />
                  <div className="save-load-modal__form-actions">
                    <button
                      className="save-load-modal__button save-load-modal__button--cancel"
                      onClick={() => setShowSaveForm(false)}
                    >
                      {t('codeLab.saveModal.cancel')}
                    </button>
                    <button
                      className="save-load-modal__button save-load-modal__button--save"
                      onClick={handleSave}
                      disabled={!programName.trim()}
                    >
                      {t('codeLab.saveModal.save')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="save-load-modal__save-button"
                  onClick={() => setShowSaveForm(true)}
                >
                  💾 {t('codeLab.saveModal.saveAs')}
                </button>
              )}
            </div>
          )}

          {/* My programs */}
          {programs.length > 0 && (
            <div className="save-load-modal__section">
              <h3 className="save-load-modal__section-title">
                {t('codeLab.saveModal.myPrograms')}
              </h3>
              <div className="save-load-modal__programs">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className={`save-load-modal__program ${currentProgramId === program.id ? 'save-load-modal__program--current' : ''}`}
                    onClick={() => handleLoad(program)}
                  >
                    <span className="save-load-modal__program-name">
                      {program.name}
                    </span>
                    <span className="save-load-modal__program-blocks">
                      {program.blocks.length} blocs
                    </span>
                    <button
                      className="save-load-modal__delete"
                      onClick={(e) => handleDelete(program.id, e)}
                      title={t('codeLab.delete')}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example programs */}
          <div className="save-load-modal__section">
            <h3 className="save-load-modal__section-title">
              {t('codeLab.saveModal.examples')}
            </h3>
            <div className="save-load-modal__programs">
              {EXAMPLE_PROGRAMS.map((example, idx) => (
                <div
                  key={idx}
                  className="save-load-modal__program save-load-modal__program--example"
                  onClick={() => handleLoadExample(example)}
                >
                  <span className="save-load-modal__program-name">
                    ✨ {example.name}
                  </span>
                  <span className="save-load-modal__program-blocks">
                    {example.blocks.length} blocs
                  </span>
                </div>
              ))}
            </div>
          </div>

          {programs.length === 0 && (
            <p className="save-load-modal__empty">{t('codeLab.saveModal.empty')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
