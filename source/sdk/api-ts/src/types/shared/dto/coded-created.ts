/** Base for operational records with a unique identity code and creation time. */
export interface SharedCodedCreated {
  code: string;
  createdAt: string;
  id: string;
}
