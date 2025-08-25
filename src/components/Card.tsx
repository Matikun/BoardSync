import type { FC } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  id: string;
  title: string;
};

const Card: FC<Props> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 rounded-lg bg-gray-700 border border-gray-600 shadow-sm cursor-grab hover:bg-gray-600 transition-colors text-gray-100"
    >
      {title}
    </div>
  );
};

export default Card;
