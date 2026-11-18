import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { copyEntryExample } from "@test/modules/experience/schema/dto/examples/copy-entry.dto.example.ts";

/** The contract shape of CopyCatalog, for generated tests. */
export const copyCatalogExample: ContractExample = contractExample({
  name: "CopyCatalog",
  fields: [
    {
      name: "entries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => copyEntryExample },
    },
    {
      name: "languageCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
  ],
  invariants: [],
});
