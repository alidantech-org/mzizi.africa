import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetailLegalBasis, for generated tests. */
export const institutionDetailLegalBasisExample: ContractExample = contractExample({
  name: "InstitutionDetailLegalBasis",
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
      optional: true,
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
      optional: true,
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
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "provisionCode",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "type",
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
