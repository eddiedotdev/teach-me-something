import { Priority } from "./types";

interface Job {
  id: number;
  priority: Priority;
}

class JobQueue {
  private queue: Map<number, Job> = new Map();

  enqueue(job: Job) {
    this.queue.set(job.id, job);
    this.saveQueue();
  }

  dequeue(): Job | undefined {
    const iterator = this.queue.values();
    const result = iterator.next();
    if (!result.done) {
      const job = result.value;
      this.queue.delete(job.id);
      this.saveQueue();
      return job;
    }
    return undefined;
  }

  isEmpty(): boolean {
    return this.queue.size === 0;
  }

  loadQueue() {
    const savedQueue = localStorage.getItem("jobQueue");
    if (savedQueue) {
      const jobs: Job[] = JSON.parse(savedQueue);
      jobs.forEach((job) => this.queue.set(job.id, job));
    }
  }

  saveQueue() {
    const jobs = Array.from(this.queue.values());
    localStorage.setItem("jobQueue", JSON.stringify(jobs));
  }
}

export const jobQueue = new JobQueue();
