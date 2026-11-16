"""One site's saved pages: hashed, versioned only when something meaningful changes, tracked in MongoDB.

Every page is saved the moment it is fetched, so an interrupted crawl keeps what it got. Files are written to a
temporary name and renamed into place; archived versions are named by content hash, so no write can overwrite
different content. A visit that finds the same content writes nothing but counters. A meaningful change moves the previous files into
`versions/` and writes the new ones, with a note of what changed. Page state lives in MongoDB (`sites`, `pages`,
`page_versions`, `generated_files`); without MongoDB it lives in `state.json` beside the pages.
"""

from mzizi_crawler.shared.sitestore.files import atomic_write, front_matter
from mzizi_crawler.shared.sitestore.models import Outcome, PageState, Visit
from mzizi_crawler.shared.sitestore.store import SiteStore
from mzizi_crawler.shared.sitestore.writer import SiteWriter

__all__ = ["Outcome", "PageState", "SiteStore", "SiteWriter", "Visit", "atomic_write", "front_matter"]
