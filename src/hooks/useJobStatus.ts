/**
 * useJobStatus Hook
 * 
 * Polls for async job status and provides real-time updates
 * 
 * Usage:
 * ```tsx
 * const { job, isComplete, isLoading, error, cancel } = useJobStatus(jobId);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * if (!isComplete) return <ProgressBar value={job?.progress} />;
 * return <Results data={job?.result} />;
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export type JobStatus = 
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Job {
  id: string;
  userId: string;
  type: string;
  status: JobStatus;
  progress: number;
  input: any;
  result?: any;
  error?: string;
  checkpoints: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string;
}

export interface UseJobStatusOptions {
  pollInterval?: number; // Milliseconds between polls (default: 2000)
  onComplete?: (job: Job) => void;
  onError?: (error: string) => void;
  autoStart?: boolean; // Start polling immediately (default: true)
}

export interface UseJobStatusReturn {
  job: Job | null;
  isLoading: boolean;
  isComplete: boolean;
  error: string | null;
  progress: number;
  cancel: () => Promise<void>;
  retry: () => void;
  startPolling: () => void;
  stopPolling: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export function useJobStatus(
  jobId: string | null,
  options: UseJobStatusOptions = {}
): UseJobStatusReturn {
  const {
    pollInterval = 2000,
    onComplete,
    onError,
    autoStart = true,
  } = options;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(autoStart);
  const [pollIntervalId, setPollIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Derived states
  const isComplete = job?.status === 'completed' || 
                     job?.status === 'failed' || 
                     job?.status === 'cancelled';
  const progress = job?.progress || 0;

  /**
   * Fetch job status
   */
  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<Job>(`/jobs/${jobId}`);
      const jobData = response.data;

      setJob(jobData);
      setError(null);
      setIsLoading(false);

      // Handle completion
      if (
        jobData.status === 'completed' ||
        jobData.status === 'failed' ||
        jobData.status === 'cancelled'
      ) {
        // Stop polling
        if (pollIntervalId) {
          clearInterval(pollIntervalId);
          setPollIntervalId(null);
        }
        setIsPolling(false);

        // Callbacks
        if (jobData.status === 'completed' && onComplete) {
          onComplete(jobData);
        }
        
        if (jobData.status === 'failed' && jobData.error && onError) {
          onError(jobData.error);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch job status';
      setError(errorMessage);
      setIsLoading(false);

      if (onError) {
        onError(errorMessage);
      }

      // Stop polling on error
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        setPollIntervalId(null);
      }
      setIsPolling(false);
    }
  }, [jobId, onComplete, onError, pollIntervalId]);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    if (!jobId || isPolling) return;

    // Fetch immediately
    fetchJob();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchJob();
    }, pollInterval);

    setPollIntervalId(interval);
    setIsPolling(true);
  }, [jobId, isPolling, fetchJob, pollInterval]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      setPollIntervalId(null);
    }
    setIsPolling(false);
  }, [pollIntervalId]);

  /**
   * Cancel job
   */
  const cancel = useCallback(async () => {
    if (!jobId) return;

    try {
      await api.post(`/jobs/${jobId}/cancel`);
      
      // Refresh job status
      await fetchJob();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to cancel job';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [jobId, fetchJob, onError]);

  /**
   * Retry failed job (creates a new job with same input)
   */
  const retry = useCallback(async () => {
    if (!job) return;

    try {
      const response = await api.post<Job>('/jobs', {
        type: job.type,
        input: job.input,
      });

      const newJob = response.data;
      
      // Update to new job
      setJob(newJob);
      setError(null);
      setIsLoading(false);
      
      // Restart polling
      stopPolling();
      startPolling();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to retry job';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [job, onError, startPolling, stopPolling]);

  /**
   * Effect: Start/stop polling based on jobId and options
   */
  useEffect(() => {
    if (jobId && autoStart) {
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [jobId, autoStart]); // Don't include startPolling/stopPolling to avoid re-triggering

  return {
    job,
    isLoading,
    isComplete,
    error,
    progress,
    cancel,
    retry,
    startPolling,
    stopPolling,
  };
}

// ============================================================================
// HELPER HOOK: Create and Poll Job
// ============================================================================

/**
 * useCreateJob Hook
 * 
 * Creates a job and immediately starts polling
 */
export function useCreateJob(options: UseJobStatusOptions = {}) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const jobStatus = useJobStatus(jobId, options);

  const createJob = useCallback(async (type: string, input: any) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await api.post<Job>('/jobs', {
        type,
        input,
      });

      const job = response.data;
      setJobId(job.id);
      setIsCreating(false);

      return job;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create job';
      setCreateError(errorMessage);
      setIsCreating(false);

      throw new Error(errorMessage);
    }
  }, []);

  return {
    createJob,
    isCreating,
    createError,
    ...jobStatus,
  };
}
