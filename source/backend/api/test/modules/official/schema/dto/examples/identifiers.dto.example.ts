import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { entitiesExample } from "@test/modules/official/schema/dto/examples/entities.dto.example.ts";
import { individualsExample } from "@test/modules/official/schema/dto/examples/individuals.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { citationsExample } from "@test/modules/source/schema/dto/examples/citations.dto.example.ts";

/** The contract shape of Identifiers, for generated tests. */
export const identifiersExample: ContractExample = contractExample({
  name: "Identifiers",
  fields: [
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
      name: "entityId",
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
      name: "individualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "issuerEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "namespace",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "schemeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
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
