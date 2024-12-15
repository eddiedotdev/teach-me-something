export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}

export type Priority = "Low" | "Medium" | "High";

export const statuses: Priority[] = ["Low", "Medium", "High"] as const;
