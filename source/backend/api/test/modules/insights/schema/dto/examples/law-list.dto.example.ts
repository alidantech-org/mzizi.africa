import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { lawInstrumentExample } from "@test/modules/insights/schema/dto/examples/law-instrument.dto.example.ts";

/** The contract shape of LawList, for generated tests. */
export const lawListExample: ContractExample = contractExample({
  name: "LawList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "instruments",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => lawInstrumentExample },
    },
  ],
  invariants: [],
});
