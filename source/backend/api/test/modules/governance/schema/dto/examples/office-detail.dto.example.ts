import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { officeDetailHoldersExample } from "@test/modules/governance/schema/dto/examples/office-detail-holders.dto.example.ts";

/** The contract shape of OfficeDetail, for generated tests. */
export const officeDetailExample: ContractExample = contractExample({
  name: "OfficeDetail",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"],
      },
    },
    {
      name: "holders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => officeDetailHoldersExample },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "institutionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"],
      },
    },
    {
      name: "unitFeatureId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
