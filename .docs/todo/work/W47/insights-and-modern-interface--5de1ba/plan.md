---
{id: GRP-80822C5DE1BA,name: Insights and modern interface,type: documentation,extra: {created_at: 2026-11-18T05:22:56.843Z}}
---

# Insights and modern interface plan

## Approach

Change Dryv first, then the contracts, regenerate, rebuild the dev database, build the API reads, then the web and Flutter screens, verifying each against the running stack.

## Milestones

1. Theme and generator.
2. Contracts and migrations.
3. Dev data from .dev.
4. API reads and tests.
5. Web, then Flutter.
6. Checks and documentation.

## Risks and open questions

Most figures below the county are sample data and are labelled so. The browser pane could not render the Flutter app while hidden.

Each step is verified against the running stack before the next begins: the generator by its tests, the contracts by compiling and regenerating, the data by loading the database, the API by database-backed tests, and the screens by opening them. Anything that cannot be verified is named in the task's progress notes rather than assumed to work.
