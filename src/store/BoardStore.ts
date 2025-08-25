import { create } from "zustand";
import type { Card, Column } from "../types";

export type BoardState = {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  cards: {
    c1: { id: "c1", title: "First Task" },
    c2: { id: "c2", title: "Second Task" },
  },
  columns: {
    todo: { id: "todo", title: "To Do", cardIds: ["c1"] },
    doing: { id: "doing", title: "Doing", cardIds: ["c2"] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  moveCard: (cardId, toColumnId, index) =>
    set((state) => {
      // find origin column
      const fromColumnId = Object.keys(state.columns).find((colId) =>
        state.columns[colId].cardIds.includes(cardId)
      );
      if (!fromColumnId) return state;

      const fromColumn = state.columns[fromColumnId];
      const toColumn = state.columns[toColumnId];

      // remove card from old column
      const newFrom = {
        ...fromColumn,
        cardIds: fromColumn.cardIds.filter((id) => id !== cardId),
      };

      // remove the card if it already exists in the target (avoid duplicates)
      const cleanedTo = toColumn.cardIds.filter((id) => id !== cardId);

      // insert at the given index
      const newTo = {
        ...toColumn,
        cardIds: [
          ...cleanedTo.slice(0, index),
          cardId,
          ...cleanedTo.slice(index),
        ],
      };

      return {
        columns: {
          ...state.columns,
          [fromColumnId]: newFrom,
          [toColumnId]: newTo,
        },
      };
    }),
}));
