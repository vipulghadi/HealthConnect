import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, RefreshCw, Check, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Controls = ({
  onRotate,
  onReset,
  onSubmit,
  onHelp,
  isGridEmpty,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onRotate}
        className="flex items-center"
        disabled={isGridEmpty}
      >
        <RotateCw className="mr-1 h-4 w-4" />
        Rotate
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="flex items-center"
        disabled={isGridEmpty}
      >
        <RefreshCw className="mr-1 h-4 w-4" />
        Reset
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onSubmit}
        className="flex items-center bg-blue-600 hover:bg-blue-700"
        disabled={isGridEmpty}
      >
        <Check className="mr-1 h-4 w-4" />
        Submit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onHelp}
        className="flex items-center"
      >
        <HelpCircle className="mr-1 h-4 w-4" />
        Help
      </Button>
    </div>
  );
};

export default Controls;