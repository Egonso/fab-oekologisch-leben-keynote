#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parent.parent
API_BASE = "https://oekologisch-leben.org/wp-json/wp/v2/pages?per_page=100"

VISIBLE_SLUGS = [
    "homepage",
    "beratung",
    "campus",
    "pdc",
    "vortraege",
    "ueber-uns",
    "kontakt",
    "impressum",
    "datenschutz",
]

IMAGE_EXTENSIONS = (
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".avif",
)

SKIP_TEXT_PARENTS = {"script", "style", "noscript", "svg", "path"}


@dataclass
class PageRecord:
    id: int
    slug: str
    link: str
    title: str
    modified: str
    content_html: str


def fetch_json(url: str) -> list[dict] | dict:
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_text(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Codex Research Extractor"
        },
    )
    with urllib.request.urlopen(request) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def unique_preserving_order(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        ordered.append(item)
    return ordered


class VisibleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.stack: list[str] = []
        self.texts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if self.stack:
            self.stack.pop()

    def handle_data(self, data: str) -> None:
        if any(parent in SKIP_TEXT_PARENTS for parent in self.stack):
            return
        text = clean_text(data)
        if not text:
            return
        self.texts.append(text)


class ImageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "img":
            return
        attributes = dict(attrs)
        src = attributes.get("src")
        if not src:
            return
        if not src.lower().startswith("http"):
            return
        if not src.lower().split("?")[0].endswith(IMAGE_EXTENSIONS):
            return
        alt = clean_text(attributes.get("alt") or "")
        self.images.append((src, alt))


def extract_texts_from_html(raw_html: str) -> list[str]:
    parser = VisibleTextParser()
    parser.feed(raw_html)
    return unique_preserving_order(parser.texts)


def extract_images_from_html(raw_html: str) -> list[tuple[str, str]]:
    parser = ImageParser()
    parser.feed(raw_html)
    return unique_preserving_order(
        [f"{src}|||{alt}" for src, alt in parser.images]
    )


def split_image_records(records: list[str]) -> list[tuple[str, str]]:
    output: list[tuple[str, str]] = []
    for item in records:
        src, alt = item.split("|||", 1)
        output.append((src, alt))
    return output


def page_records() -> list[PageRecord]:
    pages = fetch_json(API_BASE + "&_fields=id,slug,link,title.rendered,modified,content.rendered")
    assert isinstance(pages, list)
    records: list[PageRecord] = []
    for page in pages:
        records.append(
            PageRecord(
                id=page["id"],
                slug=page["slug"],
                link=page["link"],
                title=clean_text(page["title"]["rendered"]),
                modified=page["modified"],
                content_html=page["content"]["rendered"],
            )
        )
    return records


def render_page_section(page: PageRecord) -> str:
    page_html = fetch_text(page.link)
    dom_texts = extract_texts_from_html(page_html)
    page_texts = extract_texts_from_html(page.content_html)
    image_records = split_image_records(extract_images_from_html(page_html))

    lines: list[str] = []
    lines.append(f"## {page.title}")
    lines.append("")
    lines.append(f"- URL: {page.link}")
    lines.append(f"- Slug: `{page.slug}`")
    lines.append(f"- Modified: `{page.modified}`")
    lines.append("")
    lines.append("### Direct Image Links")
    if image_records:
        for src, alt in image_records:
            label = alt if alt else "Image"
            lines.append(f"- {label}: {src}")
    else:
        lines.append("- None found")
    lines.append("")
    lines.append("### Page Builder / Body Text")
    if page_texts:
        for text in page_texts:
            lines.append(f"- {text}")
    else:
        lines.append("- None extracted")
    lines.append("")
    lines.append("### Full Visible DOM Text")
    if dom_texts:
        for text in dom_texts:
            lines.append(f"- {text}")
    else:
        lines.append("- None extracted")
    lines.append("")
    return "\n".join(lines)


def write_file(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def main() -> None:
    records = page_records()
    by_slug = {record.slug: record for record in records}

    visible = [by_slug[slug] for slug in VISIBLE_SLUGS if slug in by_slug]
    hidden = [record for record in records if record.slug not in VISIBLE_SLUGS]

    landing = by_slug["homepage"]
    landing_doc = [
        "# Oekologisch Leben Landing Page",
        "",
        "Current extraction of the public landing page from `oekologisch-leben.org`.",
        "",
        render_page_section(landing),
    ]

    subpage_doc = [
        "# Oekologisch Leben Visible Main-Domain Subpages",
        "",
        "Current extraction of the visible published main-domain subpages on `oekologisch-leben.org`.",
        "",
    ]
    for page in visible:
        if page.slug == "homepage":
            continue
        subpage_doc.append(render_page_section(page))

    hidden_doc = [
        "# Oekologisch Leben Hidden / Appendix Pages",
        "",
        "Published main-domain pages that are not part of the primary visible site flow and should be treated as appendix context.",
        "",
    ]
    for page in hidden:
        hidden_doc.append(render_page_section(page))

    write_file(ROOT / "research/01-landingpage.md", "\n".join(landing_doc).strip() + "\n")
    write_file(ROOT / "research/02-subpages.md", "\n".join(subpage_doc).strip() + "\n")
    write_file(ROOT / "research/03-hidden-pages-appendix.md", "\n".join(hidden_doc).strip() + "\n")


if __name__ == "__main__":
    main()
