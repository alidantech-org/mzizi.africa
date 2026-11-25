import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { TextOrigin } from "#/modules/legislature/schema/enum/text-origin.enum.ts";
import { TextStatus } from "#/modules/legislature/schema/enum/text-status.enum.ts";
import { agendaExample } from "@test/modules/legislature/schema/dto/examples/agenda.dto.example.ts";
import { billsExample } from "@test/modules/legislature/schema/dto/examples/bills.dto.example.ts";
import { motionsExample } from "@test/modules/legislature/schema/dto/examples/motions.dto.example.ts";
import { countriesExample } from "@test/modules/reference/schema/dto/examples/countries.dto.example.ts";
import { languagesExample } from "@test/modules/reference/schema/dto/examples/languages.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of Summaries, for generated tests. */
export const summariesExample: ContractExample = contractExample({
  name: "Summaries",
  fields: [
    {
      name: "agendaId",
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
      name: "countryId",
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "motionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "origin",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextOrigin) },
    },
    {
      name: "speechId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextStatus) },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 8000 },
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
          left: { field: "speechId" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "countryId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
