"""Shared Mzizi contracts: provenance, time, verification, codes, jurisdiction and failures.

Every domain group reuses these so evidence, time and place are part of each record from the
start (AGENTS.md sections 4 to 6). Nothing here names a country: Kenya is data scoped to a
jurisdiction, not part of the contract.
"""

from __future__ import annotations

from dryv_author import dryv, failure, field, prop, schema, storage

shared = dryv.group("Shared").description(
    "Provenance, historical time, verification, business codes, jurisdiction and failures."
)

common = shared.properties(
    {
        "Id": prop.string.ulid(),
        # Hierarchical business code such as "ke/nairobi/westlands"; the first segment is the
        # jurisdiction code, so the code is stable and human-readable across countries.
        "BusinessCode": prop.string().length(min=2, max=200),
        "JurisdictionCode": prop.string().length(min=2, max=40),
        "Name": prop.string().length(min=1, max=300),
        "Description": prop.string().length(max=4000),
        "Url": prop.string.uri(),
        "Checksum": prop.string().length(min=64, max=64),
        "Instant": prop.temporal.instant(precision="second"),
        "Date": prop.temporal.date(),
        "Confidence": prop.number.probability(),
        "Flag": prop.boolean(),
        "Version": prop.number.positive_integer(),
        "Count": prop.number.non_negative_integer(),
        "Text": prop.string(),
    }
)

enums = shared.properties(
    {
        # How a value came to be known: never optional (AGENTS.md section 4).
        "ProvenanceMethod": prop.enum(
            {
                "extracted": "extracted",
                "inferred": "inferred",
                "curated": "curated",
                "ai_assisted": "ai_assisted",
            }
        ),
        "VerificationState": prop.enum(
            {
                "unverified": "unverified",
                "under_review": "under_review",
                "verified": "verified",
                "disputed": "disputed",
                "superseded": "superseded",
                "rejected": "rejected",
            }
        ),
        # Precision of an uncertain or approximate date.
        "DatePrecision": prop.enum(
            {
                "exact": "exact",
                "month": "month",
                "year": "year",
                "decade": "decade",
                "century": "century",
                "approximate": "approximate",
            }
        ),
    }
)

failures = shared.failures(
    {
        "NotFound": failure("not_found").description("The requested record does not exist."),
        "Forbidden": failure("forbidden").description("The caller's role does not permit this action."),
        "Invalid": failure("invalid").description("The request failed validation."),
        "Conflict": failure("conflict").description("The request conflicts with the current record version."),
    }
)

blocks = shared.feature("Blocks")
types = blocks.schemas(
    {
        # Where a claim came from. A source artifact is referenced, never copied, so raw
        # evidence is preserved in the files service.
        "Provenance": schema(
            {
                "sourceName": field(common.Name),
                "sourceReference": field(common.Description).optional(),
                "sourceUrl": field(common.Url).optional(),
                "artifactId": field(common.Id).optional(),
                "artifactChecksum": field(common.Checksum).optional(),
                "retrievedAt": field(common.Instant).optional(),
                "method": field(enums.ProvenanceMethod),
                "toolOrModel": field(common.Name).optional(),
                "confidence": field(common.Confidence).optional(),
                "licence": field(common.Name).optional(),
            }
        ).role("embedded"),
        # Historical validity, kept separate from when the record was observed or stored.
        "ValidTime": schema(
            {
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "fromPrecision": field(enums.DatePrecision).optional(),
                "toPrecision": field(enums.DatePrecision).optional(),
            }
        ).role("embedded"),
        "RecordTime": schema(
            {
                "recordedAt": field(common.Instant).system(),
                "supersededAt": field(common.Instant).optional(),
                "version": field(common.Version).default(1),
                "previousVersionId": field(common.Id).optional(),
                "isCurrent": field(common.Flag).default(True),
            }
        ).role("embedded"),
        "Verification": schema(
            {
                "state": field(enums.VerificationState).default("unverified"),
                "reviewedBy": field(common.Name).optional(),
                "reviewedAt": field(common.Instant).optional(),
                "notes": field(common.Description).optional(),
            }
        ).role("embedded"),
        # A jurisdiction is a record; countries and historical polities are the same kind of
        # thing and may overlap or change over time.
        "Jurisdiction": schema(
            {
                "id": field(common.Id).system(),
                "code": field(common.JurisdictionCode),
                "name": field(common.Name),
                "kind": field(common.Name),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
            }
        )
        .role("entity")
        .facets(storage=storage("jurisdictions").primary_key("id")),
        # Jurisdiction- and period-scoped vocabulary entry: levels, institution types, election
        # types, selection methods, fiscal stages and so on are rows here, not enums or columns.
        "ClassificationRecord": schema(
            {
                "id": field(common.Id).system(),
                "jurisdictionId": field(common.Id).relation(
                    target=lambda: types.Jurisdiction.field("id"),
                    cardinality="many-to-one",
                    on_delete="restrict",
                ),
                "scheme": field(common.BusinessCode),
                "code": field(common.BusinessCode),
                "label": field(common.Name),
                "order": field(common.Count).optional(),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "legalBasis": field(common.Description).optional(),
            }
        )
        .role("entity")
        .facets(storage=storage("classification_records").primary_key("id")),
        "Page": schema(
            {
                "offset": field(common.Count),
                "limit": field(common.Version),
                "total": field(common.Count),
            }
        ).role("response"),
    }
)
