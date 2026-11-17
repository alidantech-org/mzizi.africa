import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { addressesExample } from "@test/modules/source/schema/dto/examples/addresses.dto.example.ts";
import { sourcesExample } from "@test/modules/source/schema/dto/examples/sources.dto.example.ts";

/** The contract shape of Discoveries, for generated tests. */
export const discoveriesExample: ContractExample = contractExample({
  name: "Discoveries",
  fields: [
    {
      name: "addressId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "anchorText",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 1000 },
    },
    {
      name: "context",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
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
      name: "discoveredAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "foundOnAddressId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "observedUrl",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "sourceId",
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
  invariants: [],
});
