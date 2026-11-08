import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { CheckKind } from "#/types/website/check-kind.enum.ts";
import { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of SiteCheckPublic, for generated tests. */
export const siteCheckPublicExample: ContractExample = contractExample({
  name: "SiteCheckPublic",
  fields: [
    {
      name: "checkedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "detail",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CheckKind) },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CheckOutcome) },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "structureVersionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
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