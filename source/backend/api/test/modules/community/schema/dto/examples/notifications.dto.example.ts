import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { occurrencesExample } from "@test/modules/event/schema/dto/examples/occurrences.dto.example.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { keysExample } from "@test/modules/product/schema/dto/examples/keys.dto.example.ts";
import { countriesExample } from "@test/modules/reference/schema/dto/examples/countries.dto.example.ts";
import { partitionedRecordExample } from "@test/modules/shared/schema/dto/examples/partitioned-record.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Notifications, for generated tests. */
export const notificationsExample: ContractExample = contractExample({
  name: "Notifications",
  fields: [
    {
      name: "createdAt",
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
      name: "identityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "keyId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "occurrenceId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "postCountryId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "postId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
