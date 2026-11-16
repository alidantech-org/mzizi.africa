"""Exact derivation relations: which file version was derived from which. Only the relationship is recorded here."""

from __future__ import annotations

from mzizi_filesystem.features.registry.ports import RegistryRepository
from mzizi_filesystem.shared.contracts import RelationRecord


class LineageError(ValueError):
    """The relation is impossible: a missing version, a self-relation or a cycle."""


def relate(repository: RegistryRepository, relation: RelationRecord) -> bool:
    """Record that one exact version was derived from another. `False` when the same relation already exists."""
    if relation.source_version_id == relation.derived_version_id:
        raise LineageError("a version cannot be derived from itself")
    with repository.transaction():
        for version_id in (relation.source_version_id, relation.derived_version_id):
            if repository.get_version(version_id) is None:
                raise LineageError(f"version {version_id} does not exist")
        if _reaches(repository, relation.derived_version_id, relation.source_version_id):
            raise LineageError("this relation would make a version derive from its own derivative")
        return repository.add_relation(relation)


def ancestry(repository: RegistryRepository, version_id: str, limit: int) -> tuple[RelationRecord, ...]:
    """Every relation on the way back to the originals, nearest first, up to `limit` relations."""
    frontier, seen = [version_id], {version_id}
    found: list[RelationRecord] = []
    while frontier and len(found) < limit:
        for relation in repository.relations_to(frontier.pop(0)):
            found.append(relation)
            if relation.source_version_id not in seen:
                seen.add(relation.source_version_id)
                frontier.append(relation.source_version_id)
    return tuple(found[:limit])


def derivatives(repository: RegistryRepository, version_id: str) -> tuple[RelationRecord, ...]:
    """Relations to the versions directly derived from this one."""
    return repository.relations_from(version_id)


def _reaches(repository: RegistryRepository, start: str, target: str) -> bool:
    frontier, seen = [start], {start}
    while frontier:
        for relation in repository.relations_from(frontier.pop()):
            if relation.derived_version_id == target:
                return True
            if relation.derived_version_id not in seen:
                seen.add(relation.derived_version_id)
                frontier.append(relation.derived_version_id)
    return False
