import React from "react";
import type { Card as CardType } from "../types";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  card: CardType;
};

function CardComponent({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
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
