import { create } from "zustand";
import type { Card, Column } from "../types";

export type BoardState = {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void;
  setBoard: (board: {
    cards: Record<string, Card>;
    columns: Record<string, Column>;
  }) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: {
    "col-1": { id: "col-1", title: "Todo", cardIds: ["c1", "c2"] },
    "col-2": { id: "col-2", title: "In Progress", cardIds: [] },
    "col-3": { id: "col-3", title: "Done", cardIds: [] },
  },
  cards: {
    c1: { id: "c1", title: "First Task" },
    c2: { id: "c2", title: "Second Task" },
  },
  moveCard: (cardId, toColumnId, toIndex) => {
    const state = get();
    // Find the column containing the card
    const fromColumnId = Object.keys(state.columns).find((colId) =>
      state.columns[colId].cardIds.includes(cardId)
    );
    if (!fromColumnId) return;
    // Remove card from old column
    const newColumns = { ...state.columns };
    newColumns[fromColumnId] = {
      ...newColumns[fromColumnId],
      cardIds: newColumns[fromColumnId].cardIds.filter((id) => id !== cardId),
    };
    // Insert card into new column
    newColumns[toColumnId] = {
      ...newColumns[toColumnId],
      cardIds: [
        ...newColumns[toColumnId].cardIds.slice(0, toIndex),
        cardId,
        ...newColumns[toColumnId].cardIds.slice(toIndex),
      ],
    };
    set({ columns: newColumns });
  },
  setBoard: (board) => set({ cards: board.cards, columns: board.columns }),
}));
