"""Create the fetch transport trust store with an optional source-specific CA bundle."""

import ssl
from pathlib import Path


def trust_store(extra: Path | None) -> ssl.SSLContext | bool:
    """The system trust store plus one extra CA bundle (for a site that sends an incomplete certificate chain)."""
    if extra is None:
        return True
    context = ssl.create_default_context()
    context.load_verify_locations(cafile=str(extra))
    return context
