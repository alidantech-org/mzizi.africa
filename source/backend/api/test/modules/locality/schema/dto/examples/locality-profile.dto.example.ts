import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { localityUnitExample } from "@test/modules/locality/schema/dto/examples/locality-unit.dto.example.ts";
import { mediaRefExample } from "@test/modules/locality/schema/dto/examples/media-ref.dto.example.ts";
import { officeHolderExample } from "@test/modules/locality/schema/dto/examples/office-holder.dto.example.ts";
import { procurementSummaryExample } from "@test/modules/locality/schema/dto/examples/procurement-summary.dto.example.ts";

/** The contract shape of LocalityProfile, for generated tests. */
export const localityProfileExample: ContractExample = contractExample({
  name: "LocalityProfile",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => localityUnitExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "languageRequested",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "languageServed",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => mediaRefExample },
    },
    {
      name: "officials",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => officeHolderExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => localityUnitExample },
    },
    {
      name: "procurement",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => procurementSummaryExample },
    },
  ],
  invariants: [],
});
