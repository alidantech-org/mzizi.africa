---
{id: GRP-7157664B7E49,name: "Political parties, ORPP and IEBC data",type: documentation,extra: {created_at: 2026-11-02T20:01:37.055Z}}
---

# Political parties, ORPP and IEBC data plan

## Approach

Research first (what the ORPP and IEBC sites publish and in which form), then register and assess their hosts, then build PDF pipelines (text and tables, with OCR where scanned, and the arithmetic cross-checks that worked for the budget summary), then map into the existing political, finance and electoral schemas and add only what they cannot hold. Party names and acronyms are matched fuzzily to existing party rows and never create duplicates; people go through the matching system. Logo files are kept as raw artifacts with their source.

## Milestones

1. ORPP research, site and institution (task 001).
2. Party register and documents (task 002).
3. Party funds and accounts (task 003).
4. IEBC aspirants, registers, boundaries and constituency offices, fuzzy-linked (task 004).
