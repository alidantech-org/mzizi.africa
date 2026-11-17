/** Stable research input references and inspectable source lineage. */
import {
  body,
  failure,
  failureProfile,
  field,
  group,
  http,
  mapFailure,
  operation,
  property,
  ref,
  schema,
} from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p, transportSchemas } from "#/schemas/_shared.ts";
import { engineShared } from "./engine.ts";

const { ServiceKey, JobId, Blurb } = engineShared;
const research = group({ name: "research" }).description("Research artifacts from the engine run store.");
const { ArtifactChanged, ArtifactExpired, ArtifactTooLarge, BackendUnavailable } = research.failures({
  ArtifactChanged: failure("artifact_changed").payload(ref(transportSchemas.ApiError)),
  ArtifactExpired: failure("artifact_expired").payload(ref(transportSchemas.ApiError)),
  ArtifactTooLarge: failure("artifact_too_large").payload(ref(transportSchemas.ApiError)),
  BackendUnavailable: failure("artifact_backend_unavailable").payload(ref(transportSchemas.ApiError)),
});
const failures = failureProfile().http(
  mapFailure(f.Unauthorized, 401),
  mapFailure(f.Forbidden, 403),
  mapFailure(f.NotFound, 404),
  mapFailure(ArtifactChanged, 409),
  mapFailure(ArtifactExpired, 410),
  mapFailure(ArtifactTooLarge, 413),
  mapFailure(f.ValidationError, 422),
  mapFailure(BackendUnavailable, 503),
);
const artifacts = research
  .feature("Artifacts")
  .description("Read verified run artifact provenance.")
  .failureDefaults(failures);
const { ArtifactPath } = research.properties({
  ArtifactPath: property.string().length({ min: 1, max: 2048 }),
});
const { ArtifactRef } = artifacts.schemas({
  ArtifactRef: schema({ run_id: field(JobId), path: field(ArtifactPath), sha256: field(p.Sha256) }),
});
const { ArtifactMetadata } = artifacts.schemas({
  ArtifactMetadata: schema({
    artifact: field(ArtifactRef),
    size: field(p.NonNegativeInteger),
    media_type: field(Blurb),
    stage: field(Blurb),
    source_url: field(Blurb).nullable(),
    derived_from: field(ArtifactPath).array(),
  }),
});
const InspectArtifact = artifacts.operation(
  "InspectArtifact",
  operation()
    .role("detail")
    .description("Verify the bytes at an exact artifact reference and return their provenance.")
    .input({ ref: ArtifactRef })
    .output(ArtifactMetadata)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/research/inspect").input(input.ref, body()).output(output),
    })),
);

export const researchApi = { research, InspectArtifact };
