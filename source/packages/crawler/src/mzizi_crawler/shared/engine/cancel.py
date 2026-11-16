"""A process-wide stop request: a signal asks the crawl to finish what it has and stop, never to be cut mid-save."""

from __future__ import annotations

import threading

CANCEL = threading.Event()
