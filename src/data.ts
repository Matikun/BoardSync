import type { BoardType } from "./types";

export const initialBoard: BoardType = {
  cards: {
    c1: { id: "c1", title: "Learn React" },
    c2: { id: "c2", title: "Set up project" },
    c3: { id: "c3", title: "Drag & Drop demo" },
  },
  columns: [
    {
      id: "todo",
      title: "To Do",
      cardIds: ["c1", "c2"],
    },
    {
      id: "doing",
      title: "In Progress",
      cardIds: ["c3"],
    },
    {
      id: "done",
      title: "Done",
      cardIds: [],
    },
  ],
};
