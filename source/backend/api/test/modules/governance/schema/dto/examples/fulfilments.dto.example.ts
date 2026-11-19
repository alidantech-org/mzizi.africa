import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contractsExample } from "@test/modules/civic/schema/dto/examples/contracts.dto.example.ts";
import { projectsExample } from "@test/modules/civic/schema/dto/examples/projects.dto.example.ts";
import { appropriationsExample } from "@test/modules/finance/schema/dto/examples/appropriations.dto.example.ts";
import { billsExample } from "@test/modules/governance/schema/dto/examples/bills.dto.example.ts";
import { promisesExample } from "@test/modules/governance/schema/dto/examples/promises.dto.example.ts";
import { instrumentsExample } from "@test/modules/legal/schema/dto/examples/instruments.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { citationsExample } from "@test/modules/source/schema/dto/examples/citations.dto.example.ts";

/** The contract shape of Fulfilments, for generated tests. */
export const fulfilmentsExample: ContractExample = contractExample({
  name: "Fulfilments",
  fields: [
    {
      name: "appropriationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "billId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contractId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "evidenceStatusId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "instrumentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "projectId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "promiseId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "recordedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "sourceCitationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "projectId" },
          operator: "not-equal",
          right: { literal: null },
        },
        {
          left: { field: "contractId" },
          operator: "not-equal",
          right: { literal: null },
        },
        {
          left: { field: "appropriationId" },
          operator: "not-equal",
          right: { literal: null },
        },
        {
          left: { field: "billId" },
          operator: "not-equal",
          right: { literal: null },
        },
        {
          left: { field: "instrumentId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
