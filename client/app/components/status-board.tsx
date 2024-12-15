import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDroppable,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SortableTask from "./sortable-task";
import { getTasks, useReorderTasks } from "@/app/api/fetch";
import { groupedTasks } from "@/app/lib/utils/grouped-tasks";
import { handleDragEnd } from "@/app/lib/utils/drag-utils";
import { statuses, Priority, Task } from "@/app/lib/utils/types";

const DroppableColumn = ({
  status,
  tasks,
}: {
  status: Priority;
  tasks: { id: number; title: string }[];
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${status}-priority`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full w-1/3 rounded p-4 transition-colors duration-200 ${
        isOver
          ? "bg-neutral-300 dark:bg-neutral-700"
          : "bg-neutral-200 dark:bg-neutral-800"
      }`}
    >
      <h2 className="mb-4 text-xl font-bold">{status} Priority</h2>
      <div className="flex w-full flex-1 flex-col">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} id={task.id} title={task.title} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const StatusBoard: React.FC = () => {
  const { data: tasks = [] } = getTasks();
  const { mutate } = useReorderTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === Number(active.id));
    if (task) {
      setActiveTask(task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;

    if (!active?.id || !over?.id) {
      return;
    }

    handleDragEnd(event, mutate, tasks);
  }

  const tasksGroupedByPriority = groupedTasks(tasks);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
        {statuses.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            tasks={tasksGroupedByPriority[status]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-background rounded-lg p-4 shadow-lg">
            {activeTask.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default StatusBoard;
