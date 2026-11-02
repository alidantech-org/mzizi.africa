import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalAuthorityLinkPublicExample } from "#/modules/legal/dto/legal-authority-link-public.dto.example.ts";

/** The contract shape of LegalAuthorityLinkResponse, for generated tests. */
export const legalAuthorityLinkResponseExample: ContractExample = contractExample({
  name: "LegalAuthorityLinkResponse",
  fields: [
    {
      name: "link",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalAuthorityLinkPublicExample },
    },
  ],
  invariants: [
  ],
});