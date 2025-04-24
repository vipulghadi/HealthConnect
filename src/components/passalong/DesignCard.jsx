'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function DesignCard({ design }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="flex justify-center items-center w-1/2 bg-amber-300  transition-transform duration-300 animate-fade-in">
        
            <CardContent className="">
              <div className="grid grid-cols-3 gap-2  rounded-lg ">
                {design.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-gray-400 rounded-md`}
                      aria-label={`${cell === 'empty' ? 'Empty' : cell} cell at row ${i + 1}, column ${j + 1}`}
                    >
                      <div
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-md shadow-md transition-transform
                          ${cell === 'red' ? 'bg-red-600' : cell === 'blue' ? 'bg-blue-600' : 'bg-gray-200'}`}
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>Match this pattern by moving blocks in the tray</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}