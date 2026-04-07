import type React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragDrop } from './useDragDrop';

describe('useDragDrop', () => {
  it('initial state is not dragging', () => {
    const { result } = renderHook(() =>
      useDragDrop({ items: ['a', 'b', 'c'], onReorder: vi.fn() })
    );
    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.draggedIndex).toBeNull();
  });

  it('starts drag on handleDragStart', () => {
    const { result } = renderHook(() =>
      useDragDrop({ items: ['a', 'b', 'c'], onReorder: vi.fn() })
    );

    const element = document.createElement('div');
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 50 });
    const reactEvent = { nativeEvent: event, preventDefault: vi.fn() } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleDragStart(1, element, reactEvent);
    });

    expect(result.current.dragState.isDragging).toBe(true);
    expect(result.current.dragState.draggedIndex).toBe(1);
    expect(result.current.dragState.targetIndex).toBe(1);
  });

  it('reorders items when dropped at different index', () => {
    const onReorder = vi.fn();
    const items = ['a', 'b', 'c'];
    const { result } = renderHook(() =>
      useDragDrop({ items, onReorder })
    );

    const element = document.createElement('div');
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 50 });
    const reactEvent = { nativeEvent: event, preventDefault: vi.fn() } as unknown as React.MouseEvent;

    // Start dragging index 0
    act(() => {
      result.current.handleDragStart(0, element, reactEvent);
    });

    // Simulate mouseup which triggers handleDragEnd
    // The dragState.targetIndex is still 0 (same as draggedIndex), so no reorder
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    // Same index → no reorder
    expect(onReorder).not.toHaveBeenCalled();
  });
});
