import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { FingerprintKind } from "#/types/website/fingerprint-kind.enum.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of SiteFingerprintPublic, for generated tests. */
export const siteFingerprintPublicExample: ContractExample = contractExample({
  name: "SiteFingerprintPublic",
  fields: [
    {
      name: "checkId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "computedAt",
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
      name: "digest",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "features",
      optional: false,
      nullable: false,
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
      spec: { kind: "enum", values: Object.values(FingerprintKind) },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
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