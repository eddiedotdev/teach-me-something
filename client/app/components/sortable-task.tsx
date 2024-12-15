import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTaskProps {
  id: number;
  title: string;
}

const SortableTask: React.FC<SortableTaskProps> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background mb-2 cursor-move rounded-lg p-4 shadow-lg"
      {...attributes}
      {...listeners}
    >
      {title}
    </div>
  );
};

export default SortableTask;
