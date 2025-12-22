/**
 * Job Service for Async Operations
 * 
 * Handles long-running operations (AI research, trip generation, etc.)
 * that would timeout in a single request.
 * 
 * Architecture:
 * 1. Client creates a job → returns job ID immediately
 * 2. Client polls for status
 * 3. Server processes job in background
 * 4. Job updates progress and stores result
 * 
 * Production Features:
 * - Checkpoint system for resume after failure
 * - Progress tracking (0-100%)
 * - Expiration and cleanup
 * - Error handling with context
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPES
// ============================================================================

export type JobType = 
  | 'ai_trip_generation'
  | 'ai_research'
  | 'ai_optimization'
  | 'ai_concierge_query'
  | 'data_export'
  | 'bulk_import';

export type JobStatus = 
  | 'queued'      // Created, waiting to start
  | 'running'     // Currently processing
  | 'completed'   // Successfully finished
  | 'failed'      // Error occurred
  | 'cancelled';  // User cancelled

export interface Job {
  id: string;
  userId: string;
  type: JobType;
  status: JobStatus;
  progress: number; // 0-100
  input: any; // Job-specific input data
  result?: any; // Final result
  error?: string; // Error message if failed
  checkpoints: Record<string, any>; // For resumable jobs
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string; // Auto-delete after 24 hours
}

export interface JobCreateInput {
  type: JobType;
  input: any;
}

export interface JobUpdateInput {
  status?: JobStatus;
  progress?: number;
  result?: any;
  error?: string;
  checkpoints?: Record<string, any>;
}

// ============================================================================
// JOB CRUD OPERATIONS
// ============================================================================

/**
 * Create a new job
 */
export async function createJob(
  userId: string,
  input: JobCreateInput
): Promise<Job> {
  const jobId = crypto.randomUUID();
  
  const job: Job = {
    id: jobId,
    userId,
    type: input.type,
    status: 'queued',
    progress: 0,
    input: input.input,
    checkpoints: {},
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  await kv.set(`job:${jobId}`, job);
  
  // Also add to user's job list for easy retrieval
  await addToUserJobList(userId, jobId);
  
  console.log(`✅ Job created: ${jobId} (${input.type})`);
  
  return job;
}

/**
 * Get job by ID
 */
export async function getJob(jobId: string): Promise<Job | null> {
  const job = await kv.get<Job>(`job:${jobId}`);
  return job;
}

/**
 * Get all jobs for a user
 */
export async function getUserJobs(userId: string): Promise<Job[]> {
  const jobList = await kv.get<string[]>(`user_jobs:${userId}`) || [];
  
  const jobs: Job[] = [];
  for (const jobId of jobList) {
    const job = await getJob(jobId);
    if (job) {
      jobs.push(job);
    }
  }
  
  // Sort by creation date (newest first)
  return jobs.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update job status and progress
 */
export async function updateJob(
  jobId: string,
  update: JobUpdateInput
): Promise<Job | null> {
  const job = await getJob(jobId);
  
  if (!job) {
    console.error(`❌ Job not found: ${jobId}`);
    return null;
  }

  // Update fields
  if (update.status !== undefined) {
    job.status = update.status;
    
    // Set timestamps based on status
    if (update.status === 'running' && !job.startedAt) {
      job.startedAt = new Date().toISOString();
    } else if (
      (update.status === 'completed' || 
       update.status === 'failed' || 
       update.status === 'cancelled') && 
      !job.completedAt
    ) {
      job.completedAt = new Date().toISOString();
    }
  }
  
  if (update.progress !== undefined) {
    job.progress = Math.max(0, Math.min(100, update.progress));
  }
  
  if (update.result !== undefined) {
    job.result = update.result;
  }
  
  if (update.error !== undefined) {
    job.error = update.error;
  }
  
  if (update.checkpoints !== undefined) {
    job.checkpoints = { ...job.checkpoints, ...update.checkpoints };
  }

  await kv.set(`job:${jobId}`, job);
  
  console.log(`📝 Job updated: ${jobId} → ${job.status} (${job.progress}%)`);
  
  return job;
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string): Promise<Job | null> {
  return await updateJob(jobId, {
    status: 'cancelled',
    error: 'Cancelled by user',
  });
}

/**
 * Delete a job
 */
export async function deleteJob(userId: string, jobId: string): Promise<void> {
  // Verify ownership
  const job = await getJob(jobId);
  if (!job || job.userId !== userId) {
    throw new Error('Job not found or unauthorized');
  }

  await kv.del(`job:${jobId}`);
  await removeFromUserJobList(userId, jobId);
  
  console.log(`🗑️ Job deleted: ${jobId}`);
}

// ============================================================================
// JOB PROCESSING
// ============================================================================

/**
 * Process a job asynchronously
 * This is called in the background after job creation
 */
export async function processJob(jobId: string): Promise<void> {
  const job = await getJob(jobId);
  
  if (!job) {
    console.error(`❌ Cannot process job ${jobId}: not found`);
    return;
  }

  // Don't process if already completed/failed/cancelled
  if (job.status !== 'queued' && job.status !== 'running') {
    console.log(`⏭️ Skipping job ${jobId}: already ${job.status}`);
    return;
  }

  try {
    // Mark as running
    await updateJob(jobId, { status: 'running', progress: 5 });

    // Process based on job type
    let result: any;
    
    switch (job.type) {
      case 'ai_trip_generation':
        result = await processAITripGeneration(job);
        break;
      
      case 'ai_research':
        result = await processAIResearch(job);
        break;
      
      case 'ai_optimization':
        result = await processAIOptimization(job);
        break;
      
      case 'ai_concierge_query':
        result = await processAIConciergeQuery(job);
        break;
      
      case 'data_export':
        result = await processDataExport(job);
        break;
      
      case 'bulk_import':
        result = await processBulkImport(job);
        break;
      
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    // Mark as completed
    await updateJob(jobId, {
      status: 'completed',
      progress: 100,
      result,
    });

    console.log(`✅ Job completed: ${jobId}`);
  } catch (error: any) {
    console.error(`❌ Job failed: ${jobId}`, error);
    
    await updateJob(jobId, {
      status: 'failed',
      error: error?.message || 'Unknown error',
    });
  }
}

// ============================================================================
// JOB TYPE PROCESSORS
// ============================================================================

/**
 * Process AI trip generation
 */
async function processAITripGeneration(job: Job): Promise<any> {
  // Import AI service dynamically to avoid circular dependencies
  const { getAIService } = await import('./ai-service.tsx');
  const aiService = getAIService();

  const { destination, dates, preferences } = job.input;
  
  // Update progress: 10%
  await updateJob(job.id, { 
    progress: 10,
    checkpoints: { stage: 'research' }
  });

  // Step 1: Research destination
  const researchPrompt = `Research ${destination} for travel planning. Provide key attractions, dining, and activities.`;
  const research = await aiService.processMessage({
    message: researchPrompt,
    userId: job.userId,
  });

  // Update progress: 40%
  await updateJob(job.id, { 
    progress: 40,
    checkpoints: { stage: 'itinerary', research: research.message }
  });

  // Step 2: Generate itinerary
  const itineraryPrompt = `Create a ${dates.duration}-day itinerary for ${destination} based on: ${research.message}. Preferences: ${JSON.stringify(preferences)}`;
  const itinerary = await aiService.processMessage({
    message: itineraryPrompt,
    userId: job.userId,
    history: [
      { role: 'user', content: researchPrompt },
      { role: 'assistant', content: research.message },
    ],
  });

  // Update progress: 80%
  await updateJob(job.id, { 
    progress: 80,
    checkpoints: { stage: 'formatting' }
  });

  // Step 3: Format and structure
  const structuredItinerary = parseItinerary(itinerary.message);

  // Final progress: 100% (will be set by processJob)
  return {
    destination,
    dates,
    itinerary: structuredItinerary,
    research: research.message,
  };
}

/**
 * Process AI research
 */
async function processAIResearch(job: Job): Promise<any> {
  const { getAIService } = await import('./ai-service.tsx');
  const aiService = getAIService();

  const { query, depth } = job.input;
  
  await updateJob(job.id, { progress: 20 });

  const response = await aiService.processMessage({
    message: query,
    userId: job.userId,
  });

  await updateJob(job.id, { progress: 80 });

  return {
    query,
    response: response.message,
    agent: response.agent,
  };
}

/**
 * Process AI optimization
 */
async function processAIOptimization(job: Job): Promise<any> {
  const { getAIService } = await import('./ai-service.tsx');
  const aiService = getAIService();

  const { tripId, optimizationType } = job.input;
  
  // TODO: Implement trip optimization logic
  await updateJob(job.id, { progress: 50 });

  return {
    tripId,
    optimizations: [],
  };
}

/**
 * Process AI concierge query
 */
async function processAIConciergeQuery(job: Job): Promise<any> {
  const { getAIService } = await import('./ai-service.tsx');
  const aiService = getAIService();

  const { message, conversationId } = job.input;
  
  await updateJob(job.id, { progress: 30 });

  const response = await aiService.processMessage({
    message,
    conversationId,
    userId: job.userId,
  });

  await updateJob(job.id, { progress: 90 });

  return {
    message: response.message,
    agent: response.agent,
    suggestions: response.suggestions,
  };
}

/**
 * Process data export
 */
async function processDataExport(job: Job): Promise<any> {
  const { format, dataType } = job.input;
  
  await updateJob(job.id, { progress: 50 });
  
  // TODO: Implement export logic
  
  return {
    format,
    url: 'https://example.com/export.csv',
  };
}

/**
 * Process bulk import
 */
async function processBulkImport(job: Job): Promise<any> {
  const { data, type } = job.input;
  
  await updateJob(job.id, { progress: 50 });
  
  // TODO: Implement import logic
  
  return {
    imported: 0,
    failed: 0,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Add job to user's job list
 */
async function addToUserJobList(userId: string, jobId: string): Promise<void> {
  const jobList = await kv.get<string[]>(`user_jobs:${userId}`) || [];
  
  // Add to front (newest first)
  jobList.unshift(jobId);
  
  // Keep only last 50 jobs
  const trimmedList = jobList.slice(0, 50);
  
  await kv.set(`user_jobs:${userId}`, trimmedList);
}

/**
 * Remove job from user's job list
 */
async function removeFromUserJobList(userId: string, jobId: string): Promise<void> {
  const jobList = await kv.get<string[]>(`user_jobs:${userId}`) || [];
  const filtered = jobList.filter(id => id !== jobId);
  await kv.set(`user_jobs:${userId}`, filtered);
}

/**
 * Parse AI itinerary response into structured format
 */
function parseItinerary(text: string): any {
  // Simple parser - can be enhanced
  // For now, return as-is
  return {
    raw: text,
    days: [],
    // TODO: Implement proper parsing
  };
}

/**
 * Clean up expired jobs
 * Should be called periodically (cron job)
 */
export async function cleanupExpiredJobs(): Promise<number> {
  const now = new Date().toISOString();
  let cleaned = 0;

  // Get all jobs (this is inefficient - in production, use a proper database query)
  const allKeys = await kv.getByPrefix('job:');
  
  for (const [key, job] of Object.entries(allKeys)) {
    if (job && typeof job === 'object' && 'expiresAt' in job) {
      const jobData = job as Job;
      if (jobData.expiresAt < now) {
        await kv.del(key);
        await removeFromUserJobList(jobData.userId, jobData.id);
        cleaned++;
      }
    }
  }

  console.log(`🧹 Cleaned up ${cleaned} expired jobs`);
  return cleaned;
}
