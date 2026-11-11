---
id: DOC-EXP-ECONOMY-20261111
name: Economy domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, economy]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Economy — products, markets, prices and production

> **Status: HYPOTHETICAL DOMAIN BRIEF.** Candidate Economy responsibilities and tables are not approved for SQL. See the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

Economy connects goods/services, production, exchange and prices to Geography, Agriculture, History, Statistical, Finance and Procurement.

## 2. Domain ownership

Candidate ownership: product concepts/specifications, market identity as an economic venue, source price quotes, trade/exchange facts and economic production operations.

## 3. Exclusions

Agriculture owns farm/harvest events. Finance owns budgets, accounting, debt and public transactions. Procurement owns tender/bid/award/contract process. Statistical owns official indices and comparable series. Geography owns physical market place. Organization owns businesses and legal identities.

## 4. Existing schema and table inventory

No Economy SQL schema or Dryv contract group is currently present in the active tree. Existing finance/procurement/statistical contracts and earlier redesign documents cover adjacent concepts but do not implement an Economy domain. This is a new proposal.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `products` | Goods/services identities and versioned classification links. |
| `markets` | Economic market identity linked to a geographic place or organized exchange. |
| `prices` | Individual sourced quote with amount, currency, quantity/unit, type, place and observation time. |
| `trades` | Documented exchange/movement with parties, products, quantities and terms. |
| `operations` | Economic production activity such as mining, manufacturing, fishing, tourism or retail. |
| `production` | Output fact linked to an operation, product, quantity, period and source. |

Some operation/production concepts may be domain-specific and should not be generalized prematurely.

## 6. Primary and foreign-key relationships

Prices link to product, currency/unit classifications and market/geographic place plus source capture/version. Trade parties link to Organization or Person with typed roles. Production can link to Economy product and an originating Agriculture/Civic domain record where applicable; avoid generic polymorphic references.

## 7. Cross-domain relationships

A local market price belongs to Economy; an official consumer/producer price index belongs to Statistical. Agriculture harvest quantity remains in Agriculture; Economy may link to sales/market records. Public spending/tenders remain Finance/Procurement facts even when they affect markets.

## 8. Geographic responsibilities

Markets and extraction/production sites link to geographic places and areas; trade routes may reference Geography/Civic networks. Price context must distinguish market location from product origin, seller jurisdiction and consumer area.

## 9. Temporal responsibilities

Preserve quote observation time, valid market/product classification versions, trade date/period, currency validity and release/retrieval time. Historical prices retain source currency and quantity unit; corrected quotes are versioned/evidenced.

## 10. Evidence and provenance

Every quote/trade/production fact needs source artifact/version or documented collection method, locator, collection/observation time, currency/unit, attribution/license and uncertainty. Do not normalize away the source-reported value.

## 11. Acquisition categories

Static seed: product/currency/unit classifications. Pattern seed: generally not an economic fact source. Collected: market surveys, trade publications and administrative series. Derived: converted/inflation-adjusted prices and aggregates with pinned rates/index releases and formulas.

## 12. Derived data

Derived real prices must pin exchange rate, deflator/price index, base period, formula and source release. Statistical owns index series; Economy can present a derived comparison linked to it. Trade/production totals record coverage and aggregation assumptions.

## 13. Example queries

- How did the source-reported price of a staple change at this market, preserving units and currency?
- Which price comparisons are converted to a common currency and what exchange rates were used?
- Which producers and routes are linked to a documented commodity flow?

## 14. UI/API requirements

Charts expose nominal and derived series distinctly, allow currency/unit/market filters only when supported, and link to source details. Do not rank market affordability without a defined basket and methodology.

## 15. Integrity constraints to investigate

Monetary precision/currency, quantity-unit compatibility, price type, duplicate source observation, effective product classification, market identity changes and reproducible conversion/deflation.

## 16. Technical standards to evaluate

UN CPC for products (pin release; the currently surfaced Version 3.0 work is draft/revision activity), FAOSTAT product/measure definitions, SDMX for statistical exchange, and source-specific commodity vocabularies. Do not treat classifications as product identity or copy them wholesale.

## 17. Open questions

Should products and services share one model? How represent informal markets and price collection? Do trade/production deserve separate schemas? Where do currency historical conversions live? How are trade data, policy restrictions and confidential business records exposed?

## 18. Review and approval status

Hypothetical; not reviewed or approved. Reconcile with Finance, Procurement, Agriculture, Statistical, Organization and Source before downstream schema planning.
