import { statuses } from "./types";
import { Task } from "./types";
import { Priority } from "./types";

export const groupedTasks = (tasks: Task[]) =>
  statuses.reduce<Record<Priority, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.priority === status);
      return acc;
    },
    {} as Record<Priority, Task[]>
  );
