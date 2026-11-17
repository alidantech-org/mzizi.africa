"""Extract a bounded PDF table draft and check its mappings against generated seed contracts."""

from __future__ import annotations

import csv
from io import StringIO

from mzizi_engine.runtime.assembly.seed_catalog import project_seed_catalog
from mzizi_engine.runtime.contracts.seed_catalog import SeedCatalogRequest
from mzizi_engine.runtime.contracts.table_draft import (
    DraftIssue,
    DraftLookup,
    DraftRow,
    TableDraftReport,
    TableDraftRequest,
    TableLocator,
)
from mzizi_engine.runtime.runs.artifacts import ArtifactAccess, ArtifactReader, ArtifactReadError
from mzizi_extraction import DocumentProfile, TableColumn, TableSchema, extract_pdf_document
from mzizi_extraction.document.models import TableBlock
from mzizi_manifest.features.codes.grammar import segments_problem
from mzizi_manifest.features.data.check import seed_value_problem
from mzizi_manifest.features.database.tables import load_tables


def _reference_codes(data: bytes, lookup: DraftLookup) -> dict[str, set[str]]:
    try:
        reader = csv.DictReader(StringIO(data.decode("utf-8-sig")), strict=True)
        fields = reader.fieldnames
        if not fields or len(fields) != len(set(fields)) or not {lookup.name_column, lookup.code_column} <= set(fields):
            raise ArtifactReadError(422, "Reference CSV must have unique headings including the chosen name and code")
        codes: dict[str, set[str]] = {}
        for row in reader:
            name, code = row[lookup.name_column], row[lookup.code_column]
            if None in row or None in row.values() or not name or not code or segments_problem(code):
                raise ArtifactReadError(422, f"Malformed reference identity at CSV line {reader.line_num}")
            codes.setdefault(name, set()).add(code)
        return codes
    except (UnicodeDecodeError, csv.Error) as error:
        raise ArtifactReadError(422, "Reference artifact must be a valid UTF-8 CSV") from error


def table_draft(reader: ArtifactReader, access: ArtifactAccess, request: TableDraftRequest) -> TableDraftReport:
    source, data = reader.read(request.source, access)
    reference, names = reader.read(request.lookup.reference, access)
    if source.media_type != "application/pdf" or reference.media_type != "text/csv":
        raise ArtifactReadError(422, "Expected a PDF source artifact and a CSV reference artifact")
    lookup = request.lookup
    if lookup.source_heading not in request.headings:
        raise ArtifactReadError(422, "Lookup heading is absent from the supplied source headings")
    tables = load_tables()
    table = tables.get(request.target_table)
    if table is None or not table.seedable:
        raise ArtifactReadError(422, "Requested table is not seedable")
    columns = {(col.link.alias if col.link else col.name): col for col in table.columns.values()}
    target = columns.get(lookup.target_column)
    reference_table = tables.get(lookup.target_table)
    if (
        target is None
        or lookup.target_column not in table.seed.columns
        or target.link is None
        or reference_table is None
        or target.link.table_id != reference_table.id
    ):
        raise ArtifactReadError(422, "Lookup target must be a generated seed link to the specified reference table")
    bound = {lookup.target_column}
    for binding in request.bindings:
        column = columns.get(binding.target_column)
        if (
            binding.source_heading not in request.headings
            or binding.target_column not in table.seed.columns
            or binding.target_column in bound
            or column is None
            or column.link is not None
        ):
            raise ArtifactReadError(422, "Bindings must use known headings and distinct scalar seed columns")
        bound.add(binding.target_column)

    issues = [
        DraftIssue(kind="required", detail=f"Required target column has no mapping: {column}")
        for column in table.seed.required
        if column not in bound
    ]
    represented = {binding.source_heading for binding in request.bindings} | {lookup.source_heading}
    issues.extend(
        DraftIssue(kind="target_gap", detail=f"Source field retained in research draft: {heading}")
        for heading in request.headings
        if heading not in represented
    )
    codes = _reference_codes(names, lookup)
    source_index = request.headings.index(lookup.source_heading)
    document = extract_pdf_document(
        data,
        DocumentProfile(
            first_page=request.first_page,
            last_page=request.last_page,
            languages=request.languages,
            figures=False,
            table_schema=TableSchema(columns=tuple(TableColumn(name=heading) for heading in request.headings)),
        ),
    )
    stream = StringIO(newline="")
    writer = csv.writer(stream, lineterminator="\n")
    writer.writerow(("page", "table", "row", *request.headings, lookup.target_column))
    rows: list[DraftRow] = []
    for page in document.pages:
        for block in page.blocks:
            if not isinstance(block, TableBlock):
                continue
            if not block.rows or block.header_rows != 1 or block.rows[0] != request.headings:
                issues.append(
                    DraftIssue(
                        kind="structure", detail=f"Unmatched table header on page {page.number}, table {block.index}"
                    )
                )
                continue
            for row_number, cells in enumerate(block.rows[1:], start=2):
                locator = TableLocator(page=page.number, table=block.index, row=row_number, bbox=block.bbox)
                if len(cells) != len(request.headings):
                    issues.append(DraftIssue(kind="structure", detail="Row width differs from header", locator=locator))
                    continue
                matches = codes.get(cells[source_index], set())
                code = next(iter(matches)) if len(matches) == 1 else None
                if code is None:
                    issues.append(
                        DraftIssue(
                            kind="ambiguous" if matches else "unresolved",
                            detail=f"Expected one reference code, found {len(matches)}",
                            locator=locator,
                        )
                    )
                for binding in request.bindings:
                    value = cells[request.headings.index(binding.source_heading)]
                    if not value and binding.target_column in table.seed.required:
                        issues.append(DraftIssue(kind="required", detail=binding.target_column, locator=locator))
                    elif value and (problem := seed_value_problem(columns[binding.target_column], value)):
                        issues.append(DraftIssue(kind="invalid_value", detail=problem, locator=locator))
                rows.append(DraftRow(locator=locator, source_cells=cells, resolved_code=code))
                writer.writerow((page.number, block.index, row_number, *cells, code or ""))
    if not rows:
        issues.append(DraftIssue(kind="structure", detail="No data rows matched the expected table headings"))
    return TableDraftReport(
        source=source,
        reference=reference,
        catalog_sha256=project_seed_catalog(tables, SeedCatalogRequest()).sha256,
        target_table=table.qualified_name,
        extraction_status=document.status,
        diagnostics=document.diagnostics,
        issues=tuple(issues),
        rows=tuple(rows),
        csv=stream.getvalue(),
    )
