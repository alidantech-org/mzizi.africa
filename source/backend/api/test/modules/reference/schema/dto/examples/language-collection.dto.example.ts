import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { languageEntryExample } from "@test/modules/reference/schema/dto/examples/language-entry.dto.example.ts";

/** The contract shape of LanguageCollection, for generated tests. */
export const languageCollectionExample: ContractExample = contractExample({
  name: "LanguageCollection",
  fields: [
    {
      name: "languages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageEntryExample },
    },
  ],
  invariants: [],
});
