import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteSubjectPublicExample } from "#/modules/website/dto/site-subject-public.dto.example.ts";

/** The contract shape of SiteSubjectResponse, for generated tests. */
export const siteSubjectResponseExample: ContractExample = contractExample({
  name: "SiteSubjectResponse",
  fields: [
    {
      name: "siteSubject",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteSubjectPublicExample },
    },
  ],
  invariants: [
  ],
});