import { LawPage } from "#/components/site/views/law-page.tsx";

export const dynamic = "force-dynamic";

/** `/government/law/<instrument>`: the instrument's overview. */
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <LawPage instrument={decodeURIComponent(code)} />;
}
