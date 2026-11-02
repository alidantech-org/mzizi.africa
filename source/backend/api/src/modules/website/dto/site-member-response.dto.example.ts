import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteMemberPublicExample } from "#/modules/website/dto/site-member-public.dto.example.ts";

/** The contract shape of SiteMemberResponse, for generated tests. */
export const siteMemberResponseExample: ContractExample = contractExample({
  name: "SiteMemberResponse",
  fields: [
    {
      name: "siteMember",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteMemberPublicExample },
    },
  ],
  invariants: [
  ],
});