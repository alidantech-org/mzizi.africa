"""A small loopback website for crawl and browser tests: shared header/footer, files, an external link, a sitemap."""

from __future__ import annotations

from http.server import BaseHTTPRequestHandler
from typing import ClassVar

CHROME = '<header><a href="/">Home</a> <a href="/about">About the organisation and its work</a></header><nav><a href="/news">News and announcements</a></nav>'
FOOT = "<footer>Copyright 2026 Example Org. All rights reserved worldwide.</footer>"
PDF = b"%PDF-1.4\n" + b"x" * 300_000


def page(title: str, body: str, head: str = "") -> bytes:
    return f"<html><head><title>{title}</title>{head}</head><body>{CHROME}<main><h1>{title}</h1>{body}</main>{FOOT}</body></html>".encode()


def pages(port: int) -> dict[str, bytes]:
    return {
        "/": page(
            "Home",
            '<p>Welcome to <strong>our site</strong>. <a href="/about">About</a> <a href="https://other.example/x">Elsewhere</a> <a href="/report.pdf">Report</a> <img src="/logo.png" alt="logo"><a href="/reports?page=1">Reports</a></p>',
        ),
        "/about": page(
            "About",
            '<p>About us.</p><ul><li>one</li><li>two</li></ul><a href="/deep">deeper</a>',
            '<link rel="canonical" href="/about">',
        ),
        "/news": page("News", '<p>News <a href="/about">back</a> <a href="mailto:hi@example.org">mail</a></p>'),
        "/deep": page("Deep", '<p><a href="/deeper">more</a></p>'),
        "/deeper": page("Deeper", "<p>end</p>"),
        "/reports": page("Reports", "<p>page one</p>", '<link rel="next" href="/reports?page=2">'),
        "/reports?page=1": page("Reports", "<p>page one</p>", '<link rel="next" href="/reports?page=2">'),
        "/reports?page=2": page("Reports 2", "<p>page two</p>"),
        "/js": page(
            "Dynamic",
            '<p id="slot">loading</p><script>document.getElementById("slot").innerHTML = \'<a href="/found-by-js">js link</a>\'; console.error("boom");</script><button id="go" onclick="document.title=\'clicked\'">Go</button><input id="name"><img src="/missing.png">',
        ),
        "/sitemap.xml": f"<urlset><url><loc>http://127.0.0.1:{port}/news</loc></url></urlset>".encode(),
    }


class Handler(BaseHTTPRequestHandler):
    site: ClassVar[dict[str, bytes]] = {}

    def do_GET(self) -> None:
        path = self.path
        if path == "/robots.txt":
            body, kind, code = b"User-agent: *\nDisallow: /private\n", "text/plain", 200
        elif path == "/report.pdf":
            body, kind, code = PDF, "application/pdf", 200
        elif path == "/limited":
            body, kind, code = b"slow down", "text/plain", 429
        elif path in self.site:
            body, kind, code = self.site[path], "application/xml" if path.endswith(".xml") else "text/html", 200
        else:
            body, kind, code = b"missing", "text/plain", 404
        self.send_response(code)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_: object) -> None:
        return
