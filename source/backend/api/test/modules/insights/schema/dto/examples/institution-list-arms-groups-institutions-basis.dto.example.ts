import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionListArmsGroupsInstitutionsBasis, for generated tests. */
export const institutionListArmsGroupsInstitutionsBasisExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroupsInstitutionsBasis",
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
