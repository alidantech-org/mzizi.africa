/** Server-loaded evidence and explanatory sections over the generated API client. */
import { getLegalBasis } from "@mzizi/api-client/actions/insights/get-legal-basis.actions.ts";
import { getContent } from "@mzizi/api-client/actions/insights/get-content.actions.ts";
import {
  ContentArticle,
  Empty,
  LegalItems,
} from "#/_archives/components/site/governance/shared";
import { Loaded } from "#/_archives/components/site/loaded";
import { Gaps, Section } from "#/_archives/components/site/ui/primitives";
import { serverLanguage } from "#/_archives/lib/server/data";

export function LegalBasisSection({
  table,
  code,
}: {
  table: string;
  code: string;
}) {
  return (
    <Section title="Legal basis" kicker="Why this exists">
      <Loaded
        read={async () => {
          const result = await getLegalBasis({
            query: { subjectTable: table, subjectCode: code },
          });
          if (!result.success || !result.body)
            throw new Error("Legal basis could not be loaded");
          return result.body;
        }}
      >
        {(data) => (
          <>
            <LegalItems items={data.items} />
            <Gaps items={data.gaps} />
          </>
        )}
      </Loaded>
    </Section>
  );
}

export function SubjectContentSection({
  table,
  code,
  title,
}: {
  table: string;
  code: string;
  title: string;
}) {
  return (
    <Section title={title}>
      <Loaded
        read={async () => {
          const result = await getContent({
            query: {
              subjectTable: table,
              subjectCode: code,
              languageCode: await serverLanguage(),
            },
          });
          if (!result.success || !result.body)
            throw new Error("Explanatory text could not be loaded");
          return result.body;
        }}
      >
        {(data) =>
          data.content ? (
            <ContentArticle item={data.content} />
          ) : (
            <Empty title="No explanatory text recorded">
              A sourced description has not been added yet.
            </Empty>
          )
        }
      </Loaded>
    </Section>
  );
}
