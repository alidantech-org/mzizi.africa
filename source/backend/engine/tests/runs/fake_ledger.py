"""Typed fake for checking run lifecycle and stage errors without Mongo."""

from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, RunEvent, RunRecord, RunState, RunSummary


class FakeLedger:
    def __init__(self) -> None:
        self.record: RunRecord | None = None
        self.events: list[RunEvent] = []
        self.artifacts: list[ArtifactRecord] = []
        self.summaries: list[RunSummary] = []

    def create(self, record: RunRecord) -> None:
        assert self.record is None
        self.record = record

    def read(self, run_id: UUID) -> RunRecord | None:
        return self.record if self.record and self.record.run_id == run_id else None

    def transition(self, record: RunRecord, *, previous: RunState) -> None:
        assert self.record is not None and self.record.state == previous
        self.record = record

    def append(self, event: RunEvent) -> None:
        self.events.append(event)

    def record_artifact(self, run_id: UUID, record: ArtifactRecord) -> None:
        assert self.read(run_id) is not None
        self.artifacts.append(record)

    def summarize(self, record: RunSummary) -> None:
        self.summaries.append(record)
