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

const HelpDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
          <DialogDescription>
            The Kohs Block Design Test assesses visuospatial processing and problem-solving skills.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Instructions:</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Study the target pattern displayed at the top</li>
              <li>2. Drag blocks from the palette to the grid</li>
              <li>3. Click a placed block to rotate it</li>
              <li>4. Submit when you think your pattern matches the target</li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Block Types:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Red Block: Solid red color</li>
              <li>• White Block: Solid white color</li>
              <li>• Blue Block: Solid blue color</li>
              <li>• Yellow Block: Solid yellow color</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Scoring:</h3>
            <p className="text-sm">
              Your score is based on accuracy and completion time. The faster you complete with higher accuracy, the better your score.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;