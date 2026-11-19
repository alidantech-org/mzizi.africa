/** Initial engagement is loaded on the server; the client only sends explicit mutations. */
import { readEngagement } from "#/app/interactions.ts";
import { ReactionControl } from "#/components/site/reaction.tsx";

export async function ReactionButton({ table, subject }: { table: string; subject: string }) {
  return <ReactionControl key={`${table}:${subject}`} table={table} subject={subject} initial={await readEngagement(table, subject)} />;
}
