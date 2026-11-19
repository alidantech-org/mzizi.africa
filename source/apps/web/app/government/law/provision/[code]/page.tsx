import { LawPage } from "#/components/site/views/law-page.tsx";

export const dynamic = "force-dynamic";

/** `/government/law/provision/<code>`: one provision of an instrument. */
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <LawPage provision={decodeURIComponent(code)} />;
}
