import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AssetKind } from "#/modules/media/schema/enum/asset-kind.enum.ts";
import { useEntryCaptionsExample } from "@test/modules/media/schema/dto/examples/use-entry-captions.dto.example.ts";

/** The contract shape of UseEntry, for generated tests. */
export const useEntryExample: ContractExample = contractExample({
  name: "UseEntry",
  fields: [
    {
      name: "assetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "captions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => useEntryCaptionsExample },
    },
    {
      name: "embedUrl",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "externalUrl",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "height",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AssetKind) },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "purposeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "s3Key",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
    {
      name: "thumbnailUrl",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "width",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
