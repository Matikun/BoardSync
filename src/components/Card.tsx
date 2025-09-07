import React from "react";
import type { Card as CardType } from "../types";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  card: CardType;
};

// This component only uses local drag state for smooth UI.
// Zustand is only updated on drop (see Board.tsx), not during drag.
function CardComponent({ card }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-gray-700 p-3 rounded-lg shadow hover:bg-gray-600 transition"
    >
      <h3 className="font-medium">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-300">{card.description}</p>
      )}
    </div>
  );
}

export default React.memo(CardComponent);
