import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { classCountExample } from "@test/modules/experience/schema/dto/examples/class-count.dto.example.ts";
import { facilityRowExample } from "@test/modules/experience/schema/dto/examples/facility-row.dto.example.ts";

/** The contract shape of FacilityList, for generated tests. */
export const facilityListExample: ContractExample = contractExample({
  name: "FacilityList",
  fields: [
    {
      name: "classes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => classCountExample },
    },
    {
      name: "facilities",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => facilityRowExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
