import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { pageWindowExample } from "@test/modules/shared/schema/dto/examples/page-window.dto.example.ts";

/** The contract shape of SourceWindow, for generated tests. */
export const sourceWindowExample: ContractExample = contractExample({
  name: "SourceWindow",
  fields: [
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "offset",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
  ],
  invariants: [],
});
