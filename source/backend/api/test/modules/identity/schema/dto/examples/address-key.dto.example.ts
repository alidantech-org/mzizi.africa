import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { pageWindowExample } from "@test/modules/shared/schema/dto/examples/page-window.dto.example.ts";

/** The contract shape of AddressKey, for generated tests. */
export const addressKeyExample: ContractExample = contractExample({
  name: "AddressKey",
  fields: [
    {
      name: "countryId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
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
      name: "segment",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 200,
        patterns: ["^[a-z0-9]+(-[a-z0-9]+)*$"],
      },
    },
  ],
  invariants: [],
});
