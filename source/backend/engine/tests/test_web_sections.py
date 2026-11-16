"""Exercise the sections capability on HTTP and on actual local browser interactions."""

from __future__ import annotations

import json
from pathlib import Path

from typer.testing import CliRunner

from mzizi_cli.orchestrator.app import app
from mzizi_engine.web.handlers.sections import SectionsReport

STATIC = """
<nav><button data-toggle="collapse" data-target="#menu">Menu</button>
<div id="menu"><a href="/other">Other</a></div></nav>
<ul class="nav-tabs"><li><a href="#current" data-toggle="tab">Current</a></li>
<li><a href="#previous" data-toggle="tab">Previous</a></li></ul>
<div id="current" class="tab-pane active"><table><tr><th>Title</th><th>Source</th></tr>
<tr><td>Current record</td><td><a href="/report.pdf"><i></i></a></td></tr></table></div>
<div id="previous" class="tab-pane" hidden><table><tr><th>Title</th><th>Source</th></tr>
<tr><td>Earlier record</td><td>None</td></tr></table></div>
"""

DYNAMIC = """
<div role="tablist"><button type="button" role="tab" aria-controls="async" aria-selected="false" id="open">
Results</button></div>
<section role="tabpanel" id="async" hidden><span role="status">Loading</span></section>
<script>
const open = document.getElementById('open');
const panel = document.getElementById('async');
let current = 1;
function show() {
  panel.innerHTML = '<table><tr><th>Record</th><th>Value</th></tr><tr><td>Record ' + current +
    '</td><td>Available</td></tr></table><nav class="pagination"><button type="button" aria-label="Next page"' +
    (current === 3 ? ' disabled' : '') + '>Next</button></nav>';
  panel.querySelector('button').onclick = () => { current++; setTimeout(show, 80); };
}
open.onclick = () => {
  open.setAttribute('aria-selected', 'true'); panel.hidden = false; setTimeout(show, 80);
};
</script>
"""


def _run(root: Path, url: str, *flags: str) -> tuple[SectionsReport, Path]:
    result = CliRunner().invoke(app, ["--no-input", "--json", "web", "sections", url, *flags])
    assert result.exit_code == 0, result.output
    report = SectionsReport.model_validate(json.loads(result.output))
    runs = list(root.glob("runs/*/*-web-sections"))
    assert len(runs) == 1
    return report, runs[0]
