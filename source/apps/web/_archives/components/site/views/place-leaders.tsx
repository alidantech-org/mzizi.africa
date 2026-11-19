import LeadersRoute from "#/_archives/app/leaders/view";

/** The leaders above a place (`/<place>/leaders`). */
export default function PlaceLeaders({ id }: { id: string }) {
  return <LeadersRoute place={id} />;
}
