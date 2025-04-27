"use client";
import { Progress } from "@/components/ui/progress";

export default function Timer({ elapsedTime, maxTime }) {
  const progress = Math.min((elapsedTime / 1000 / maxTime) * 100, 100);
  const seconds = (elapsedTime / 1000).toFixed(1);

  return (
    <div className="mt-4">
      <p>
        Time: {seconds}s / {maxTime}s
      </p>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
