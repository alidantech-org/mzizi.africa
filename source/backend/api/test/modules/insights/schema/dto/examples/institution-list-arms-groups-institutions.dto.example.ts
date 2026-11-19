import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionListArmsGroupsInstitutionsArmExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-arm.dto.example.ts";
import { institutionListArmsGroupsInstitutionsBasisExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-basis.dto.example.ts";
import { institutionListArmsGroupsInstitutionsKindExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-kind.dto.example.ts";
import { institutionListArmsGroupsInstitutionsParentExample } from "@test/modules/insights/schema/dto/examples/institution-list-arms-groups-institutions-parent.dto.example.ts";

/** The contract shape of InstitutionListArmsGroupsInstitutions, for generated tests. */
export const institutionListArmsGroupsInstitutionsExample: ContractExample = contractExample({
  name: "InstitutionListArmsGroupsInstitutions",
  fields: [
    {
      name: "arm",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsInstitutionsArmExample,
      },
    },
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsInstitutionsBasisExample,
      },
    },
    {
      name: "children",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "image",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsInstitutionsKindExample,
      },
    },
    {
      name: "leaders",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "parent",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => institutionListArmsGroupsInstitutionsParentExample,
      },
    },
    {
      name: "purpose",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
