import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionListArmsGroupsInstitutionsArm, for generated tests. */
export const institutionListArmsGroupsInstitutionsArmExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroupsInstitutionsArm",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
