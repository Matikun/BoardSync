import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import Column from "./Column";
import Card from "./Card";
import { useBoardStore } from "../store/BoardStore";

const socket = io("http://localhost:4000");

export default function Board() {
  const columnsObj = useBoardStore((s) => s.columns);
  const cardsObj = useBoardStore((s) => s.cards);
  const moveCard = useBoardStore((s) => s.moveCard);
  const setBoard = useBoardStore((s) => s.setBoard);

  const columns = useMemo(() => Object.values(columnsObj), [columnsObj]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Fetch initial board data from REST API
  useEffect(() => {
    fetch("http://localhost:4000/api/board")
      .then((res) => res.json())
      .then((data) => setBoard(data));
  }, [setBoard]);

  // Listen for real-time card moves
  useEffect(() => {
    socket.on("card-moved", ({ cardId, toColumnId, toIndex }) => {
      moveCard(cardId, toColumnId, toIndex);
    });
    return () => {
      socket.off("card-moved");
    };
  }, [moveCard]);

  // Set activeId on drag start for DragOverlay animation
  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  // Clear activeId and sync move on drag end
  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id.toString();
    const toColumnId = over.id.toString();
    const toColumn = columns.find((c) => c.id === toColumnId);
    if (!toColumn) return;

    // Move to end of column for now
    const toIndex = toColumn.cardIds.length;

    moveCard(cardId, toColumnId, toIndex);
    socket.emit("move-card", { cardId, toColumnId, toIndex });
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 bg-gray-900 min-h-screen text-gray-100">
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
        <DragOverlay>
          {activeId
            ? (() => {
                const card = cardsObj[activeId];
                return card ? <Card card={card} /> : null;
              })()
            : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
