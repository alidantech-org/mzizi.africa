import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { evidenceRefExample } from "@test/modules/locality/schema/dto/examples/evidence-ref.dto.example.ts";
import { mediaRefExample } from "@test/modules/locality/schema/dto/examples/media-ref.dto.example.ts";

/** The contract shape of OfficeHolder, for generated tests. */
export const officeHolderExample: ContractExample = contractExample({
  name: "OfficeHolder",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => evidenceRefExample },
    },
    {
      name: "holderId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "leftOfficeOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "officeCode",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "officeTitle",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "partyName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "personName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "portrait",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => mediaRefExample },
    },
    {
      name: "tookOfficeOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "unitFeatureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "unitName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [],
});
