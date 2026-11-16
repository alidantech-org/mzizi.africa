"""The engine's single configuration: sections, aliases of the variables the root .env already carries, and clear errors."""

from __future__ import annotations

from pathlib import Path

import pytest

from mzizi_engine.config import ConfigError, EngineConfig, parse_env

DOTENV = {
    "DATABASE_WRITE_URL": "postgres://writer@localhost/mzizi",
    "DATABASE_URL": "postgres://reader@localhost/mzizi",
    "S3_ENDPOINT": "http://s3.local:8333",
    "S3_PUBLIC_ORIGIN": "https://files.example",
    "AWS_ACCESS_KEY_ID": "id",
    "AWS_SECRET_ACCESS_KEY": "secret",
    "AWS_DEFAULT_REGION": "us-east-1",
    "MZIZI_USER_AGENT": "Bot/1 (+https://x.org/bot; a@x.org)",
}


def test_the_variables_already_in_the_root_env_fill_postgres_and_s3_sections() -> None:
    config = EngineConfig.from_env({**DOTENV, "S3_BUCKET": "files"})
    assert config.postgres is not None and config.postgres.url.endswith("/mzizi") and "writer" in config.postgres.url
    assert (
        config.s3 is not None
        and config.s3.public_endpoint == "https://files.example"
        and config.s3.region == "us-east-1"
    )
    assert config.crawler.user_agent and config.mongo is None and config.vector is None


def test_a_missing_section_is_none_and_requiring_it_names_every_variable() -> None:
    config = EngineConfig.from_env({})
    assert config.postgres is None and config.s3 is None and config.filesystem is None
    with pytest.raises(ConfigError, match="DATABASE_WRITE_URL"):
        config.require_postgres()
    with pytest.raises(ConfigError) as problem:
        config.require_filesystem()
    for name in ("DATABASE_WRITE_URL", "FILESYSTEM_TEMP_PREFIX", "S3_BUCKET"):
        assert name in str(problem.value)


def test_the_filesystem_section_needs_rules_and_an_object_store_or_the_memory_store() -> None:
    rules = {
        "FILESYSTEM_PROTECTED_PREFIXES": "vault/",
        "FILESYSTEM_RESERVED_ROOTS": "-",
        "FILESYSTEM_TEMP_PREFIX": "private/tmp/",
    }
    memory = EngineConfig.from_env({**DOTENV, **rules, "ENGINE_STORE_MEMORY": "1"})
    _, filesystem, s3 = memory.require_filesystem()
    assert s3 is None and filesystem.reserved_roots == () and filesystem.protected_prefixes == ("vault/",)
    with pytest.raises(ConfigError, match="S3_BUCKET"):
        EngineConfig.from_env({**DOTENV, **rules}).require_filesystem()


def test_the_server_section_keeps_its_checks_and_search_reports_what_is_missing() -> None:
    config = EngineConfig.from_env({"ENGINE_CAPABILITY_LIMITS": "crawler=2", "BRAVE_API_KEY": "k"})
    assert config.server.limits == {"crawler": 2} and config.search_missing("brave") == []
    assert config.search_missing("google") == ["GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ID"]


def test_load_reads_the_env_file_without_overriding_the_environment(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    file = tmp_path / ".env"
    file.write_text('# comment\nexport MZIZI_MONGO_URL="mongodb://a"\nMZIZI_MONGO_DATABASE=fromfile\n')
    monkeypatch.setenv("MZIZI_MONGO_DATABASE", "fromenv")
    monkeypatch.delenv("MZIZI_MONGO_URL", raising=False)
    config = EngineConfig.load(file)
    assert config.require_mongo().url == "mongodb://a" and config.require_mongo().database == "fromenv"
    assert parse_env("A=1\nB='two words'\nC=\"x\"") == {"A": "1", "B": "two words", "C": "x"}
