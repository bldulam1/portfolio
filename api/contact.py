from http.server import BaseHTTPRequestHandler
import json
import re


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)

        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._respond(400, {"error": "Invalid JSON body"})
            return

        errors = _validate(data)
        if errors:
            self._respond(422, {"errors": errors})
            return

        name = data["name"].strip()
        # TODO: forward to email provider (e.g. Resend, SendGrid)
        # resend.emails.send(to="hi@bianadulam.dev", subject=f"Message from {name}", ...)

        self._respond(200, {
            "success": True,
            "message": f"Thanks {name}, your message has been received!",
        })

    # ── helpers ──────────────────────────────────────────────────────────────

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _respond(self, status: int, payload: dict):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):  # suppress default request logs
        pass


def _validate(data: dict) -> dict:
    errors = {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name:
        errors["name"] = "Name is required"
    elif len(name) > 100:
        errors["name"] = "Name must be 100 characters or fewer"

    if not email:
        errors["email"] = "Email is required"
    elif not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address"

    if not message:
        errors["message"] = "Message is required"
    elif len(message) < 10:
        errors["message"] = "Message must be at least 10 characters"
    elif len(message) > 2000:
        errors["message"] = "Message must be 2000 characters or fewer"

    return errors
