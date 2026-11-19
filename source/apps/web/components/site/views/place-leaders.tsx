
import LeadersRoute from "#/app/leaders/view.tsx";

/** The leaders above a place (`/<place>/leaders`). */
export default function PlaceLeaders({ id }: { id: string }) {
  return <LeadersRoute place={id} />;
}
