"""How operations and results are shown: a table for people, plain JSON for scripts."""

from __future__ import annotations

import json
from collections.abc import Sequence

from rich.table import Table

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime import OperationInfo


def operations_table(items: Sequence[OperationInfo]) -> Table:
    table = Table(title="Exposed operations", header_style="accent")
    for column in ("Name", "Version", "Package", "CPU", "Description"):
        table.add_column(column, overflow="fold")
    for item in items:
        table.add_row(item.name, item.version, item.package, "yes" if item.cpu_bound else "", item.description)
    return table


def operations_json(items: Sequence[OperationInfo]) -> str:
    return json.dumps([item.model_dump(mode="json") for item in items], indent=2)


def result_json(result: Payload) -> str:
    return json.dumps(result, indent=2, default=str)
