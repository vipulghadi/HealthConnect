import React from 'react';
import { cn } from '@/lib/utils';

const Block = ({
  type,
  size = 'md',
  isDraggable = false,
  onDragStart,
  onClick,
  className,
}) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  const colorClass = {
    red: 'bg-red-600',
    white: 'bg-white',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-400',
  }[type];

  return (
    <div
      className={cn(
        'border-2 border-gray-900 dark:border-gray-700 rounded-sm cursor-pointer transition-all transform',
        isDraggable && 'hover:scale-105 active:scale-95',
        colorClass,
        sizeClass,
        className
      )}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onClick={onClick}
      data-block-type={type}
    />
  );
};

export default Block;