---
{id: GOAL-GRP-87642866F104,name: DB design and seed data rethink goal,type: documentation,extra: {created_at: 2026-11-25T15:56:53.475Z,group: GRP-87642866F104}}
---

# Goal

Rethink the Mzizi database design and its seed data from zero, one topic at a time, so that every governance record exists because a reviewed pattern or template produced it, not because someone typed it into a seed file. Today patterns, templates and instances are empty while 277 positions and 2,305 offices were seeded directly, and positions are split inconsistently between national posts (one position, many place offices) and county posts (one position per county). The place a seat belongs to is also recorded three times: in the institution, in the position code and in the office's geography feature.

Success means the owner can read one document per topic and understand exactly how places, levels, hierarchies, positions, offices, holders and legal effects connect; that the database itself, through foreign keys, checks and triggers, can verify that generated records match their pattern; and that the seed data is rebuilt from those patterns and verified against the design. Nothing in the wave is implemented until the owner has agreed the design on paper.

The first topic covers geography, reference (countries, hierarchies, levels) and governance together in one document.
