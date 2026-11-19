import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { leaderProfileActivityExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity.dto.example.ts";
import { leaderProfileContactsExample } from "@test/modules/insights/schema/dto/examples/leader-profile-contacts.dto.example.ts";
import { leaderProfileElectionExample } from "@test/modules/insights/schema/dto/examples/leader-profile-election.dto.example.ts";
import { leaderProfileEvidenceExample } from "@test/modules/insights/schema/dto/examples/leader-profile-evidence.dto.example.ts";
import { leaderProfileLeaderExample } from "@test/modules/insights/schema/dto/examples/leader-profile-leader.dto.example.ts";
import { leaderProfileMediaExample } from "@test/modules/insights/schema/dto/examples/leader-profile-media.dto.example.ts";
import { leaderProfileOfficesExample } from "@test/modules/insights/schema/dto/examples/leader-profile-offices.dto.example.ts";

/** The contract shape of LeaderProfile, for generated tests. */
export const leaderProfileExample: ContractExample = contractExample({
  name: "LeaderProfile",
  fields: [
    {
      name: "activity",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => leaderProfileActivityExample },
    },
    {
      name: "contacts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderProfileContactsExample },
    },
    {
      name: "election",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderProfileElectionExample },
    },
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderProfileEvidenceExample },
    },
    {
      name: "fund",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "leader",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => leaderProfileLeaderExample },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderProfileMediaExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderProfileOfficesExample },
    },
  ],
  invariants: [],
});
