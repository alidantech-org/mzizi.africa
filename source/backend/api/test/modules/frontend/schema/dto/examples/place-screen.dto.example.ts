import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { articleLinkExample } from "@test/modules/frontend/schema/dto/examples/article-link.dto.example.ts";
import { countryLinkExample } from "@test/modules/frontend/schema/dto/examples/country-link.dto.example.ts";
import { eventLinkExample } from "@test/modules/frontend/schema/dto/examples/event-link.dto.example.ts";
import { figureExample } from "@test/modules/frontend/schema/dto/examples/figure.dto.example.ts";
import { languageOptionExample } from "@test/modules/frontend/schema/dto/examples/language-option.dto.example.ts";
import { leaderExample } from "@test/modules/frontend/schema/dto/examples/leader.dto.example.ts";
import { placeLinkExample } from "@test/modules/frontend/schema/dto/examples/place-link.dto.example.ts";
import { projectLinkExample } from "@test/modules/frontend/schema/dto/examples/project-link.dto.example.ts";

/** The contract shape of PlaceScreen, for generated tests. */
export const placeScreenExample: ContractExample = contractExample({
  name: "PlaceScreen",
  fields: [
    {
      name: "articles",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => articleLinkExample },
    },
    {
      name: "breadcrumb",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeLinkExample },
    },
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeLinkExample },
    },
    {
      name: "country",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => countryLinkExample },
    },
    {
      name: "events",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => eventLinkExample },
    },
    {
      name: "figures",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => figureExample },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "languages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageOptionExample },
    },
    {
      name: "leaders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeLinkExample },
    },
    {
      name: "projects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectLinkExample },
    },
  ],
  invariants: [],
});
