import React from 'react';
import { cn } from '@/lib/utils';
import Block from './Block';

const PatternDisplay = ({ 
  pattern, 
  title = 'Target Pattern', 
  className 
}) => {
  const gridRows = pattern.grid.length;
  const gridCols = pattern.grid[0].length;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h2>
      <div 
        className={cn(
          'grid gap-1 bg-gray-200 dark:bg-gray-800 p-3 rounded-md shadow-md'
        )}
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` 
        }}
      >
        {pattern.grid.flatMap((row, rowIndex) =>
          row.map((blockType, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              className="flex items-center justify-center"
            >
              <Block 
                type={blockType} 
                size={gridRows > 3 ? 'sm' : 'md'} 
              />
            </div>
          ))
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Pattern #{pattern.id} - {pattern.difficulty}
      </div>
    </div>
  );
};

export default PatternDisplay;