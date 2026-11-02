---
{
  id: DOC-142CAE04649D,
  name: "API, Mobile, and Sites Roadmap",
  type: documentation,
}
---

# API, Mobile, and Sites Roadmap

This roadmap is represented by linked activities in the Task groups **API**, **Mobile app**, and **Sites**. The intended order lives in the group plan files under `.docs/todo/`; run `task list` to see what exists.

## API

1. Inventory the legacy Python API's routes, models, migrations, seeds, data dependencies, and consumers (`TSK-39C88A553155`).
2. Define versioned NestJS API and evidence/geography contracts (`TSK-EFD9E84630E1`) and runtime/auth conventions (`TSK-D76C98E59E1F`).
3. Deliver a narrow geography read slice (`TSK-9EEB47279B23`) and document responsibility/data migration (`TSK-38F9B96B1772`).

## Mobile app

1. Make local API origin configuration clear across Chrome, emulator, and phone (`TSK-EAB6FC782E86`).
2. Complete verified county-to-child map navigation (`TSK-471C902B718F`) and functional search/navigation (`TSK-C8093926792F`).
3. Validate map behavior, accessibility, and performance across supported platforms (`TSK-62F7658798F7`).

## Public and research sites

1. Audit existing routes, APIs, placeholders, and ownership (`TSK-3AED35436948`).
2. Build the public atlas using verified, sourced, time-aware API data (`TSK-F71939F0BA48`).
3. Build evidence review workflows in the dashboard without promoting AI output automatically (`TSK-15039EBA58CC`).
4. Establish shared quality and accessibility checks (`TSK-6A1B0B050D4D`).

Sequence dependent activities through Task dependencies. Revisit scope after audits; do not assume unimplemented target services already exist.
