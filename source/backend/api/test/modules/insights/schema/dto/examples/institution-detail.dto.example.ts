import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetail, for generated tests. */
export const institutionDetailExample: ContractExample = contractExample({
  name: "InstitutionDetail",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "content",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "institution",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "leaders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "legalBasis",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "metrics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "parents",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
