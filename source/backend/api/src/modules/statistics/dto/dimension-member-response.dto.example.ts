import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { dimensionMemberPublicExample } from "#/modules/statistics/dto/dimension-member-public.dto.example.ts";

/** The contract shape of DimensionMemberResponse, for generated tests. */
export const dimensionMemberResponseExample: ContractExample = contractExample({
  name: "DimensionMemberResponse",
  fields: [
    {
      name: "member",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => dimensionMemberPublicExample },
    },
  ],
  invariants: [
  ],
});