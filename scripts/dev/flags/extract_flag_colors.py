"""Draft the country flag media rows: one flag file per country, with its colours measured from the file itself.

Reads the MIT-licensed flag-icons package (4x3 SVG) from a local copy, rasterises each flag, counts the colours that cover
at least 1.5% of it and names each by the nearest basic colour. Nothing is written under `seed/`: the outputs go to
`.dev/proposals/flags/` for the owner to review.

    uv run python scripts/dev/flags/extract_flag_colors.py <flag-icons dir> [--out .dev/proposals/flags]

The `metadata` object follows the media metadata design: one object per facet, each with its own provenance.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import subprocess
from collections import Counter
from datetime import date
from pathlib import Path

from PIL import Image

SHARE_MIN = 0.015
WIDTH, HEIGHT = 160, 120
# Nearest-colour names. Only used to label what was measured; the measured hex is what the app uses.
NAMES: dict[str, tuple[int, int, int]] = {
    "black": (0, 0, 0),
    "white": (255, 255, 255),
    "grey": (128, 128, 128),
    "red": (200, 30, 40),
    "orange": (240, 130, 20),
    "yellow": (250, 210, 30),
    "green": (20, 140, 60),
    "blue": (20, 70, 170),
    "light blue": (100, 180, 230),
    "purple": (110, 50, 140),
    "brown": (110, 70, 30),
    "pink": (240, 150, 170),
}


def nearest_name(rgb: tuple[int, int, int]) -> str:
    return min(NAMES, key=lambda n: sum((a - b) ** 2 for a, b in zip(rgb, NAMES[n], strict=False)))


def rasterise(svg: Path) -> Image.Image:
    png = subprocess.run(
        ["magick", "-background", "none", "-density", "96", str(svg), "-resize", f"{WIDTH}x{HEIGHT}!", "png:-"],
        check=True,
        capture_output=True,
    ).stdout
    return Image.open(io.BytesIO(png)).convert("RGBA")


def swatches(image: Image.Image) -> list[dict[str, object]]:
    """Colours covering at least SHARE_MIN of the flag. Shades within one 8-step bucket merge; the bucket reports its most common exact colour."""
    buckets: dict[tuple[int, int, int], Counter[tuple[int, int, int]]] = {}
    data = image.tobytes()
    for i in range(0, len(data), 4):
        r, g, b, a = data[i : i + 4]
        if a > 200:
            buckets.setdefault((r // 8, g // 8, b // 8), Counter())[(r, g, b)] += 1
    total = sum(sum(c.values()) for c in buckets.values()) or 1
    found = sorted(((c.most_common(1)[0][0], sum(c.values()) / total) for c in buckets.values()), key=lambda x: -x[1])
    return [
        {"label": nearest_name(rgb), "hex": "#{:02x}{:02x}{:02x}".format(*rgb), "share": round(share, 4)}
        for rgb, share in found
        if share >= SHARE_MIN
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("flag_icons", type=Path)
    parser.add_argument("--out", type=Path, default=Path(".dev/proposals/flags"))
    parser.add_argument("--countries", type=Path, default=Path("seed/data/global/reference/countries.csv"))
    args = parser.parse_args()
    version = json.loads((args.flag_icons / "package.json").read_text())["version"]
    args.out.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, str]] = []
    with args.countries.open(encoding="utf-8", newline="") as handle:
        countries = [r for r in csv.DictReader(handle) if r["iso_alpha2"]]
    for country in countries:
        iso = country["iso_alpha2"].lower()
        svg = args.flag_icons / "flags" / "4x3" / f"{iso}.svg"
        if not svg.exists():
            continue
        data = svg.read_bytes()
        sha = hashlib.sha256(data).hexdigest()
        metadata = {
            "colors": {
                "method": "raster-area",
                "raster": f"{WIDTH}x{HEIGHT}",
                "minimumShare": SHARE_MIN,
                "sourceSha256": sha,
                "extractedOn": date.today().isoformat(),
                "swatches": swatches(rasterise(svg)),
            },
            "dimensions": {"viewBox": "0 0 640 480", "aspect": "4:3"},
        }
        rows.append(
            {
                "code": f"{country['code']}.flag",
                "subject_table": "reference.countries",
                "subject_code": country["code"],
                "kind_code": "fil.media.kind.flag",
                "title": f"Flag of {country['name']}",
                "alt_text": f"The national flag of {country['name']}",
                "file": f"flag-icons/{version}/flags/4x3/{iso}.svg",
                "sha256": sha,
                "metadata": json.dumps(metadata, separators=(",", ":")),
            }
        )
    with (args.out / "media.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(f"{len(rows)} flags drafted from flag-icons {version} into {args.out}")


if __name__ == "__main__":
    main()
