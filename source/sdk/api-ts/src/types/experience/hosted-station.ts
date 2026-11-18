/** Hosted Station */
export interface ExperienceHostedStation {
  ballotsCast?: number | null;
  electionCode: string;
  electionYear: number;
  registeredVoters?: number | null;
  stationName: string;
  statusLabel: string;
  streamCount?: number | null;
}
