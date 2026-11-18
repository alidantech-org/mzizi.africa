/** Job Event Type */
export enum RuntimeJobEventType {
  CANCELLED = "cancelled",
  FAILED = "failed",
  LOG = "log",
  PROGRESS = "progress",
  QUEUED = "queued",
  STARTED = "started",
  SUCCEEDED = "succeeded",
}
