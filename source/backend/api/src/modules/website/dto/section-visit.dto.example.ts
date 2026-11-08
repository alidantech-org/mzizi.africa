import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of SectionVisit, for generated tests. */
export const sectionVisitExample: ContractExample = contractExample({
  name: "SectionVisit",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "depth",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "itemsFound",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "pageUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 1000 },
    },
    {
      name: "ruleIndex",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "sectionLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 60 },
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
    {
      name: "visitedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
  ],
  invariants: [
  ],
});