import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { copyEntryExample } from "@test/modules/explorer/schema/dto/examples/copy-entry.dto.example.ts";

/** The contract shape of CopyBundle, for generated tests. */
export const copyBundleExample: ContractExample = contractExample({
  name: "CopyBundle",
  fields: [
    {
      name: "entries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => copyEntryExample },
    },
    {
      name: "hash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 8, maxLength: 64 },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "missing",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
