'use client'

import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function Tray({ grid, onMove, isRunning }) {
  const [invalidDrag, setInvalidDrag] = useState(null)

  const flatGrid = grid.flatMap((row, i) =>
    row.map((cell, j) => ({ id: `${i}-${j}`, cell, row: i, col: j }))
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    setInvalidDrag(null)
    if (active && over && active.id !== over.id && isRunning) {
      const activePos = active.id.split('-').map(Number)
      const overPos = over.id.split('-').map(Number)
      if (grid[overPos[0]][overPos[1]] === 'empty') {
        const isAdjacent =
          (activePos[0] === overPos[0] && Math.abs(activePos[1] - overPos[1]) === 1) ||
          (activePos[1] === overPos[1] && Math.abs(activePos[0] - overPos[0]) === 1)
        if (isAdjacent) {
          onMove(
            { row: activePos[0], col: activePos[1] },
            { row: overPos[0], col: overPos[1] }
          )
        } else {
          setInvalidDrag(active.id)
          setTimeout(() => setInvalidDrag(null), 300)
        }
      }
    }
  }

  function SortableItem({ id, cell, row, col }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 150ms ease',
    }

    const isInvalid = invalidDrag === id

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-gray-400 rounded-md
          ${cell !== 'empty' && isRunning ? 'cursor-move hover:scale-105' : ''}
          ${isInvalid ? 'animate-shake' : ''}`}
        aria-label={cell === 'empty' ? 'Empty cell' : `${cell} block at row ${row + 1}, column ${col + 1}`}
      >
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-md shadow-md transition-transform
            ${cell === 'red' ? 'bg-red-600' : cell === 'blue' ? 'bg-blue-600' : 'bg-gray-200'}`}
        />
      </div>
    )
  }

  return (
    <Card className=" bg-pink-300 w-1/2  flex justify-center items-center  ">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={flatGrid.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 ">
            {flatGrid.map(({ id, cell, row, col }) => (
              <SortableItem key={id} id={id} cell={cell} row={row} col={col} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  )
}