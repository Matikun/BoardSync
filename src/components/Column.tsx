import { useBoardStore } from "../store/BoardStore";
import type { Column as Columm } from "../types";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import React, { useMemo } from "react";

type Props = {
  column: Columm;
};

function ColumnComponent({ column }: Props) {
  const cardsStore = useBoardStore((s) => s.cards);

  const cards = useMemo(
    () => column.cardIds.map((id) => cardsStore[id]),
    [column.cardIds, cardsStore]
  );

  const { setNodeRef } = useDroppable({
    id: `${column.id}::${column.cardIds.length}`,
  });

  return (
    <div className="bg-gray-800 rounded-xl p-4 w-64 flex flex-col gap-2 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[100px]">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ColumnComponent);
