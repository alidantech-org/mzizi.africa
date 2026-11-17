import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { pageWindowExample } from "@test/modules/shared/schema/dto/examples/page-window.dto.example.ts";

/** The contract shape of GeometryWindow, for generated tests. */
export const geometryWindowExample: ContractExample = contractExample({
  name: "GeometryWindow",
  fields: [
    {
      name: "east",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "featureTypeId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "north",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -90, max: 90 },
    },
    {
      name: "offset",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "simplifyTolerance",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "south",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -90, max: 90 },
    },
    {
      name: "west",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "zoom",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
