"""Local dev server that disables caching entirely.

python -m http.server sends no Cache-Control/ETag, so browsers fall back to
heuristic caching and can keep serving an old HTML/CSS/JS file for a long
time after it's changed on disk, even across hard reloads. This wrapper adds
explicit no-store headers to every response so edits always show up.
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8420
    HTTPServer(("", port), NoCacheHandler).serve_forever()
