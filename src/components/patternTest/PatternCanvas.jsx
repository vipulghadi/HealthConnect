// components/patternTest/PatternCanvas.jsx
'use client';

import React, { useEffect, useRef } from 'react';

const PatternCanvas = ({ pattern }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.moveTo(pattern[0][0], pattern[0][1]);
    for (let i = 1; i < pattern.length; i++) {
      ctx.lineTo(pattern[i][0], pattern[i][1]);
    }
    ctx.closePath();
    ctx.stroke();
  }, [pattern]);

  return <canvas ref={canvasRef} width={400} height={300} className="pattern-canvas bg-amber-200" />;
};

export default PatternCanvas;