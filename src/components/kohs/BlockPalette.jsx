import React from 'react';
import { cn } from '@/lib/utils';
import Block from './Block';
import { BLOCK_TYPES } from './constant';

const BlockPalette = ({ className }) => {
  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('blockType', blockType);
  };

  return (
    <div className={cn('flex flex-wrap gap-4 justify-center', className)}>
      {BLOCK_TYPES.map((blockDef) => (
        <div key={blockDef.id} className="flex flex-col items-center">
          <Block
            type={blockDef.id}
            size="md"
            isDraggable
            onDragStart={(e) => handleDragStart(e, blockDef.id)}
            className="shadow-md hover:shadow-lg transition-shadow"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {blockDef.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BlockPalette;