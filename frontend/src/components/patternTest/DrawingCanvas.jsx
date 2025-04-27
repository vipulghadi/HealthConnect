// components/patternTest/DrawingCanvas.jsx
'use client';

import React, { useEffect, useRef } from 'react';

const DrawingCanvas = ({ drawing, setDrawing, userPoints, setUserPoints }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.moveTo(userPoints[0][0], userPoints[0][1]);
      for (let i = 1; i < userPoints.length; i++) {
        ctx.lineTo(userPoints[i][0], userPoints[i][1]);
      }
      ctx.stroke();
    }
  }, [userPoints]);

  const handleMouseDown = (e) => {
    console.log("Mouse down event triggered");
    
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setUserPoints([[e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handleMouseMove = (e) => {
    console.log("Mouse move event triggered");
    if (!drawing || !e.buttons) {
      setDrawing(false);
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    setUserPoints((prev) => [...prev, [e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handleMouseUp = () => {
    console.log("Mouse up event triggered");
    if (drawing) {
      setDrawing(false);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="drawing-canvas bg-amber-200 border-2 border-gray-300 rounded-md"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default DrawingCanvas
