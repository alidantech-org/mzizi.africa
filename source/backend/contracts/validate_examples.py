"""Validates every file in examples/ against its $def in exchange.schema.json.

    python -I validate_examples.py     (needs the jsonschema package)
"""
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

here = Path(__file__).parent
schema = json.loads((here / "exchange.schema.json").read_text())
failed = 0
for example in sorted((here / "examples").glob("*.json")):
    validator = Draft202012Validator({**schema, "$ref": f"#/$defs/{example.stem}"}, format_checker=Draft202012Validator.FORMAT_CHECKER)
    errors = list(validator.iter_errors(json.loads(example.read_text())))
    print(("ok   " if not errors else "FAIL ") + example.name)
    for error in errors:
        failed += 1
        print("   ", error.message)
sys.exit(1 if failed else 0)
