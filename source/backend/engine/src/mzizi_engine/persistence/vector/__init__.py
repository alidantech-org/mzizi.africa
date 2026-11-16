"""Vector persistence: a skeleton. Nothing is implemented yet; this fixes the shape the implementation will take.

The engine will own one vector store (for semantic matching of names, places and documents). A caller depends on the
`VectorStore` protocol below and on the typed points and hits, never on a client library. `UnimplementedVectorStore` is the
only implementation today and refuses every call, so a mistaken use fails loudly and not silently.
"""

from mzizi_engine.persistence.vector.port import (
    UnimplementedVectorStore,
    VectorHit,
    VectorNotImplementedError,
    VectorPoint,
    VectorStore,
)

__all__ = ["UnimplementedVectorStore", "VectorHit", "VectorNotImplementedError", "VectorPoint", "VectorStore"]
