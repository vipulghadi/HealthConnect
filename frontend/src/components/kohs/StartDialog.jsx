import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

const StartDialog = ({ isOpen, onStart }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Kohs Block Design Test</DialogTitle>
          <DialogDescription>
            Test your visuospatial processing and problem-solving skills by recreating patterns using colored blocks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">How to Play:</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Study the target pattern shown at the top</li>
              <li>2. Drag colored blocks from the palette to match the pattern</li>
              <li>3. Work quickly but accurately to achieve the best score</li>
              <li>4. Progress through increasingly challenging patterns</li>
            </ol>
          </div>

          <div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Are you ready to begin the test?
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            Start Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartDialog;