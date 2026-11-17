"""Replay verified bytes using the existing crawler evidence checks."""

from pathlib import Path
from tempfile import TemporaryDirectory

from mzizi_crawler import CrawlerOrchestrator, PdfReplay, ReplaySuite, ReplayView
from mzizi_engine.runtime.contracts.artifact_replay import ArtifactReplayReport, ArtifactReplayRequest, HtmlChecks
from mzizi_engine.runtime.runs.artifacts import ArtifactAccess, ArtifactReader, ArtifactReadError


def replay_artifact(
    reader: ArtifactReader, access: ArtifactAccess, request: ArtifactReplayRequest
) -> ArtifactReplayReport:
    evidence, data = reader.read(request.artifact, access)
    url = evidence.source_url or f"urn:sha256:{evidence.artifact.sha256}"
    checks = request.checks
    media_type = "text/html" if isinstance(checks, HtmlChecks) else "application/pdf"
    if evidence.media_type != media_type:
        raise ArtifactReadError(422, "Replay checks do not match the artifact media type")
    with TemporaryDirectory() as temporary:
        base = Path(temporary)
        capture = base / "capture"
        capture.write_bytes(data)
        if isinstance(checks, HtmlChecks):
            suite = ReplaySuite(
                views=(ReplayView(html=capture.name, url=url, selectors=checks.selectors, cells=checks.cells),)
            )
        else:
            suite = ReplaySuite(pdfs=(PdfReplay(pdf=capture.name, url=url, pages=checks.pages, cells=checks.cells),))
        report = CrawlerOrchestrator.replay.evaluate_replay(suite, base)
    return ArtifactReplayReport(evidence=evidence, report=report)
