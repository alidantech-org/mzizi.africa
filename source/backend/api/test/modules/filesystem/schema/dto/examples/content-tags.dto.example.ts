import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentsExample } from "@test/modules/filesystem/schema/dto/examples/contents.dto.example.ts";
import { tagsExample } from "@test/modules/filesystem/schema/dto/examples/tags.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of ContentTags, for generated tests. */
export const contentTagsExample: ContractExample = contractExample({
  name: "ContentTags",
  fields: [
    {
      name: "contentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
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
      name: "tagId",
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
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
