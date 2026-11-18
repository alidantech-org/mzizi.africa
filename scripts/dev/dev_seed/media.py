"""Media for the dev database: images dumped from the scraped government sites into the filesystem registry (bytes under
`.dev/media/`, metadata in filesystem.files and file_versions), and remote media kept as raw URLs (YouTube embeds and
Facebook pages found on the scraped sites, Pexels stock photos, DiceBear avatars). Images are attached to places,
projects and institutions whether or not they show them: they exist to make the interface look like a finished product."""

from __future__ import annotations

import hashlib
import json
import random
import shutil
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import quote

from PIL import Image

from dev_seed.common import ROOT, Feature, Row
from dev_seed.people import Builder
from dev_seed.places import Place
from dev_seed.store import Tables

SITES = ROOT / ".dev/websites/ke/go"
MEDIA_DIR = ROOT / ".dev/media"
PEXELS = [
    3184291,
    3184418,
    1181406,
    1181244,
    3861969,
    3182812,
    1181675,
    1181316,
    2422294,
    3760067,
    2174656,
    1595385,
    1181263,
    1181467,
    4050315,
    3760529,
    3184465,
    3184460,
    1181673,
    247676,
    3225517,
    3255761,
    3772510,
    2174657,
    1181622,
    417074,
    1366919,
    462118,
    3408744,
    1105766,
    2166553,
    3756679,
    1438081,
    2253275,
    1722183,
    3280130,
    3321797,
    1624496,
    1287145,
    1578750,
]
YOUTUBE = [
    "GR9TrDeI01A",
    "B6Fbdh3_Jio",
    "JBxk3iNBJu4",
    "JzAcoNS6itI",
    "MH3RxMz50pA",
    "_BNTf3qt-uU",
    "lIUjRtA04nY",
    "znAaHWrXZf0",
]
SOCIAL = [
    ("facebook", "https://www.facebook.com/ParliamentKE", "Parliament of Kenya on Facebook"),
    ("x", "https://x.com/ParliamentKE", "Parliament of Kenya on X"),
    ("instagram", "https://www.instagram.com/parliamentke/", "Parliament of Kenya on Instagram"),
    ("tiktok", "https://www.tiktok.com/@parliamentke", "Parliament of Kenya on TikTok"),
    ("facebook", "https://www.facebook.com/MinstryofHealthKE", "Ministry of Health on Facebook"),
]
LIMIT = 150


@dataclass(frozen=True)
class Photo:
    name: str
    digest: str
    width: int
    height: int
    site: str


def pexels(photo: int, width: int = 1200) -> str:
    return f"https://images.pexels.com/photos/{photo}/pexels-photo-{photo}.jpeg?auto=compress&cs=tinysrgb&w={width}"


def dicebear(name: str) -> str:
    return f"https://api.dicebear.com/9.x/initials/svg?seed={quote(name)}&backgroundType=gradientLinear&radius=50"


def collect_images() -> list[Photo]:
    """Copy up to LIMIT good photographs from the scraped sites; returns (file name, sha256, width, height, site)."""
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    chosen: list[Photo] = []
    sites = sorted(p for p in SITES.iterdir() if p.is_dir())
    pools: dict[str, list[tuple[int, Path]]] = {}
    for site_dir in sites:
        pool: list[tuple[int, Path]] = []
        for path in site_dir.rglob("scraped/files/image/*"):
            if path.suffix.lower() not in (".jpg", ".jpeg", ".png") or not 30_000 <= path.stat().st_size <= 1_200_000:
                continue
            pool.append((path.stat().st_size, path))
        pools[site_dir.name] = sorted(pool, key=lambda x: -x[0])
    # round robin so every site contributes
    while len(chosen) < LIMIT and any(pools.values()):
        for site_name, pool in pools.items():
            while pool:
                _, path = pool.pop(0)
                try:
                    with Image.open(path) as image:
                        width, height = image.size
                except OSError:
                    continue
                if width < 480 or height < 280 or width / height > 3.2:
                    continue
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                if digest in seen:
                    continue
                seen.add(digest)
                name = f"{digest[:20]}{path.suffix.lower().replace('.jpeg', '.jpg')}"
                shutil.copyfile(path, MEDIA_DIR / name)
                chosen.append(Photo(name, digest, width, height, site_name))
                break
            if len(chosen) >= LIMIT:
                break
    return chosen


def build_media(
    b: Builder,
    t: Tables,
    counties: list[Feature],
    constituencies: list[Feature],
    places: list[Place],
    project_codes: list[str],
    individual_names: dict[str, str],
) -> None:
    rng = random.Random("media")
    images = collect_images()
    now = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    t.add(
        "ke/filesystem/folders.csv",
        {"code": "ke.folder.media", "name": "Media", "access": "public", "role_code": "fil.folder.role.media"},
    )
    for photo in images:
        name, digest, site = photo.name, photo.digest, photo.site
        file_code = f"ke.file.media.{digest[:20]}"
        extension = name.rsplit(".", 1)[1]
        content_type = "image/png" if extension == "png" else "image/jpeg"
        t.add(
            "ke/filesystem/files.csv",
            {"code": file_code, "folder_code": "ke.folder.media", "name": name, "retention": "preserve_history"},
        )
        t.add(
            "ke/filesystem/file_versions.csv",
            {
                "file_code": file_code,
                "revision": "1",
                "s3_key": f"media/{name}",
                "sha256": digest,
                "size_bytes": str((MEDIA_DIR / name).stat().st_size),
                "content_type": content_type,
                "access": "public",
                "provenance": json.dumps(
                    {"site": f"{site}", "note": "dumped from a scraped site for the development interface"}
                ),
                "pinned": "false",
                "created_by_snapshot": json.dumps({"by": "dev seed builder"}),
                "verified_at": now,
            },
        )
    by_site: dict[str, list[Photo]] = {}
    for item in images:
        by_site.setdefault(item.site, []).append(item)
    ngcdf = by_site.get("ngcdf", []) or images
    order = 0

    def stored(
        subject_table: str,
        subject: str,
        title: str,
        pool: list[Photo],
        kind: str = "photograph",
        purpose: str = "Illustration",
    ) -> None:
        nonlocal order
        order += 1
        chosen_photo = rng.choice(pool)
        digest = chosen_photo.digest
        t.add(
            "ke/filesystem/media.csv",
            {
                "code": f"ke.media.{order:06d}",
                "kind_code": f"fil.media.kind.{kind}",
                "subject_table": subject_table,
                "subject_code": subject,
                "title": title,
                "alt_text": title,
                "purpose": purpose,
                "position": "1",
                "file_version_code": f"ke.file.media.{digest[:20]}|1",
            },
        )

    def remote(
        subject_table: str,
        subject: str,
        title: str,
        url: str,
        platform: str,
        kind: str = "photograph",
        thumb: str = "",
        position: int = 2,
    ) -> None:
        nonlocal order
        order += 1
        row: Row = {
            "code": f"ke.media.{order:06d}",
            "kind_code": f"fil.media.kind.{kind}",
            "subject_table": subject_table,
            "subject_code": subject,
            "title": title,
            "alt_text": title,
            "position": str(position),
            "external_url": url,
            "platform_code": f"fil.media.platform.{platform}",
        }
        if thumb:
            row["thumbnail_url"] = thumb
        t.add("ke/filesystem/media.csv", row)

    for county in counties:
        remote("geography.features", county.code, f"{county.name} County", pexels(rng.choice(PEXELS)), "pexels")
        stored("geography.features", county.code, f"{county.name} County", images)
    for unit in constituencies:
        remote("geography.features", unit.code, f"{unit.name} Constituency", pexels(rng.choice(PEXELS)), "pexels")
    for place in places:
        remote("geography.features", place.code, place.name, pexels(rng.choice(PEXELS)), "pexels")
        stored("geography.features", place.code, place.name, images)
    for index, project in enumerate(project_codes):
        if "ngcdf" in project:
            stored("civic.projects", project, "Project site", ngcdf, purpose="Evidence of the works")
            if index % 3 == 0:
                remote("civic.projects", project, "Project site", pexels(rng.choice(PEXELS)), "pexels")
        else:
            remote("civic.projects", project, "Project site", pexels(rng.choice(PEXELS)), "pexels", position=1)
    for index, name in enumerate(("kasarani", "langata", "makadara", "starehe", "westlands")):
        for video in rng.sample(YOUTUBE, 2):
            remote(
                "official.entities",
                f"ke.institution.ngcdf.nairobi.{name}",
                "NG-CDF video",
                f"https://www.youtube.com/watch?v={video}",
                "youtube",
                "video",
                f"https://img.youtube.com/vi/{video}/hqdefault.jpg",
            )
        for platform, url, title in SOCIAL[index % 2 :][:2]:
            remote("official.entities", f"ke.institution.ngcdf.nairobi.{name}", title, url, platform, "photograph")
    for platform, url, title in SOCIAL:
        remote("official.entities", "ke.institution.national-assembly", title, url, platform)
    remote(
        "official.entities",
        "ke.institution.national-assembly",
        "Budget explained",
        f"https://www.youtube.com/watch?v={YOUTUBE[0]}",
        "youtube",
        "video",
        f"https://img.youtube.com/vi/{YOUTUBE[0]}/hqdefault.jpg",
    )
    holders = [h for h in b.holders if h["code"].endswith(".2022")]
    portraits = rng.sample(holders, min(60, len(holders)))
    portrait_codes = {h["individual_code"] for h in portraits}
    for holder in holders:
        person = holder["individual_code"]
        name = individual_names.get(person, person)
        if person in portrait_codes:
            remote(
                "official.individuals",
                person,
                name,
                pexels(rng.choice(PEXELS[:20]), 600),
                "pexels",
                "portrait",
                position=1,
            )
        else:
            remote("official.individuals", person, name, dicebear(name), "dicebear", "portrait", position=1)
