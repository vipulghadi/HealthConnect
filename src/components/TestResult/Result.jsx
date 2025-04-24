"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Result = ({ testResults }) => {
  const calculateIQ = () => {
    // Example logic to calculate IQ based on test results.
    // Replace with actual calculation logic.
    let totalScore = 0;
    testResults.forEach((result) => {
      totalScore += result.score || 0; // Use score from each game
    });
    return totalScore; // This is just a placeholder
  };

  const iqScore = calculateIQ();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Your IQ Result</h1>

          <div className="space-y-3 text-gray-700">
            <p className="text-lg font-medium">
              Name:{" "}
              {localStorage.getItem("userDetails")
                ? JSON.parse(localStorage.getItem("userDetails")).name
                : "N/A"}
            </p>
            <p className="text-lg font-medium">
              Age:{" "}
              {localStorage.getItem("userDetails")
                ? JSON.parse(localStorage.getItem("userDetails")).age
                : "N/A"}
            </p>
            <p className="text-xl font-bold mt-4">Your IQ Score: {iqScore}</p>
            <p className="mt-4">
              You completed {testResults.length} tests successfully!
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={() => window.location.reload()}>
              Restart Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Result;
