import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { effectEntryExample } from "@test/modules/legal/schema/dto/examples/effect-entry.dto.example.ts";

/** The contract shape of EffectCollection, for generated tests. */
export const effectCollectionExample: ContractExample = contractExample({
  name: "EffectCollection",
  fields: [
    {
      name: "effects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => effectEntryExample },
    },
  ],
  invariants: [],
});
