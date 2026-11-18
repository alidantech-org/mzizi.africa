/** The tone a status word is shown in. */
export const statusTone = (status: string | null): "plain" | "good" | "warn" | "bad" | "info" =>
  status === "completed" || status === "complete" || status === "awarded" || status === "passed" ? "good"
  : status === "ongoing" || status === "open" ? "info"
  : status === "planned" || status === "evaluation" ? "warn"
  : status === "stalled" || status === "cancelled" || status === "rejected" ? "bad" : "plain";
