import { DndContext } from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import Column from "./Column";

import { useBoardStore } from "../store/BoardStore";
import { useMemo } from "react";

export default function Board() {
  const columnsObj = useBoardStore((s) => s.columns);
  const moveCard = useBoardStore((s) => s.moveCard);

  // Memoize columns array to prevent unnecessary re-renders
  const columns = useMemo(() => Object.values(columnsObj), [columnsObj]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id.toString();
    const [toColumnId, toIndex] = over.id.toString().split("::");

    moveCard(cardId, toColumnId, Number(toIndex));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 bg-gray-900 min-h-screen text-gray-100">
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </DndContext>
  );
}
