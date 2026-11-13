import os

from mzizi_engine.filesystem import fetch_secure_file
from mzizi_filesystem.env import load_environment, parse_env
from mzizi_filesystem.store import MemoryObjectStore


def test_parse_env_handles_exports_quotes_and_multiline_values():
    text = 'export A=1\n# c\nB="x y"\nKEY="-----BEGIN\nline\n-----END"\nC=3\n'
    values = parse_env(text)
    assert values["A"] == "1" and values["B"] == "x y" and values["C"] == "3"
    assert values["KEY"] == "-----BEGIN\nline\n-----END"


def test_aws_names_alias_s3_names_without_overriding(tmp_path, monkeypatch):
    env = tmp_path / ".env"
    env.write_text("AWS_ACCESS_KEY_ID=ak\nAWS_SECRET_ACCESS_KEY=sk\nS3_REGION=keep\nAWS_DEFAULT_REGION=other\n")
    for k in (
        "S3_ACCESS_KEY",
        "S3_SECRET_KEY",
        "S3_REGION",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_DEFAULT_REGION",
    ):
        monkeypatch.delenv(k, raising=False)
    load_environment(env)
    assert (os.environ["S3_ACCESS_KEY"], os.environ["S3_SECRET_KEY"], os.environ["S3_REGION"]) == ("ak", "sk", "keep")


class _Conn:
    def __init__(self, row):
        self.row = row

    def execute(self, *_a):
        return self

    def fetchone(self):
        return self.row


def test_fetch_secure_file_verifies_hash_and_uses_private_mode(tmp_path, monkeypatch):
    import hashlib

    monkeypatch.setenv("MZIZI_SECURE_DIR", str(tmp_path))
    store, data = MemoryObjectStore(), b"secret"
    sha = hashlib.sha256(data).hexdigest()
    store.put("private/k", data, "application/octet-stream", sha)
    path = fetch_secure_file(_Conn({"s3_key": "private/k", "sha256": sha}), store, "dev-auth/private.pem")
    assert path.read_bytes() == data and oct(path.stat().st_mode & 0o777) == "0o600"
    import pytest

    with pytest.raises(ValueError):
        fetch_secure_file(_Conn({"s3_key": "private/k", "sha256": "0" * 64}), store, "other.pem")
    with pytest.raises(FileNotFoundError):
        fetch_secure_file(_Conn(None), store, "missing")
