import { useState, useCallback, useRef, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  draggedIndex: number | null;
  targetIndex: number | null;
}

interface UseDragDropOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
}

export function useDragDrop<T>({ items, onReorder }: UseDragDropOptions<T>) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedIndex: null,
    targetIndex: null,
  });

  const draggedItemRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const initialPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draggedIndexRef = useRef<number | null>(null);

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = useCallback(
    (index: number, element: HTMLElement, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();

      const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
      const pos = getEventPosition(nativeEvent);

      draggedItemRef.current = element;
      draggedIndexRef.current = index;
      initialPosRef.current = pos;

      setDragState({
        isDragging: true,
        draggedIndex: index,
        targetIndex: index,
      });

      element.style.zIndex = '1000';
    },
    []
  );

  const calculateTargetIndex = useCallback(
    (currentX: number, containerElement: HTMLElement): number => {
      const children = Array.from(containerElement.children) as HTMLElement[];
      const draggedIdx = draggedIndexRef.current;

      if (draggedIdx === null) return 0;

      for (let i = 0; i < children.length; i++) {
        if (i === draggedIdx) continue;

        const child = children[i];
        const rect = child.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;

        if (currentX < midX) {
          return i < draggedIdx ? i : i;
        }
      }

      return children.length - 1;
    },
    []
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggedItemRef.current || !containerRef.current) return;

      const pos = getEventPosition(e);
      const targetIdx = calculateTargetIndex(pos.x, containerRef.current);

      setDragState((prev) => ({
        ...prev,
        targetIndex: targetIdx,
      }));
    },
    [calculateTargetIndex]
  );

  const handleDragEnd = useCallback(() => {
    const draggedIdx = draggedIndexRef.current;
    const targetIdx = dragState.targetIndex;

    if (draggedIdx !== null && targetIdx !== null && draggedIdx !== targetIdx) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIdx, 1);
      newItems.splice(targetIdx, 0, removed);
      onReorder(newItems);
    }

    if (draggedItemRef.current) {
      draggedItemRef.current.style.zIndex = '';
    }

    draggedItemRef.current = null;
    draggedIndexRef.current = null;

    setDragState({
      isDragging: false,
      draggedIndex: null,
      targetIndex: null,
    });
  }, [items, dragState.targetIndex, onReorder]);

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handleDragMove(e);
    };

    const handleEnd = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);

  const setContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  return {
    dragState,
    handleDragStart,
    setContainerRef,
  };
}
