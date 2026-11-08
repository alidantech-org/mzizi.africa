import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteDomainPublicExample } from "#/modules/website/dto/site-domain-public.dto.example.ts";

/** The contract shape of SiteDomainResponse, for generated tests. */
export const siteDomainResponseExample: ContractExample = contractExample({
  name: "SiteDomainResponse",
  fields: [
    {
      name: "domain",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteDomainPublicExample },
    },
  ],
  invariants: [
  ],
});