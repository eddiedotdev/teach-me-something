"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueuedJob, NetworkContextType } from "../lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "../lib/utils/types";
import { useNetworkStatus } from "../lib/utils/network-status";

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const QUEUE_KEY = "network-queue";

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [queue, setQueue] = useState<QueuedJob[]>(() => {
    if (typeof window === "undefined") return [];
    const savedQueue = localStorage.getItem(QUEUE_KEY);
    return savedQueue ? JSON.parse(savedQueue) : [];
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  async function processQueue() {
    const currentQueue = [...queue];

    for (const job of currentQueue) {
      try {
        const response = await fetch(job.endpoint, {
          method: job.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job.payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTask: Task = await response.json();

        // Directly update the React Query cache with the updated task
        queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) =>
          oldTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );

        // Remove the processed job from the queue
        setQueue((prev) => prev.filter((j) => j.id !== job.id));
      } catch (error) {
        console.error("Failed to process job:", job, error);
        // Keep the failed job in the queue for retrying later
        break;
      }
    }
  }

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      processQueue();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Process queue on mount if online
    if (navigator.onLine && queue.length > 0) {
      processQueue();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queue]);

  function enqueueJob(job: Omit<QueuedJob, "id" | "timestamp">) {
    const newJob: QueuedJob = {
      ...job,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setQueue((prev) => [...prev, newJob]);
  }

  const value = {
    isOnline,
    enqueueJob,
    processQueue,
  };

  return (
    <NetworkContext.Provider value={value}>
      <OfflineBanner />
      {children}
    </NetworkContext.Provider>
  );
}

const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (!!isOnline || isOnline === undefined) return null;

  return (
    <div className="w-full bg-red-700 px-2 text-center text-white">
      <p>You are offline. Changes may not be saved.</p>
    </div>
  );
};

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return context;
}
