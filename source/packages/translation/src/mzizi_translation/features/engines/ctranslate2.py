"""A local CTranslate2 model (for example a converted NLLB-200 or MADLAD-400), run on the machine's own CPU or GPU.

Nothing is downloaded here: the caller points at a model directory and a SentencePiece model, and names the codes the model
uses for each language. The libraries load on first use, so the package works without them installed.
"""

from __future__ import annotations

import importlib
from collections.abc import Mapping, Sequence

from mzizi_translation.shared.contracts import Tier


class CTranslate2Engine:
    tier = Tier.MACHINE

    def __init__(
        self,
        name: str,
        version: str,
        model_dir: str,
        tokenizer_path: str,
        codes: Mapping[str, str],
        threads: int = 0,
        beam: int = 4,
    ) -> None:
        self.name, self.version = name, version
        self._model_dir, self._tokenizer_path, self._codes, self._threads, self._beam = (
            model_dir,
            tokenizer_path,
            dict(codes),
            threads,
            beam,
        )
        self._translator: object | None = None
        self._spm: object | None = None

    def supports(self, source_language: str, target_language: str) -> bool:
        return source_language in self._codes and target_language in self._codes

    def _load(self) -> None:
        if self._translator is None:
            ct2 = importlib.import_module("ctranslate2")
            spm = importlib.import_module("sentencepiece")
            self._translator = ct2.Translator(self._model_dir, inter_threads=1, intra_threads=self._threads)
            self._spm = spm.SentencePieceProcessor(model_file=self._tokenizer_path)

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
        self._load()
        source, target = self._codes[source_language], self._codes[target_language]
        spm, translator = self._spm, self._translator
        assert spm is not None and translator is not None
        batches = [[source, *spm.encode(t, out_type=str), "</s>"] for t in texts]  # type: ignore[attr-defined]
        results = translator.translate_batch(batches, target_prefix=[[target]] * len(batches), beam_size=self._beam)  # type: ignore[attr-defined]
        out: list[str | None] = []
        for result in results:
            tokens: list[str] = result.hypotheses[0]
            out.append(spm.decode(tokens[1:] if tokens and tokens[0] == target else tokens) or None)  # type: ignore[attr-defined]
        return out
