import { useBoardStore } from "../store/BoardStore";
import type { Column as Columm } from "../types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";
import React from "react";

type Props = {
  column: Columm;
};

function ColumnComponent({ column }: Props) {
  // Use a stable selector for Zustand, map cardIds outside the selector
  const cardsStore = useBoardStore((s) => s.cards);
  const cards = column.cardIds.map((id) => cardsStore[id]);

  // Each column is a droppable container
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="bg-gray-800 rounded-xl p-4 w-64 flex flex-col gap-2 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
      {/* Only the card list is droppable/sortable, not the whole column */}
      <SortableContext
        id={column.id}
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[100px]">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default React.memo(ColumnComponent);
