"""Parse dotenv text at the engine configuration boundary."""


def parse_env(text: str) -> dict[str, str]:
    """`KEY=value` lines; comments, blank lines, `export`, matching quotes and multi-line quoted values (PEM keys)."""
    values: dict[str, str] = {}
    lines = iter(text.splitlines())
    for raw in lines:
        line = raw.strip().removeprefix("export ").strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip()
        if value[:1] in "\"'" and not (len(value) > 1 and value.endswith(value[0])):
            quote, parts = value[0], [value[1:]]
            for more in lines:
                if more.rstrip().endswith(quote):
                    parts.append(more.rstrip()[:-1])
                    break
                parts.append(more)
            value = "\n".join(parts)
        elif value[:1] in "\"'" and value.endswith(value[0]):
            value = value[1:-1]
        values[key.strip()] = value
    return values
