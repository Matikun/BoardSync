export type Card = {
  id: string;
  title: string;
  description?: string;
};
export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type BoardType = {
  columns: Column[];
  cards: Record<string, Card>;
};
