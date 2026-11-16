"""Redis atomic host permit state with a separate namespace per engine ledger."""

from typing import cast

from redis import Redis

from mzizi_engine.runtime.runs.governor import STATE_RETENTION_SECONDS, HostSnapshot, HostState

_COMPARE_AND_SET = """
local current = redis.call('GET', KEYS[1]) or ''
if current ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
return 1
"""


class RedisHostStateStore:
    def __init__(self, url: str, namespace: str) -> None:
        self._client = Redis.from_url(url, socket_timeout=3, socket_connect_timeout=3)
        self._namespace = f"mzizi:{namespace}:host-permits:"
        self._client.ping()

    def close(self) -> None:
        self._client.close()

    def read(self, host: str) -> HostSnapshot | None:
        data = cast(bytes | None, self._client.get(self._namespace + host))
        return HostSnapshot(data.decode("utf-8"), HostState.model_validate_json(data)) if data else None

    def compare_and_set(self, host: str, previous: HostSnapshot | None, state: HostState) -> bool:
        return bool(
            self._client.eval(
                _COMPARE_AND_SET,
                1,
                self._namespace + host,
                previous.revision if previous else "",
                state.model_dump_json(),
                STATE_RETENTION_SECONDS,
            )
        )
