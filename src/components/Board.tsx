import { DndContext } from "@dnd-kit/core";
import type { FC } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import Column from "./Column";

import { initialBoard } from "../data";
import Card from "./Card";
import type { BoardType } from "../types";

const Board: FC = () => {
  const [board, setBoard] = useState<BoardType>(initialBoard);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const sourceColumn = board.columns.find((col) =>
      col.cardIds.includes(active.id as string)
    );
    const targetColumn = board.columns.find((col) => col.id === over.id);

    if (!sourceColumn || !targetColumn) return;

    // remove from source
    sourceColumn.cardIds = sourceColumn.cardIds.filter(
      (cid) => cid !== active.id
    );
    // add to target
    targetColumn.cardIds.push(active.id as string);

    setBoard({ ...board, columns: [...board.columns] });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* 🔥 Horizontal layout with scroll */}
      <div className="flex gap-6 p-6 h-screen overflow-x-auto bg-gray-900 text-gray-100">
        {board.columns.map((col) => (
          <Column key={col.id} id={col.id} title={col.title}>
            {col.cardIds.map((cid) => {
              const card = board.cards[cid];
              return <Card key={card.id} id={card.id} title={card.title} />;
            })}
          </Column>
        ))}
      </div>
    </DndContext>
  );
};
export default Board;
