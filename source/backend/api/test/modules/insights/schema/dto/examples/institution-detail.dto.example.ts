import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailChildrenExample } from "@test/modules/insights/schema/dto/examples/institution-detail-children.dto.example.ts";
import { institutionDetailContentExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content.dto.example.ts";
import { institutionDetailInstitutionExample } from "@test/modules/insights/schema/dto/examples/institution-detail-institution.dto.example.ts";
import { institutionDetailLeadersExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders.dto.example.ts";
import { institutionDetailLegalBasisExample } from "@test/modules/insights/schema/dto/examples/institution-detail-legal-basis.dto.example.ts";
import { institutionDetailMetricsExample } from "@test/modules/insights/schema/dto/examples/institution-detail-metrics.dto.example.ts";
import { institutionDetailParentsExample } from "@test/modules/insights/schema/dto/examples/institution-detail-parents.dto.example.ts";

/** The contract shape of InstitutionDetail, for generated tests. */
export const institutionDetailExample: ContractExample = contractExample({
  name: "InstitutionDetail",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailChildrenExample },
    },
    {
      name: "content",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailContentExample },
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
      spec: {
        kind: "schema",
        example: () => institutionDetailInstitutionExample,
      },
    },
    {
      name: "leaders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailLeadersExample },
    },
    {
      name: "legalBasis",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => institutionDetailLegalBasisExample,
      },
    },
    {
      name: "metrics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailMetricsExample },
    },
    {
      name: "parents",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailParentsExample },
    },
  ],
  invariants: [],
});
