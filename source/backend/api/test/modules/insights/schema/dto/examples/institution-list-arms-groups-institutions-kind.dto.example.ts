import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionListArmsGroupsInstitutionsKind, for generated tests. */
export const institutionListArmsGroupsInstitutionsKindExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroupsInstitutionsKind",
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
