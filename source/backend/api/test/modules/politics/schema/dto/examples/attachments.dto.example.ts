import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { articlesExample } from "@test/modules/media/schema/dto/examples/articles.dto.example.ts";
import { assetsExample } from "@test/modules/media/schema/dto/examples/assets.dto.example.ts";
import { commitmentsExample } from "@test/modules/politics/schema/dto/examples/commitments.dto.example.ts";
import { fulfilmentsExample } from "@test/modules/politics/schema/dto/examples/fulfilments.dto.example.ts";
import { manifestosExample } from "@test/modules/politics/schema/dto/examples/manifestos.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Attachments, for generated tests. */
export const attachmentsExample: ContractExample = contractExample({
  name: "Attachments",
  fields: [
    {
      name: "articleId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "assetId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "commitmentId",
      optional: true,
      nullable: true,
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
      name: "endSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "fulfilmentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "manifestoId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: true,
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
      name: "startSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
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
