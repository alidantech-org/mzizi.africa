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
        "/buttons": page(
            "Buttons",
            '<ul id="list"></ul><nav aria-label="Pagination Navigation" class="pager"><ul>'
            '<li><button id="prev" aria-label="Previous page" disabled>&lsaquo;</button></li>'
            '<li><button id="next" aria-label="Next page">&rsaquo;</button></li></ul></nav>'
            '<script>var all=["a1","a2","a3","b1","b2","b3","c1","c2","c3"],p=0;function show(){'
            'document.getElementById("list").innerHTML=all.slice(p*3,p*3+3).map(function(x){return "<li>item "+x+"</li>"}).join("");'
            'document.getElementById("next").disabled=(p>=2);document.getElementById("prev").disabled=(p<=0)}'
            'document.getElementById("next").onclick=function(){p++;show()};show()</script>',
        ),
        "/loadmore": page(
            "Load more",
            '<ul id="list"><li>row 1</li><li>row 2</li></ul><button id="more">Load more</button>'
            '<script>var n=2,b=document.getElementById("more");b.onclick=function(){for(var i=0;i<2;i++){n++;'
            'var li=document.createElement("li");li.textContent="row "+n;document.getElementById("list").appendChild(li)}'
            'if(n>=6){b.remove()}}</script>',
        ),
        "/spa": page(
            "Spa",
            '<div id="root"></div><script>setTimeout(function(){document.getElementById("root").innerHTML="<h1>Hydrated</h1><p>content</p>"},1200)</script>',
        ),
        "/never": page("Never", '<div id="root"></div>'),
        "/popups": page(
            "Popups",
            '<a id="blank" target="_blank" href="/about">about</a>'
            '<button id="two" onclick="window.open(\'/news\');window.open(\'/deep\')">two</button>',
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
