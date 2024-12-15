import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { Priority, Task } from "../lib/utils/types";
import { useNetwork } from "../providers/network";

export const getTasks = (): UseQueryResult<Task[]> => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks`
      );
      return res.data;
    },
  });
};

export const useReorderTasks = (): UseMutationResult<
  Task,
  unknown,
  { id: number; priority: Priority },
  unknown
> => {
  const queryClient = useQueryClient();
  const { isOnline, enqueueJob } = useNetwork();

  return useMutation({
    onMutate: async ({ id, priority }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        const updatedTasks = previousTasks.map((task) =>
          task.id === id ? { ...task, priority } : task
        );
        queryClient.setQueryData(["tasks"], updatedTasks);
      }

      return { previousTasks };
    },

    mutationFn: async ({ id, priority }) => {
      if (!isOnline) {
        const currentTasks = queryClient.getQueryData<Task[]>(["tasks"]);

        const job = {
          endpoint: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks/${id}/reorder`,
          method: "PUT",
          payload: { priority },
        };

        enqueueJob(job);

        const optimisticTask = currentTasks?.find((task) => task.id === id);

        if (!optimisticTask) {
          throw new Error("Task not found in cache");
        }

        return { ...optimisticTask, priority };
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tasks/${id}/reorder`,
        { priority }
      );
      return response.data;
    },

    onError: (err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: async () => {
      if (isOnline) {
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });
};
