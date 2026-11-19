import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { manifestoExample } from "@test/modules/ledger/schema/dto/examples/manifesto.dto.example.ts";

/** The contract shape of ManifestoList, for generated tests. */
export const manifestoListExample: ContractExample = contractExample({
  name: "ManifestoList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "manifestos",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => manifestoExample },
    },
  ],
  invariants: [],
});
