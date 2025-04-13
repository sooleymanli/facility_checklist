import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOutlined } from '@ant-design/icons';

interface SortableHeaderProps {
  id: string;
  children: React.ReactNode;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} style={{ cursor: 'move' }}>
        <DragOutlined />
      </div>
      {children}
    </div>
  );
};

export default SortableHeader; 