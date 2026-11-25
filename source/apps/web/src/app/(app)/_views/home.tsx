/** Home: the countries Mzizi covers, by name in the reader's language. One server read (`frontend/home`). */
import { Globe2 } from "lucide-react";
import Link from "next/link";
import { frontendGetHomeScreen } from "@mzizi/api-client/actions/frontend";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import { hrefOf, languageCode } from "#/lib/server/codes";
import { effectiveLanguage } from "#/lib/server/copy";
import { Text } from "#/app/(app)/_views/text";

export default async function HomeView() {
  const language = await effectiveLanguage();
  const res = await frontendGetHomeScreen({ query: { lang: languageCode(language) }, options: { caching: { revalidate: 3600, tags: ["countries"] } } });
  const countries = [...(res.body?.countries ?? [])].sort((a, b) => a.name.text.localeCompare(b.name.text, language));
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Mzizi" title="Who holds public power, and what did they do with it?">
        Places, offices, figures and money across Africa, each with the evidence behind it. Choose a country to start.
      </PageHeader>
      <Panel id="countries" title="Countries" icon={Globe2} note={`${countries.length}`}>
        {!res.success ? (
          <p className="text-sm text-muted">The country list could not be loaded.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {countries.map((c) => (
              <li key={c.code}>
                <Link href={hrefOf(c.code)} className="hover:underline">
                  <Text value={c.name} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
