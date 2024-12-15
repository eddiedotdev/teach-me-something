import express, { Request, Response } from "express";
import cors from "cors";
import {
  getTasks,
  reorderTask,
  Priority,
} from "./data.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", (req: Request, res: Response) => {
  const tasks = getTasks();
  res.json(tasks);
});

// @ts-ignore
app.put("/api/tasks/:id/reorder", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id, 10);
  const { priority } = req.body as { priority: Priority };

  if (!priority) {
    return res.status(400).json({ message: "Priority is required" });
  }

  const reorderedTask = reorderTask(taskId, priority);

  if (reorderedTask) {
    res.json(reorderedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(port, () => {
  console.log(`Mock server running on port ${port}`);
});
