/**
 * ProgressTracker Component
 * 
 * Displays job progress with status, percentage, and actions
 */

import React from 'react';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Job, JobStatus } from '../hooks/useJobStatus';

// ============================================================================
// TYPES
// ============================================================================

export interface ProgressTrackerProps {
  job: Job | null;
  isLoading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
  showDetails?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProgressTracker({
  job,
  isLoading = false,
  error = null,
  onCancel,
  onRetry,
  className = '',
  showDetails = false,
}: ProgressTrackerProps) {
  if (!job && !isLoading) {
    return null;
  }

  const status = job?.status || 'queued';
  const progress = job?.progress || 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(status, isLoading)}
            <div>
              <CardTitle className="text-lg">
                {getStatusTitle(status, job?.type)}
              </CardTitle>
              <CardDescription>
                {getStatusDescription(status, progress)}
              </CardDescription>
            </div>
          </div>
          
          <Badge variant={getStatusBadgeVariant(status)}>
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {(status === 'queued' || status === 'running') && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">
              {progress}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {status === 'failed' && job?.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Job Failed</p>
                <p className="mt-1">{job.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status === 'completed' && (
          <div className="rounded-md bg-green-50 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-300">
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Job Completed</p>
                <p className="mt-1">Your request has been processed successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {status === 'cancelled' && (
          <div className="rounded-md bg-orange-50 dark:bg-orange-950 p-3 text-sm text-orange-700 dark:text-orange-300">
            <div className="flex gap-2">
              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Job Cancelled</p>
                <p className="mt-1">This job was cancelled before completion.</p>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        {showDetails && job && (
          <div className="space-y-2 pt-2 border-t text-sm">
            <DetailRow label="Job ID" value={job.id} />
            <DetailRow label="Type" value={job.type} />
            <DetailRow label="Created" value={formatTimestamp(job.createdAt)} />
            {job.startedAt && (
              <DetailRow label="Started" value={formatTimestamp(job.startedAt)} />
            )}
            {job.completedAt && (
              <DetailRow label="Completed" value={formatTimestamp(job.completedAt)} />
            )}
            {job.completedAt && job.startedAt && (
              <DetailRow 
                label="Duration" 
                value={formatDuration(job.startedAt, job.completedAt)} 
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {(status === 'queued' || status === 'running') && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          {status === 'failed' && onRetry && (
            <Button
              variant="default"
              size="sm"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStatusIcon(status: JobStatus, isLoading: boolean) {
  if (isLoading && !status) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  switch (status) {
    case 'queued':
      return <Clock className="h-5 w-5 text-orange-500" />;
    case 'running':
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-orange-500" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
}

function getStatusTitle(status: JobStatus, type?: string): string {
  const typeLabel = type ? formatJobType(type) : 'Processing';

  switch (status) {
    case 'queued':
      return `${typeLabel} - Queued`;
    case 'running':
      return `${typeLabel} - In Progress`;
    case 'completed':
      return `${typeLabel} - Complete`;
    case 'failed':
      return `${typeLabel} - Failed`;
    case 'cancelled':
      return `${typeLabel} - Cancelled`;
    default:
      return typeLabel;
  }
}

function getStatusDescription(status: JobStatus, progress: number): string {
  switch (status) {
    case 'queued':
      return 'Waiting to start...';
    case 'running':
      return `Processing... ${progress}% complete`;
    case 'completed':
      return 'Successfully completed';
    case 'failed':
      return 'An error occurred';
    case 'cancelled':
      return 'Cancelled by user';
    default:
      return '';
  }
}

function getStatusBadgeVariant(status: JobStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'queued':
      return 'secondary';
    case 'running':
      return 'default';
    case 'completed':
      return 'outline';
    case 'failed':
      return 'destructive';
    case 'cancelled':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatJobType(type: string): string {
  const typeMap: Record<string, string> = {
    'ai_trip_generation': 'Trip Generation',
    'ai_research': 'AI Research',
    'ai_optimization': 'Itinerary Optimization',
    'ai_concierge_query': 'Concierge Query',
    'data_export': 'Data Export',
    'bulk_import': 'Bulk Import',
  };

  return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleString();
}

function formatDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

export function CompactProgressTracker({
  job,
  isLoading = false,
  className = '',
}: Pick<ProgressTrackerProps, 'job' | 'isLoading' | 'className'>) {
  if (!job && !isLoading) {
    return null;
  }

  const status = job?.status || 'queued';
  const progress = job?.progress || 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {getStatusIcon(status, isLoading)}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-medium truncate">
            {getStatusTitle(status, job?.type)}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {progress}%
          </span>
        </div>
        
        {(status === 'queued' || status === 'running') && (
          <Progress value={progress} className="h-1" />
        )}
      </div>
    </div>
  );
}
