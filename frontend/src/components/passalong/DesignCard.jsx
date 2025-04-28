"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export default function DesignCard({ design }) {
  return (
    <Card className="w-full  border-2 ">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold text-center text-amber-900">
          Target Pattern
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs cursor-default">
                  ?
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-amber-800 text-amber-50 border-amber-700">
                <p className="text-sm">
                  Recreate this pattern by moving blocks in the tray below
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className=" pt-0">
        <div className="grid grid-cols-3 gap-3 p-2 bg-amber-100/30 rounded-lg">
          {design.map((row, i) => {
            return row.map((cell, j) => {
              return (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: (i * 3 + j) * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                  className={`relative w-full aspect-square flex items-center justify-center rounded-md ${
                    cell === "empty"
                      ? "bg-amber-100/50 border-2 border-dashed border-amber-300/70"
                      : "bg-white/20 shadow-inner"
                  }`}
                  aria-label={`${
                    cell === "empty" ? "Empty" : cell
                  } cell at row ${i + 1}, column ${j + 1}`}
                >
                  {cell !== "empty" && (
                    <motion.div
                      className={`absolute inset-1 rounded-md ${
                        cell === "red"
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-400/30"
                          : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-400/30"
                      } shadow-md`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  )}
                  <span className="sr-only">
                    {cell === "empty" ? "Empty space" : `${cell} block`}
                  </span>
                </motion.div>
              );
            });
          })}
        </div>
      </CardContent>
    </Card>
  );
}
