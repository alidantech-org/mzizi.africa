import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionListArmsGroupsInstitutionsExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions.dto.example.ts";
import { institutionListArmsGroupsKindExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-kind.dto.example.ts";

/** The contract shape of InstitutionListArmsGroups, for generated tests. */
export const institutionListArmsGroupsExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroups",
  fields: [
    {
      name: "institutions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsInstitutionsExample,
      },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsKindExample,
      },
    },
  ],
  invariants: [],
});
