import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { TextDirection } from "#/modules/shared/schema/enum/text-direction.enum.ts";

/** The contract shape of LocalizedText, for generated tests. */
export const localizedTextExample: ContractExample = contractExample({
  name: "LocalizedText",
  fields: [
    {
      name: "direction",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextDirection) },
    },
    {
      name: "isFallback",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
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
