import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { legalProvisionExample } from "#/modules/legal/dto/legal-provision.dto.example.ts";
import { historicalEntityExample } from "#/modules/shared/dto/historical-entity.dto.example.ts";

/** The contract shape of LegalAuthorityLink, for generated tests. */
export const legalAuthorityLinkExample: ContractExample = contractExample({
  name: "LegalAuthorityLink",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "provisionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "validTo",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});