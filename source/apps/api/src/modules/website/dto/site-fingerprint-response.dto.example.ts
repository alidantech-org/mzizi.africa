import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteFingerprintPublicExample } from "#/modules/website/dto/site-fingerprint-public.dto.example.ts";

/** The contract shape of SiteFingerprintResponse, for generated tests. */
export const siteFingerprintResponseExample: ContractExample = contractExample({
  name: "SiteFingerprintResponse",
  fields: [
    {
      name: "siteFingerprint",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteFingerprintPublicExample },
    },
  ],
  invariants: [
  ],
});