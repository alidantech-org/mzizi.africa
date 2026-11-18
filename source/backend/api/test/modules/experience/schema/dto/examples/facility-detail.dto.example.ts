import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { facilityRowExample } from "@test/modules/experience/schema/dto/examples/facility-row.dto.example.ts";
import { hostedStationExample } from "@test/modules/experience/schema/dto/examples/hosted-station.dto.example.ts";
import { placeRefExample } from "@test/modules/experience/schema/dto/examples/place-ref.dto.example.ts";

/** The contract shape of FacilityDetail, for generated tests. */
export const facilityDetailExample: ContractExample = contractExample({
  name: "FacilityDetail",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeRefExample },
    },
    {
      name: "facility",
      optional: false,
      nullable: false,
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
      name: "stations",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => hostedStationExample },
    },
  ],
  invariants: [],
});
