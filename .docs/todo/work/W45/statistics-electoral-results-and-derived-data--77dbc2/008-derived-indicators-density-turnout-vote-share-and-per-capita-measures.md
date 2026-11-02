---
{id: TSK-ACEF2C1816E2,name: "Derived indicators: density, turnout, vote share and per capita measures",type: task,status: planned,priority: medium,created_at: 2026-11-02T19:25:52.520Z,updated_at: 2026-11-02T19:25:52.520Z,order: 8192}
---

# Derived indicators: density, turnout, vote share and per capita measures

## Goal

Make the system compute and store the numbers that follow from other numbers (population density, turnout, vote share, registered voters per population, NG-CDF allocation per person) and keep them correct when an input changes.

## Context

A derived value is not data from a source; it is a calculation with inputs, and it can go stale. Each derived observation must name its inputs, the formula and version, the period and geography unit, and be recomputed when any input is replaced by a newer release, never edited by hand. Density is population divided by area in square kilometres for the same unit and a stated reference year; turnout is votes cast divided by registered voters; vote share is a candidate's votes divided by valid votes; NG-CDF per person divides the allocation of a financial year by the population of the matching constituency. When the denominator is missing or zero the result is not stored. This task implements the calculation engine on the derived-from links designed earlier, with a registry of formulas, and exposes the values through the existing read API as ordinary indicators.

## Acceptance checklist

- [ ] Define a registry of formulas with identifiers, versions and required inputs.
- [ ] Implement population density for every unit that has both area and population, for each census year.
- [ ] Implement turnout, vote share and registered voters per population from the electoral tables.
- [ ] Implement NG-CDF allocation per person and per square kilometre by financial year.
- [ ] Recompute affected values when an input observation is superseded, and keep the old value as history.
- [ ] Add tests for zero or missing denominators and for recomputation after a revision.
