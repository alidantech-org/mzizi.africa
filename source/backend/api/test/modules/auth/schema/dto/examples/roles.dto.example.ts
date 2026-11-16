import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { codedCreatedExample } from "@test/modules/shared/schema/dto/examples/coded-created.dto.example.ts";

/** The contract shape of Roles, for generated tests. */
export const rolesExample: ContractExample = contractExample({
  name: "Roles",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"],
      },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "description",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "managingInstitutionRefId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "policyVersion",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "protected",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "retiredAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
