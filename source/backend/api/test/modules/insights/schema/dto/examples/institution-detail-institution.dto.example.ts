import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailInstitutionArmExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-arm.dto.example.ts";
import { institutionDetailInstitutionBasisExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-basis.dto.example.ts";
import { institutionDetailInstitutionKindExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-kind.dto.example.ts";
import { institutionDetailInstitutionParentExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution-parent.dto.example.ts";

/** The contract shape of InstitutionDetailInstitution, for generated tests. */
export const institutionDetailInstitutionExample: ContractExample = contractExample({
  name: "InstitutionDetailInstitution",
  fields: [
    {
      name: "arm",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionDetailInstitutionArmExample,
      },
    },
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionDetailInstitutionBasisExample,
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
      name: "established",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "functions",
      optional: false,
      nullable: false,
      array: {},
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
        example: () => institutionDetailInstitutionKindExample,
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
        example: () => institutionDetailInstitutionParentExample,
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
