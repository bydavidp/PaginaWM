#!/usr/bin/env python3
"""Auditoría estática del sitio: etiquetas balanceadas, IDs duplicados y
referencias locales rotas. No requiere dependencias externas.

Uso:  python tools/audit-html.py
Salida: lista de problemas; código de salida 1 si encuentra alguno.
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
# Etiquetas con cierre opcional: no son error si quedan abiertas.
OPTIONAL = {
    "p", "li", "dt", "dd", "tr", "td", "th", "thead", "tbody", "tfoot",
    "option", "optgroup", "colgroup", "html", "head", "body",
}


class Audit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, int]] = []
        self.ids: dict[str, int] = {}
        self.duplicate_ids: list[tuple[str, int]] = []
        self.errors: list[tuple[int, str]] = []
        self.refs: list[tuple[str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        line = self.getpos()[0]
        data = dict(attrs)
        el_id = data.get("id")
        if el_id:
            if el_id in self.ids:
                self.duplicate_ids.append((el_id, line))
            else:
                self.ids[el_id] = line
        for attr in ("src", "href", "poster"):
            value = data.get(attr)
            if value:
                self.refs.append((value, line))
        for value in (data.get("srcset") or "").split(","):
            url = value.strip().split(" ")[0]
            if url:
                self.refs.append((url, line))
        if data.get("data-full"):
            self.refs.append((data["data-full"], line))
        if tag not in VOID:
            self.stack.append((tag, line))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                # Cierra implícitamente las etiquetas opcionales que quedaron abiertas.
                dangling = self.stack[i + 1:]
                for name, line in dangling:
                    if name not in OPTIONAL:
                        self.errors.append(
                            (line, f"<{name}> sigue abierta al cerrar </{tag}>")
                        )
                del self.stack[i:]
                return
        self.errors.append((self.getpos()[0], f"</{tag}> sin etiqueta de apertura"))

    def finish(self) -> list[tuple[int, str]]:
        for name, line in self.stack:
            if name not in OPTIONAL:
                self.errors.append((line, f"<{name}> sin cerrar"))
        return self.errors


def is_local(ref: str) -> bool:
    ref = ref.strip()
    if not ref or ref.startswith(("#", "//", "data:", "mailto:", "tel:", "javascript:")):
        return False
    parsed = urlparse(ref)
    return not parsed.scheme and not parsed.netloc


def main() -> int:
    pages = sorted(ROOT.glob("*.html"))
    problems: list[str] = []

    for page in pages:
        parser = Audit()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        parser.close()
        for line, message in parser.finish():
            problems.append(f"{page.name}:{line}: {message}")
        for el_id, line in parser.duplicate_ids:
            problems.append(f"{page.name}:{line}: id duplicado '{el_id}'")
        for ref, line in parser.refs:
            if not is_local(ref):
                continue
            path = (page.parent / unquote(urlparse(ref).path)).resolve()
            if not path.exists():
                problems.append(f"{page.name}:{line}: no existe '{ref}'")

    if problems:
        print(f"{len(problems)} problema(s) encontrados:\n")
        for item in problems:
            print("  -", item)
        return 1

    print(f"OK: {len(pages)} páginas sin etiquetas desbalanceadas, IDs duplicados ni enlaces locales rotos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
