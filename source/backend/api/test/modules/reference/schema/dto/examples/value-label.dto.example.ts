import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ValueLabelKind } from "#/modules/reference/schema/enum/value-label-kind.enum.ts";
import { languageExample } from "@test/modules/reference/schema/dto/examples/language.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { validityEntityExample } from "@test/modules/shared/schema/dto/examples/validity-entity.dto.example.ts";

/** The contract shape of ValueLabel, for generated tests. */
export const valueLabelExample: ContractExample = contractExample({
  name: "ValueLabel",
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "labelKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ValueLabelKind) },
    },
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "valueId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "validFrom" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validUntil" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validFrom" },
          operator: "less-than",
          right: { field: "validUntil" },
        },
      ],
    },
  ],
});
