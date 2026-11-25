import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { messageExample } from "@test/modules/frontend/schema/dto/examples/message.dto.example.ts";

/** The contract shape of CopyBundle, for generated tests. */
export const copyBundleExample: ContractExample = contractExample({
  name: "CopyBundle",
  fields: [
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "messages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => messageExample },
    },
  ],
  invariants: [],
});
