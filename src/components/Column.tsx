import type { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

const Column: FC<Props> = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`rounded-xl shadow-md p-4 w-72 flex-shrink-0 transition-colors ${
        isOver ? "bg-gray-700" : "bg-gray-800"
      }`}
    >
      <h2 className="font-bold text-lg mb-3 text-gray-100">{title}</h2>
      <div ref={setNodeRef} className="space-y-3 min-h-[100px]">
        {children}
      </div>
    </div>
  );
};

export default Column;
