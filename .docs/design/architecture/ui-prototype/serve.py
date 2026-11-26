"""Dev server for the prototype: serves files, and falls back to index.html for place paths
such as /ke/nairobi/westlands?view=elections (the documented URL scheme). Usage: python3 serve.py [port]"""
import http.server, os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def do_GET(self):
        p = self.path.split("?")[0]
        if p != "/" and not os.path.exists(os.path.join(ROOT, p.lstrip("/"))) and "." not in os.path.basename(p):
            self.path = "/index.html"
        super().do_GET()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5599
print(f"Mzizi prototype on http://127.0.0.1:{port}/ke/nairobi?view=atlas")
http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
