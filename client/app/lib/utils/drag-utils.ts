import { DragEndEvent } from "@dnd-kit/core";
import { Task, Priority } from "./types";

export const handleDragEnd = (
  event: DragEndEvent,
  mutate: (data: { id: number; priority: Priority }) => void,
  tasks: Task[]
) => {
  const { active, over } = event;

  if (!active || !over) return;

  const newPriority = determineNewPriority(String(over.id));
  if (!newPriority) return;

  const activeTask = tasks.find((task) => task.id === Number(active.id));
  if (!activeTask || activeTask.priority === newPriority) return;

  // Optimistically update the cache
  mutate({
    id: Number(active.id),
    priority: newPriority,
  });
};

function determineNewPriority(containerId: string): Priority | null {
  const match = containerId.match(/(High|Medium|Low)-priority/);
  return match ? (match[1] as Priority) : null;
}
