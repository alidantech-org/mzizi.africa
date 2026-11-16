"""Site profiles and family comparison: summaries that help a person or agent author a site structure."""

from mzizi_crawler.shared.scraping.profile.build import build_profile
from mzizi_crawler.shared.scraping.profile.family import compare_profiles, host_variable
from mzizi_crawler.shared.scraping.profile.models import (
    FamilyReport,
    PageInput,
    RepeatedBlock,
    Section,
    SiteProfile,
    Template,
)

__all__ = [
    "FamilyReport",
    "PageInput",
    "RepeatedBlock",
    "Section",
    "SiteProfile",
    "Template",
    "build_profile",
    "compare_profiles",
    "host_variable",
]
