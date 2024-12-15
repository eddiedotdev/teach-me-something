export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}

export type Priority = "Low" | "Medium" | "High";

let tasks: Task[] = [
  { id: 1, title: "Sample Task 1", completed: false, priority: "Low" },
  { id: 2, title: "Sample Task 2", completed: true, priority: "Medium" },
];

export const getTasks = (): Task[] => {
  return tasks;
};

export const reorderTask = (id: number, newPriority: Priority): Task | null => {
  return updateTask(id, { priority: newPriority });
};

export const updateTask = (
  id: number,
  updatedFields: Partial<Omit<Task, "id">>
): Task | null => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return null;
  }
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updatedFields,
    priority: updatedFields.priority || tasks[taskIndex].priority,
  };
  return tasks[taskIndex];
};


