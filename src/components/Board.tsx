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
import type { Column as TypeColum, Card as TypeCard } from "../types";

const socket = io("http://localhost:4000");

export default function Board() {
  const columnsObj = useBoardStore((s) => s.columns);
  const cardsObj = useBoardStore((s) => s.cards);
  const moveCard = useBoardStore((s) => s.moveCard);
  const setBoard = useBoardStore((s) => s.setBoard);

  const columns = useMemo(() => Object.values(columnsObj), [columnsObj]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Fetch initial board data from REST API
  // this maybe should be inside of a board store

  useEffect(() => {
    fetch("http://localhost:4000/api/board")
      .then((res) => res.json())
      .then((data) => {
        const cards: Record<string, TypeCard> = {};
        const columns: Record<string, TypeColum> = {};

        data.columns.forEach((col: any) => {
          // Extract cards into flat record
          col.cards.forEach((card: any) => {
            cards[card.id] = {
              id: card.id,
              title: card.title,
              description: card.description ?? "",
            };
          });

          // Save column with cardIds only
          columns[col.id] = {
            id: col.id,
            title: col.title,
            cardIds: col.cards.map((c: any) => c.id),
          };
        });

        setBoard({ cards, columns });
      });
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
  const onDragEnd = async (event: DragEndEvent) => {
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
    // we should do a post request here to update the server to keep our data consistent
    // TODO: implement a fetch post request
    // im getting an 500 error what is wrong with my server?
    await fetch("http://localhost:4000/api/move-card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardId, toColumnId, toIndex }),
    });
    // probably
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
