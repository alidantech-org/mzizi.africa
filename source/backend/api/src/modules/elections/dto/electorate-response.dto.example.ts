import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electoratePublicExample } from "#/modules/elections/dto/electorate-public.dto.example.ts";

/** The contract shape of ElectorateResponse, for generated tests. */
export const electorateResponseExample: ContractExample = contractExample({
  name: "ElectorateResponse",
  fields: [
    {
      name: "electorate",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => electoratePublicExample },
    },
  ],
  invariants: [
  ],
});