import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const ResultModal = ({
  isOpen,
  onClose,
  onNextPattern,
  results,
  hasNextPattern,
}) => {
  if (!results) return null;

  const { isCorrect, score, maxScore, accuracy, timeInSeconds } = results;
  const accuracyPercentage = Math.round(accuracy * 100);
  const scorePercentage = Math.round((score / maxScore) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Pattern Matched!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Pattern Mismatch
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Score:</span>
            <span className="text-lg font-bold flex items-center">
              <Award className="h-5 w-5 text-yellow-500 mr-1" />
              {score} / {maxScore}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Accuracy</span>
                <span className="text-sm font-semibold">{accuracyPercentage}%</span>
              </div>
              <Progress value={accuracyPercentage} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Overall Score</span>
                <span className="text-sm font-semibold">{scorePercentage}%</span>
              </div>
              <Progress value={scorePercentage} className="h-2" />
            </div>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Time taken:</span>
              <span>{timeInSeconds} seconds</span>
            </div>

            {!isCorrect && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
                Keep practicing! Try to match the pattern exactly.
              </p>
            )}

            {isCorrect && (
              <p className="text-sm text-center text-green-600 dark:text-green-400 mt-2">
                Great job! You've successfully completed this pattern.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Try Again
          </Button>
          {hasNextPattern && (
            <Button onClick={onNextPattern}>Next Pattern</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;