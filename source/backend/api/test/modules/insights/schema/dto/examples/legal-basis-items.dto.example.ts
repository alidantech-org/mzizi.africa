import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LegalBasisItems, for generated tests. */
export const legalBasisItemsExample: ContractExample = contractExample({
  name: "LegalBasisItems",
  fields: [
    {
      name: "designation",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "effect",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "effectCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "excerpt",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "explanation",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "heading",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "instrument",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "instrumentCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "provisionCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "via",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
