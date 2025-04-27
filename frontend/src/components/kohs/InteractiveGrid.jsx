'use client'
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import Block from './Block';

const InteractiveGrid = ({
  grid,
  onBlockPlace,
  onBlockClick,
  className,
}) => {
  const gridRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, rowIdx, colIdx) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    onBlockPlace(rowIdx, colIdx, blockType);
  };

  const handleCellClick = (rowIdx, colIdx) => {
    if (onBlockClick) {
      onBlockClick(rowIdx, colIdx);
    }
  };

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid gap-1 bg-gray-200 dark:bg-gray-800 p-3 rounded-md shadow-md',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            className="flex items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rowIdx, colIdx)}
            onClick={() => handleCellClick(rowIdx, colIdx)}
          >
            {cell ? (
              <Block
                type={cell}
                size={rows > 3 ? 'sm' : 'md'}
                className="hover:ring-2 hover:ring-blue-500"
              />
            ) : (
              <div
                className={cn(
                  'border-2 border-dashed border-gray-400 rounded-sm',
                  rows > 3 ? 'w-8 h-8' : 'w-12 h-12',
                  'flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InteractiveGrid;