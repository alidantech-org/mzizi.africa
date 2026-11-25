import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { MessageStatus } from "#/modules/product/schema/enum/message-status.enum.ts";
import { TextOrigin } from "#/modules/product/schema/enum/text-origin.enum.ts";

/** The contract shape of MessageEntry, for generated tests. */
export const messageEntryExample: ContractExample = contractExample({
  name: "MessageEntry",
  fields: [
    {
      name: "countryId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "key",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 3,
        maxLength: 255,
        patterns: ["^[a-z][a-z0-9-]*(\\.[a-z0-9][a-z0-9-]*)+$"],
      },
    },
    {
      name: "origin",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextOrigin) },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(MessageStatus) },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 8000 },
    },
  ],
  invariants: [],
});
