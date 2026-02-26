import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Block, SpeedLevel, BlockTemplate } from '../../../types/blocks';
import { getBlockTemplate, BLOCK_TEMPLATES, createBlockFromTemplate } from '../../../types/blocks';
import './BlockEditor.css';

interface BlockEditorProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  onClose: () => void;
}

const SPEED_LEVELS: SpeedLevel[] = [25, 50, 75, 100];
const DURATION_OPTIONS = [0.5, 1, 1.5, 2, 3, 5];
const REPEAT_OPTIONS = [2, 3, 5, 10];

const LED_COLORS = [
  { value: -1, name: 'random', color: 'conic-gradient(#ff69b4, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444, #ff69b4)', isGradient: true },
  { value: 0, name: 'off', color: '#333333', isGradient: false },
  { value: 1, name: 'pink', color: '#ff69b4', isGradient: false },
  { value: 2, name: 'purple', color: '#8b5cf6', isGradient: false },
  { value: 3, name: 'blue', color: '#3b82f6', isGradient: false },
  { value: 4, name: 'lightBlue', color: '#22d3ee', isGradient: false },
  { value: 5, name: 'cyan', color: '#06b6d4', isGradient: false },
  { value: 6, name: 'green', color: '#22c55e', isGradient: false },
  { value: 7, name: 'yellow', color: '#eab308', isGradient: false },
  { value: 8, name: 'orange', color: '#f97316', isGradient: false },
  { value: 9, name: 'red', color: '#ef4444', isGradient: false },
  { value: 10, name: 'white', color: '#ffffff', isGradient: false },
];

// Blocs disponibles pour les enfants du repeat (pas de repeat imbriqué)
const REPEAT_CHILD_TEMPLATES = BLOCK_TEMPLATES.filter(t => t.type !== 'repeat');

export function BlockEditor({ block, onUpdate, onDelete, onClose }: BlockEditorProps) {
  const { t } = useTranslation();
  const [editedBlock, setEditedBlock] = useState<Block>({ ...block });
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const template = getBlockTemplate(block.type);

  const handleSpeedChange = useCallback((speed: SpeedLevel) => {
    setEditedBlock((prev) => ({ ...prev, speed }));
  }, []);

  const handleDurationChange = useCallback((duration: number) => {
    setEditedBlock((prev) => ({ ...prev, duration }));
  }, []);

  const handlePortChange = useCallback((port: 'C' | 'D') => {
    setEditedBlock((prev) => ({ ...prev, port }));
  }, []);

  const handleColorChange = useCallback((color: number) => {
    setEditedBlock((prev) => ({ ...prev, color }));
  }, []);

  const handleTimesChange = useCallback((times: number) => {
    setEditedBlock((prev) => ({ ...prev, times }));
  }, []);

  const handleAddChild = useCallback((childTemplate: BlockTemplate) => {
    const newChild = createBlockFromTemplate(childTemplate);
    setEditedBlock((prev) => ({
      ...prev,
      children: [...(prev.children || []), newChild],
    }));
    // Ouvrir directement l'éditeur du nouveau bloc
    setEditingChildId(newChild.id);
  }, []);

  const handleRemoveChild = useCallback((childId: string) => {
    setEditedBlock((prev) => ({
      ...prev,
      children: (prev.children || []).filter((c) => c.id !== childId),
    }));
    if (editingChildId === childId) {
      setEditingChildId(null);
    }
  }, [editingChildId]);

  const handleUpdateChild = useCallback((childId: string, updates: Partial<Block>) => {
    setEditedBlock((prev) => ({
      ...prev,
      children: (prev.children || []).map((c) =>
        c.id === childId ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(editedBlock);
  }, [editedBlock, onUpdate]);

  const getSpeedLabel = (speed: SpeedLevel) => {
    switch (speed) {
      case 25:
        return t('codeLab.editor.slow');
      case 50:
        return t('codeLab.editor.medium');
      case 75:
        return t('codeLab.editor.fast');
      case 100:
        return t('codeLab.editor.veryFast');
    }
  };

  const hasSpeed =
    block.type === 'move-forward' ||
    block.type === 'move-backward' ||
    block.type === 'turn-left' ||
    block.type === 'turn-right' ||
    block.type === 'motor';

  const hasDuration =
    block.type === 'move-forward' ||
    block.type === 'move-backward' ||
    block.type === 'turn-left' ||
    block.type === 'turn-right' ||
    block.type === 'motor' ||
    block.type === 'wait';

  const hasPort = block.type === 'motor';
  const hasColor = block.type === 'led';
  const hasTimes = block.type === 'repeat';
  const hasChildren = block.type === 'repeat';

  // Helper pour vérifier si un bloc enfant a besoin de certains paramètres
  const childHasSpeed = (childType: string) =>
    ['move-forward', 'move-backward', 'turn-left', 'turn-right', 'motor'].includes(childType);
  const childHasDuration = (childType: string) =>
    ['move-forward', 'move-backward', 'turn-left', 'turn-right', 'motor', 'wait'].includes(childType);
  const childHasPort = (childType: string) => childType === 'motor';
  const childHasColor = (childType: string) => childType === 'led';

  if (!template) return null;

  const editingChild = editingChildId
    ? (editedBlock.children || []).find((c) => c.id === editingChildId)
    : null;

  return (
    <div className="block-editor-overlay" onClick={onClose}>
      <div className={`block-editor ${hasChildren ? 'block-editor--large' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="block-editor__header">
          <span className="block-editor__icon">{template.icon}</span>
          <h2 className="block-editor__title">{t(template.labelKey)}</h2>
        </div>

        <div className="block-editor__content">
          {hasSpeed && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.speed')}
              </label>
              <div className="block-editor__options">
                {SPEED_LEVELS.map((speed) => (
                  <button
                    key={speed}
                    className={`block-editor__option ${editedBlock.speed === speed ? 'block-editor__option--selected' : ''}`}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {getSpeedLabel(speed)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasDuration && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.duration')}
              </label>
              <div className="block-editor__options">
                {DURATION_OPTIONS.map((duration) => (
                  <button
                    key={duration}
                    className={`block-editor__option ${editedBlock.duration === duration ? 'block-editor__option--selected' : ''}`}
                    onClick={() => handleDurationChange(duration)}
                  >
                    {t('codeLab.editor.seconds', { value: duration })}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasPort && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.port')}
              </label>
              <div className="block-editor__options">
                {(['C', 'D'] as const).map((port) => (
                  <button
                    key={port}
                    className={`block-editor__option block-editor__option--large ${editedBlock.port === port ? 'block-editor__option--selected' : ''}`}
                    onClick={() => handlePortChange(port)}
                  >
                    {port}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasColor && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.color')}
              </label>
              <div className="block-editor__colors">
                {LED_COLORS.map(({ value, name, color, isGradient }) => (
                  <button
                    key={value}
                    className={`block-editor__color ${editedBlock.color === value ? 'block-editor__color--selected' : ''} ${isGradient ? 'block-editor__color--gradient' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleColorChange(value)}
                    title={t(`colors.${name}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {hasTimes && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.times')}
              </label>
              <div className="block-editor__options">
                {REPEAT_OPTIONS.map((times) => (
                  <button
                    key={times}
                    className={`block-editor__option block-editor__option--large ${editedBlock.times === times ? 'block-editor__option--selected' : ''}`}
                    onClick={() => handleTimesChange(times)}
                  >
                    x{times}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasChildren && (
            <div className="block-editor__section">
              <label className="block-editor__label">
                {t('codeLab.editor.actions')}
              </label>

              {/* Liste des blocs enfants actuels */}
              <div className="block-editor__children">
                {(editedBlock.children || []).length === 0 ? (
                  <div className="block-editor__children-empty">
                    {t('codeLab.editor.noActions')}
                  </div>
                ) : (
                  (editedBlock.children || []).map((child) => {
                    const childTemplate = getBlockTemplate(child.type);
                    const isEditing = editingChildId === child.id;
                    return (
                      <div key={child.id} className="block-editor__child-wrapper">
                        <div
                          className={`block-editor__child ${isEditing ? 'block-editor__child--editing' : ''}`}
                          onClick={() => setEditingChildId(isEditing ? null : child.id)}
                        >
                          <span className="block-editor__child-icon">
                            {childTemplate?.icon}
                          </span>
                          <span className="block-editor__child-label">
                            {childTemplate ? t(childTemplate.labelKey) : child.type}
                          </span>
                          <span className="block-editor__child-info">
                            {child.speed && `${child.speed}%`}
                            {child.duration && ` ${child.duration}s`}
                            {child.port && ` ${child.port}`}
                          </span>
                          <button
                            className="block-editor__child-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChild(child.id);
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Paramètres du bloc enfant */}
                        {isEditing && editingChild && (
                          <div className="block-editor__child-params">
                            {childHasSpeed(child.type) && (
                              <div className="block-editor__child-param">
                                <span className="block-editor__child-param-label">
                                  {t('codeLab.editor.speed')}
                                </span>
                                <div className="block-editor__child-param-options">
                                  {SPEED_LEVELS.map((speed) => (
                                    <button
                                      key={speed}
                                      className={`block-editor__child-param-btn ${editingChild.speed === speed ? 'block-editor__child-param-btn--selected' : ''}`}
                                      onClick={() => handleUpdateChild(child.id, { speed })}
                                    >
                                      {getSpeedLabel(speed)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {childHasDuration(child.type) && (
                              <div className="block-editor__child-param">
                                <span className="block-editor__child-param-label">
                                  {t('codeLab.editor.duration')}
                                </span>
                                <div className="block-editor__child-param-options">
                                  {DURATION_OPTIONS.map((duration) => (
                                    <button
                                      key={duration}
                                      className={`block-editor__child-param-btn ${editingChild.duration === duration ? 'block-editor__child-param-btn--selected' : ''}`}
                                      onClick={() => handleUpdateChild(child.id, { duration })}
                                    >
                                      {duration}s
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {childHasPort(child.type) && (
                              <div className="block-editor__child-param">
                                <span className="block-editor__child-param-label">
                                  {t('codeLab.editor.port')}
                                </span>
                                <div className="block-editor__child-param-options">
                                  {(['C', 'D'] as const).map((port) => (
                                    <button
                                      key={port}
                                      className={`block-editor__child-param-btn ${editingChild.port === port ? 'block-editor__child-param-btn--selected' : ''}`}
                                      onClick={() => handleUpdateChild(child.id, { port })}
                                    >
                                      {port}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {childHasColor(child.type) && (
                              <div className="block-editor__child-param">
                                <span className="block-editor__child-param-label">
                                  {t('codeLab.editor.color')}
                                </span>
                                <div className="block-editor__child-param-colors">
                                  {LED_COLORS.map(({ value, name, color, isGradient }) => (
                                    <button
                                      key={value}
                                      className={`block-editor__child-color ${editingChild.color === value ? 'block-editor__child-color--selected' : ''} ${isGradient ? 'block-editor__child-color--gradient' : ''}`}
                                      style={{ background: color }}
                                      onClick={() => handleUpdateChild(child.id, { color: value })}
                                      title={t(`colors.${name}`)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Mini-palette pour ajouter des blocs enfants */}
              <div className="block-editor__add-actions">
                <label className="block-editor__label">
                  {t('codeLab.editor.addAction')}
                </label>
                <div className="block-editor__mini-palette">
                  {REPEAT_CHILD_TEMPLATES.map((childTemplate) => (
                    <button
                      key={childTemplate.type}
                      className="block-editor__mini-block"
                      onClick={() => handleAddChild(childTemplate)}
                      title={t(childTemplate.labelKey)}
                    >
                      {childTemplate.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="block-editor__actions">
          <button
            className="block-editor__button block-editor__button--delete"
            onClick={onDelete}
          >
            {t('codeLab.editor.delete')}
          </button>
          <button
            className="block-editor__button block-editor__button--save"
            onClick={handleSave}
          >
            {t('codeLab.editor.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
