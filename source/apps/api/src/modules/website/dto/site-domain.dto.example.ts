import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { DomainOrigin } from "#/types/website/domain-origin.enum.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { DomainStatus } from "#/types/website/domain-status.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of SiteDomain, for generated tests. */
export const siteDomainExample: ContractExample = contractExample({
  name: "SiteDomain",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "hostname",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 253 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isApex",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "lastHttpStatus",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 100, max: 599 },
    },
    {
      name: "lastProbeAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "observedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "origin",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DomainOrigin) },
    },
    {
      name: "parentDomainId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "redirectTo",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DomainRole) },
    },
    {
      name: "scheme",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(UrlScheme) },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DomainStatus) },
    },
    {
      name: "statusReason",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromPrecision",
      optional: false,
      nullable: false,
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
    {
      name: "zoneId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});