import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { projectDetailEvidenceExample } from "@test/modules/insights/schema/dto/examples/project-detail-evidence.dto.example.ts";
import { projectDetailMediaExample } from "@test/modules/insights/schema/dto/examples/project-detail-media.dto.example.ts";
import { projectDetailProcurementExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement.dto.example.ts";
import { projectDetailProjectExample } from "@test/modules/insights/schema/dto/examples/project-detail-project.dto.example.ts";

/** The contract shape of ProjectDetail, for generated tests. */
export const projectDetailExample: ContractExample = contractExample({
  name: "ProjectDetail",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectDetailEvidenceExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectDetailMediaExample },
    },
    {
      name: "money",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "procurement",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => projectDetailProcurementExample },
    },
    {
      name: "project",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => projectDetailProjectExample },
    },
  ],
  invariants: [],
});
