"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const maxTime = timeLeft > 200 ? 300 : 120; // 5 or 2 minutes
  const percentage = (timeLeft / maxTime) * 100;

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-16 h-16">
        <CircularProgressbar
          value={percentage}
          text={`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
          styles={buildStyles({
            textSize: "1.2rem",
            pathColor: percentage > 25 ? "#10b981" : "#ef4444",
            textColor: percentage > 25 ? "#10b981" : "#ef4444",
            trailColor: "#e5e7eb",
          })}
        />
      </div>
      <div className="text-sm font-medium">
        {percentage > 25 ? "Time remaining" : "Hurry up!"}
      </div>
    </div>
  );
}
