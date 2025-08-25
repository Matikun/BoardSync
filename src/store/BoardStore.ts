import { create } from "zustand";
import type { Card, Column } from "../types";

export type BoardState = {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void;
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
  moveCard: (cardId, toColumnId, index) => {
    const state = get();

    const fromColumnId = Object.keys(state.columns).find((colId) =>
      state.columns[colId].cardIds.includes(cardId)
    );
    if (!fromColumnId) return;

    const fromColumn = state.columns[fromColumnId];
    const toColumn = state.columns[toColumnId];

    const newFromCardIds = fromColumn.cardIds.filter((id) => id !== cardId);
    const newToCardIds = [...toColumn.cardIds.filter((id) => id !== cardId)];
    newToCardIds.splice(index, 0, cardId);

    set({
      columns: {
        ...state.columns,
        [fromColumnId]: { ...fromColumn, cardIds: newFromCardIds },
        [toColumnId]: { ...toColumn, cardIds: newToCardIds },
      },
    });
  },
}));
