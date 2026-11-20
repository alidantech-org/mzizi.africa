import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ResolutionStatus } from "#/modules/explorer/schema/enum/resolution-status.enum.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of Resolution, for generated tests. */
export const resolutionExample: ContractExample = contractExample({
  name: "Resolution",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ResolutionStatus) },
    },
  ],
  invariants: [],
});
