"""Figures: embedded images and vector diagrams, found by geometry and cropped from a render of the page."""

from __future__ import annotations

import io
from dataclasses import dataclass

import pdfplumber.page
import pypdfium2 as pdfium
from PIL import Image

MERGE_DISTANCE = 8.0
MIN_IMAGE_POINTS = 30.0
MIN_DIAGRAM_WIDTH, MIN_DIAGRAM_HEIGHT, MIN_DIAGRAM_OBJECTS = 60.0, 40.0, 6
BACKGROUND_SHARE = 0.85
BULLET_MAX_POINTS = 8.0
RULE_THICKNESS = 3.0
FIGURE_SCALE = 3.0


@dataclass(frozen=True)
class Box:
    x0: float
    top: float
    x1: float
    bottom: float
    has_image: bool = False
    objects: int = 1

    @property
    def width(self) -> float:
        return self.x1 - self.x0

    @property
    def height(self) -> float:
        return self.bottom - self.top

    def near(self, other: Box, distance: float) -> bool:
        return not (
            other.x0 > self.x1 + distance
            or other.x1 < self.x0 - distance
            or other.top > self.bottom + distance
            or other.bottom < self.top - distance
        )

    def union(self, other: Box) -> Box:
        return Box(
            min(self.x0, other.x0),
            min(self.top, other.top),
            max(self.x1, other.x1),
            max(self.bottom, other.bottom),
            self.has_image or other.has_image,
            self.objects + other.objects,
        )

    def contains_center(self, x: float, y: float) -> bool:
        return self.x0 <= x <= self.x1 and self.top <= y <= self.bottom


def _box(obj: dict[str, float], image: bool) -> Box:
    return Box(obj["x0"], obj["top"], obj["x1"], obj["bottom"], image)


def _cluster(boxes: list[Box]) -> list[Box]:
    clusters = list(boxes)
    changed = True
    while changed:
        changed = False
        for i in range(len(clusters)):
            for j in range(i + 1, len(clusters)):
                if clusters[i].near(clusters[j], MERGE_DISTANCE):
                    clusters[i] = clusters[i].union(clusters[j])
                    del clusters[j]
                    changed = True
                    break
            if changed:
                break
    return clusters


def find_figures(page: pdfplumber.page.Page, table_boxes: list[Box]) -> list[Box]:
    """Images and drawing clusters outside tables, top to bottom. Whole-page backgrounds are ignored."""
    area = page.width * page.height

    def outside_tables(box: Box) -> bool:
        cx, cy = (box.x0 + box.x1) / 2, (box.top + box.bottom) / 2
        return not any(t.contains_center(cx, cy) for t in table_boxes)

    boxes = [_box(i, True) for i in page.images]
    for obj in [*page.rects, *page.curves, *page.lines]:
        box = _box(obj, False)
        thin_rule = min(box.width, box.height) < RULE_THICKNESS and max(box.width, box.height) > 0.8 * page.width
        small = box.width <= BULLET_MAX_POINTS and box.height <= BULLET_MAX_POINTS
        if not thin_rule and not small and box.width * box.height < BACKGROUND_SHARE * area:
            boxes.append(box)
    found: list[Box] = []
    for cluster in _cluster([b for b in boxes if outside_tables(b)]):
        if cluster.width * cluster.height >= BACKGROUND_SHARE * area:
            continue
        if (cluster.has_image and min(cluster.width, cluster.height) >= MIN_IMAGE_POINTS) or (
            not cluster.has_image
            and cluster.width >= MIN_DIAGRAM_WIDTH
            and cluster.height >= MIN_DIAGRAM_HEIGHT
            and cluster.objects >= MIN_DIAGRAM_OBJECTS
        ):
            found.append(cluster)
    return sorted(found, key=lambda b: (b.top, b.x0))


def render_page_png(page: pdfium.PdfPage, scale: float) -> bytes:
    buffer = io.BytesIO()
    page.render(scale=scale).to_pil().convert("RGB").save(buffer, format="PNG")
    return buffer.getvalue()


def render_image(page: pdfium.PdfPage) -> Image.Image:
    """The page rasterised once at figure resolution; crop several figures from it."""
    return page.render(scale=FIGURE_SCALE).to_pil().convert("RGB")


def crop_png(image: Image.Image, box: Box) -> bytes:
    """PNG of `box` (page points, top-left origin) with a small margin."""
    margin = 2.0
    left, top = max(box.x0 - margin, 0) * FIGURE_SCALE, max(box.top - margin, 0) * FIGURE_SCALE
    right, bottom = (box.x1 + margin) * FIGURE_SCALE, (box.bottom + margin) * FIGURE_SCALE
    buffer = io.BytesIO()
    image.crop((int(left), int(top), min(int(right), image.width), min(int(bottom), image.height))).save(
        buffer, format="PNG"
    )
    return buffer.getvalue()


def find_bullets(page: pdfplumber.page.Page) -> list[Box]:
    """Small filled marks that are drawn rather than typed (round or square list bullets)."""
    marks = [*page.rects, *page.curves]
    return [
        _box(o, False)
        for o in marks
        if o["x1"] - o["x0"] <= BULLET_MAX_POINTS and o["bottom"] - o["top"] <= BULLET_MAX_POINTS and o.get("fill")
    ]
