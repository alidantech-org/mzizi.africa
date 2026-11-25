import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { LinkKind } from "#/modules/history/schema/enum/link-kind.enum.ts";
import { occurrencesExample } from "@test/modules/history/schema/dto/examples/occurrences.dto.example.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";

/** The contract shape of Links, for generated tests. */
export const linksExample: ContractExample = contractExample({
  name: "Links",
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
      name: "fromId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LinkKind) },
    },
    {
      name: "toId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
    {
      any: false,
      comparisons: [
        {
          left: { field: "fromId" },
          operator: "not-equal",
          right: { field: "toId" },
        },
      ],
    },
  ],
});
