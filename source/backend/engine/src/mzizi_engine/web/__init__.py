"""Web access for the engine: identified HTTP, a swappable browser adapter, a bounded crawler, safe downloads, search.

All I/O lives here (packages stay pure). Everything honors robots.txt and the collection policy; a block or challenge
is handled by a configurable policy (back off, slow down, skip, stop, or let a person complete it in a visible
browser), never by disguising the client.
"""
