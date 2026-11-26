"""Translate pending texts tier by tier: curated, glossary, then machine. A text takes the first tier that can translate it."""

from __future__ import annotations

from collections.abc import Sequence

from mzizi_patterns.features.tokenise.tokenise import normalise
from mzizi_translation.features.engines.ports import ProvenanceSink, TextStore, TranslationEngine
from mzizi_translation.features.glossary.glossary import Glossary, GlossaryEntry
from mzizi_translation.features.protect.protect import mask, unmask
from mzizi_translation.features.quality.checks import check, similarity
from mzizi_translation.shared.contracts import TIER_ORDER, Draft, Flag, RunOptions, RunReport, TextUnit, Tier

GLOSSARY_ENGINE = "glossary"


def _glossary_pass(units: Sequence[TextUnit], glossary: Glossary) -> dict[str, Draft]:
    """Whole-text matches against the glossary entry that applies in each text's own context."""
    out: dict[str, Draft] = {}
    by_context: dict[str, dict[str, GlossaryEntry]] = {}
    for unit in units:
        entry = by_context.setdefault(unit.context, glossary.resolve(unit.context)).get(
            normalise(" ".join(unit.text.split()))
        )
        if entry is None:
            continue
        flags = check(unit.text, entry.target, unit.protected, None)
        if entry.context and entry.context != unit.context:
            flags = (*flags, Flag.CONTEXT_FALLBACK)
        out[unit.key] = Draft(
            key=unit.key,
            text=entry.target,
            tier=Tier.GLOSSARY,
            engine=GLOSSARY_ENGINE,
            version=str(len(glossary.entries)),
            flags=flags,
        )
    return out


def _machine(
    engine: TranslationEngine, units: Sequence[TextUnit], glossary: Glossary | None, options: RunOptions
) -> dict[str, Draft]:
    """Machine translation with protected spans masked; a unit whose tokens were lost is retried as it was written."""
    out: dict[str, Draft] = {}
    src, tgt = options.source_language, options.target_language
    for i in range(0, len(units), options.batch_size):
        batch = units[i : i + options.batch_size]
        masked = [mask(u.text, glossary if options.mask_glossary else None, u.context) for u in batch]
        results = engine.translate([m.text for m in masked], src, tgt)
        retry: list[TextUnit] = []
        for unit, m, result in zip(batch, masked, results, strict=True):
            if result is None:
                continue
            text, complete = unmask(m, result)
            if complete:
                out[unit.key] = Draft(
                    key=unit.key,
                    text=text,
                    tier=Tier.MACHINE,
                    engine=engine.name,
                    version=engine.version,
                    flags=check(unit.text, text, unit.protected, glossary, unit.context),
                )
            else:
                retry.append(unit)
        if retry:
            for unit, result in zip(retry, engine.translate([u.text for u in retry], src, tgt), strict=True):
                if result is not None:
                    flags = (Flag.MASKS_LOST, *check(unit.text, result, unit.protected, glossary, unit.context))
                    out[unit.key] = Draft(
                        key=unit.key,
                        text=result,
                        tier=Tier.MACHINE,
                        engine=engine.name,
                        version=engine.version,
                        flags=flags,
                    )
    return out


def _back_check(
    engine: TranslationEngine, drafts: dict[str, Draft], units: dict[str, TextUnit], options: RunOptions
) -> dict[str, Draft]:
    keys = [k for k, d in drafts.items() if d.tier == Tier.MACHINE and Flag.EMPTY not in d.flags]
    if not keys or not engine.supports(options.target_language, options.source_language):
        return drafts
    back = engine.translate([drafts[k].text for k in keys], options.target_language, options.source_language)
    for key, text in zip(keys, back, strict=True):
        if text is not None and similarity(units[key].text, text) < options.back_check_threshold:
            d = drafts[key]
            drafts[key] = d.model_copy(update={"flags": (*d.flags, Flag.BACK_MISMATCH)})
    return drafts


def run_stream(
    store: TextStore,
    engines: Sequence[TranslationEngine],
    glossary: Glossary | None,
    stream: str,
    options: RunOptions,
    *,
    apply: bool,
    provenance: ProvenanceSink | None = None,
) -> RunReport:
    units = store.pending(stream, options.source_language, options.target_language, options.limit)
    by_key = {u.key: u for u in units}
    drafts: dict[str, Draft] = {}
    usable = [e for e in engines if e.supports(options.source_language, options.target_language)]
    for tier in (t for t in TIER_ORDER if t in options.tiers):
        left = [u for u in units if u.key not in drafts]
        if tier == Tier.GLOSSARY:
            if glossary is not None and glossary.entries:
                drafts.update(_glossary_pass(left, glossary))
            left = [u for u in left if u.key not in drafts]
        for engine in (e for e in usable if e.tier == tier):
            if not left:
                break
            if tier == Tier.MACHINE:
                found = _machine(engine, left, glossary, options)
            else:
                found = {}
                for unit, result in zip(
                    left,
                    engine.translate([u.text for u in left], options.source_language, options.target_language),
                    strict=True,
                ):
                    if result is not None:
                        found[unit.key] = Draft(
                            key=unit.key,
                            text=result,
                            tier=tier,
                            engine=engine.name,
                            version=engine.version,
                            flags=check(unit.text, result, unit.protected, None),
                        )
            drafts.update(found)
            if tier == Tier.MACHINE and options.back_check_threshold > 0:
                drafts = _back_check(engine, drafts, by_key, options)
            left = [u for u in left if u.key not in drafts]
    ordered = tuple(drafts[u.key] for u in units if u.key in drafts)
    saved = 0
    if apply and ordered:
        saved = store.save(stream, options.source_language, options.target_language, ordered)
        if provenance is not None:
            provenance.record(stream, options.source_language, options.target_language, ordered)
    return RunReport(
        stream=stream,
        pending=len(units),
        drafts=ordered,
        untranslated=tuple(u.key for u in units if u.key not in drafts),
        saved=saved,
        applied=apply,
    )
