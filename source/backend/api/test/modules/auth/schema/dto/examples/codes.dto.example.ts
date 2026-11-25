import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { CodeChannel } from "#/modules/auth/schema/enum/code-channel.enum.ts";
import { CodePurpose } from "#/modules/auth/schema/enum/code-purpose.enum.ts";
import { loginsExample } from "@test/modules/auth/schema/dto/examples/logins.dto.example.ts";
import { createdExample } from "@test/modules/shared/schema/dto/examples/created.dto.example.ts";

/** The contract shape of Codes, for generated tests. */
export const codesExample: ContractExample = contractExample({
  name: "Codes",
  fields: [
    {
      name: "attempts",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 100 },
    },
    {
      name: "channel",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CodeChannel) },
    },
    {
      name: "consumedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "digest",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
    {
      name: "expiresAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "loginId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "purpose",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CodePurpose) },
    },
    {
      name: "value",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 3, maxLength: 320 },
    },
  ],
  invariants: [],
});
