"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Result = ({ testResults }) => {
  const [userDetails, setUserDetails] = useState({ name: "N/A", age: 18 });
  const [iqScore, setIqScore] = useState(0);

  useEffect(() => {
    const fetchUserDataAndCalculateIQ = () => {
      const userDetailsStr = localStorage.getItem("userDetails");
      const kohsStr = localStorage.getItem("kohs_scores");
      const memoryStr = localStorage.getItem("memoryGameScores");
      const passAlongStr = localStorage.getItem("passAlongResponses");

      let name = "N/A";
      let age = 18; // Default age
      if (userDetailsStr) {
        const parsed = JSON.parse(userDetailsStr);
        name = parsed.name || "N/A";
        age = parseInt(parsed.age) || 18;
      }

      let totalScore = 0;

      if (kohsStr) {
        const kohs = JSON.parse(kohsStr);
        totalScore += kohs?.user_score?.total_score || 0;
      }

      if (memoryStr) {
        const memory = JSON.parse(memoryStr);
        totalScore += (memory.forward || 0) + (memory.reverse || 0);
      }

      if (passAlongStr) {
        const passAlong = JSON.parse(passAlongStr);
        passAlong.forEach((item) => {
          totalScore += item.score || 0;
        });
      }

      const finalIQ = Math.round(totalScore * age); // Rounded nicely

      setUserDetails({ name, age });
      setIqScore(finalIQ);
    };

    fetchUserDataAndCalculateIQ();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-100 px-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-3xl">
        <CardContent className="p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-indigo-800">
            🎯 IQ Test Result
          </h1>

          <div className="space-y-5 text-gray-700 text-lg">
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{userDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Age:</span>
              <span>{userDetails.age}</span>
            </div>
            <div className="flex justify-between mt-4 text-xl font-bold text-indigo-700">
              <span>Your IQ Score:</span>
              <span>{iqScore}</span>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              You completed {testResults.length} test
              {testResults.length !== 1 && "s"} successfully! 🚀
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-lg rounded-full"
            >
              Restart Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Result;
