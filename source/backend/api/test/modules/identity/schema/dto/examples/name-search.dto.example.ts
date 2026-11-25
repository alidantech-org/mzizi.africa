import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { pageWindowExample } from "@test/modules/shared/schema/dto/examples/page-window.dto.example.ts";

/** The contract shape of NameSearch, for generated tests. */
export const nameSearchExample: ContractExample = contractExample({
  name: "NameSearch",
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
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
  ],
  invariants: [],
});
