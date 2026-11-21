import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { BoundaryMode } from "#/modules/explorer/schema/enum/boundary-mode.enum.ts";

/** The contract shape of BoundariesInput, for generated tests. */
export const boundariesInputExample: ContractExample = contractExample({
  name: "BoundariesInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 100 },
    },
    {
      name: "mode",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(BoundaryMode) },
    },
    {
      name: "path",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "simplify",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 2 },
    },
  ],
  invariants: [],
});
