import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of SchemeWindow, for generated tests. */
export const schemeWindowExample: ContractExample = contractExample({
  name: "SchemeWindow",
  fields: [
    {
      name: "code",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
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
  ],
  invariants: [
  ],
});