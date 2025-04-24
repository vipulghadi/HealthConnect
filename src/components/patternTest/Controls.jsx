// components/patternTest/Controls.jsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const Controls = ({ drawing, onStart, onSubmit, onNext, canSubmit, canGoNext }) => {
  return (
    <div className="flex justify-center gap-4">
      <Button onClick={onStart} disabled={drawing}>
        Start Drawing
      </Button>
      <Button onClick={onSubmit} disabled={!canSubmit}>
        Submit
      </Button>
      <Button onClick={onNext} disabled={!canGoNext}>
        Next Pattern
      </Button>
    </div>
  );
};

export default Controls;