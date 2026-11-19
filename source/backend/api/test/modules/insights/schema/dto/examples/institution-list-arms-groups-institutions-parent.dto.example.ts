import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionListArmsGroupsInstitutionsParent, for generated tests. */
export const institutionListArmsGroupsInstitutionsParentExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroupsInstitutionsParent",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
