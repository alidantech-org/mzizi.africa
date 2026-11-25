/** Lineage: which artifact, edition or file version was made from which. */
export interface SourceDerivations {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  inputArtifactId?: string | null;
  inputEditionId?: string | null;
  inputVersionId?: string | null;
  kindTerm: string;
  method?: string | null;
  outputArtifactId?: string | null;
  outputEditionId?: string | null;
  outputVersionId?: string | null;
  run?: string | null;
  updatedAt: string;
  version: number;
}
