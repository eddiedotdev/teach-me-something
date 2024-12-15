export interface QueuedJob {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  payload: any;
}

export interface NetworkContextType {
  isOnline: boolean;
  enqueueJob: (job: Omit<QueuedJob, "id" | "timestamp">) => void;
  processQueue: () => Promise<void>;
}
