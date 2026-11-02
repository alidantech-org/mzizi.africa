import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { PatternStatus } from "#/types/website/pattern-status.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import { siteFamilyExample } from "#/modules/website/dto/site-family.dto.example.ts";

/** The contract shape of DomainPatternPublic, for generated tests. */
export const domainPatternPublicExample: ContractExample = contractExample({
  name: "DomainPatternPublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "domainRole",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DomainRole) },
    },
    {
      name: "familyId",
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
      name: "notes",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "scheme",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(UrlScheme) },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(PatternStatus) },
    },
    {
      name: "template",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 300 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "variables",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
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