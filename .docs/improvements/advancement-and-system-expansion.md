---
id: DOC-MZIZI-ADVANCEMENT-20261111
name: Mzizi Africa advancement and system expansion
type: documentation
tags: [vision, system-expansion, architecture, geography, civic, history, statistics, economics, biology, agriculture]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-11
---

# Mzizi Africa — Advancement and System Expansion

> **STATUS: ARCHITECTURAL VISION AND WORKING PROPOSAL**
>
> This document records the expanded Mzizi Africa vision and the candidate domain architecture discussed on 11 November 2026.
>
> All new schemas, table inventories, relationships, API capabilities and technical approaches in this document are hypothetical design proposals. They are not approved physical database changes, SQL specifications, migrations or implementation instructions.
>
> The purpose is to give future architecture and documentation work one comprehensive reference from which to refine the platform.
>
> Existing user-approved decisions and the connected Reference–Geography–Legal foundation retain their authority. This document does not silently replace them.

## 1. Purpose

Mzizi Africa is intended to become an evidence-first African knowledge platform capable of researching, organizing, preserving, connecting and explaining the physical, natural, human, civic, historical, political, social and economic development of African countries and societies.

The original emphasis on governments, political institutions, elections and public accountability remains important. However, the platform's potential is much broader.

Mzizi should be able to explain not only who governs a place, but also:

- What physically exists there.
- How its geographical structure developed.
- Which natural features and ecosystems exist there.
- Which plants, animals and other organisms inhabit it.
- How people have settled, moved and organized themselves.
- Which roads, railways, dams, buildings and infrastructure have been constructed.
- How public services and institutions operate.
- How agriculture and other production activities work.
- Which goods and services are exchanged.
- How markets and prices change.
- How populations and other measurable conditions evolve.
- Which historical events and processes shaped the present.
- What evidence supports the information.
- How all these things relate to one another across time and geography.

The defining product capability should be the ability to move between these subjects without switching to disconnected databases or losing their context.

## 2. The overall vision: five exploration areas

The five areas are product-level knowledge and exploration groupings. They are not a decision that the database must contain exactly five schemas.

One exploration area may use several specialized schemas. A single schema may support multiple exploration areas.

### 2.1 Civic and Society

Civic covers the structures, services and organized activities through which people and societies operate.

Subjects include:

- Government and public administration.
- Political institutions and representation.
- Elections and political parties.
- Public infrastructure.
- Roads, bridges, railways and transport.
- Dams, irrigation and water infrastructure.
- Electricity and telecommunications infrastructure.
- Schools, universities and educational services.
- Hospitals and healthcare services.
- Public offices and facilities.
- Public projects and construction.
- Community services and amenities.
- Organizations and institutions.
- Public-service availability and coverage.

Candidate supporting domains include Civic, Governance, Political, Electoral, Organization, Person, Education and Health.

Infrastructure must have its own clear functional identity, even when its geometry is owned or represented through Geography.

### 2.2 Geography and Nature

Geography is the spatial foundation of Mzizi.

It must represent much more than countries, counties and administrative boundaries.

Coverage should include:

**Territorial geography**
- Continents and countries.
- Administrative divisions.
- Electoral and statistical areas.
- Historical territories.
- Watersheds and catchment areas.
- Ecological regions.
- Cultural and linguistic regions.
- Cross-border and regional areas.
- Disputed, reconstructed and hypothetical areas where evidence and status are explicit.

**Physical geography**
- Rivers and tributaries.
- Lakes and reservoirs.
- Oceans and coastlines.
- Mountains and valleys.
- Plains and plateaus.
- Geological formations.
- Soil regions.
- Elevation and terrain.
- Islands and wetlands.
- Drainage systems.

**Environmental geography**
- Climate regions.
- Rainfall distribution.
- Temperature distribution.
- Drought and flood exposure.
- Vegetation cover.
- Land cover and land use.
- Environmental conditions.
- Historical environmental change.

**Living nature**
- Plants and vegetation.
- Animals and wildlife.
- Species distribution.
- Biodiversity and habitats.
- Ecological relationships.
- Protected areas and conservation regions.

Geography should provide the spatial identities, shapes, relationships and spatial datasets needed to make these subjects discoverable and comparable.

### 2.3 History and Heritage

History provides chronological understanding and researched explanations of how places, societies, institutions and environments developed.

It should cover:

- Historical periods and competing period definitions.
- Ancient, pre-colonial, colonial and modern history.
- Kingdoms, empires, chiefdoms and other historical polities.
- Migration, settlement and population movement.
- Trade networks and historical economic activities.
- Historical boundaries and changing territorial identities.
- Historical infrastructure.
- Historical governance and political transitions.
- Historical institutions and legal changes.
- Cultural and material heritage.
- Archaeological discoveries.
- Historical artifacts, manuscripts, monuments and collections.
- Original archival and documentary evidence.
- Scholarly interpretations, disagreements and uncertainty.
- Connected chronological timelines.

History should not duplicate the actual entities and measurements owned by other domains. It should reference them and explain their historical context.

### 2.4 Statistics and Demographics

Statistical provides the shared measurement and analytical capability.

It should support:

- Population and census measurements.
- Age and sex distributions.
- Household and demographic measurements.
- Language-use statistics.
- Migration measurements.
- Education and health indicators.
- Employment and income.
- Economic indicators.
- Agricultural production.
- Wildlife population estimates.
- Environmental measurements and summaries.
- Climate trends.
- Electoral turnout and derived comparisons.
- Infrastructure coverage and density.
- Historical statistical estimates.
- Statistical releases, revisions, methods and uncertainty.

Statistical should not own every numeric field in Mzizi.

An original domain fact belongs to its domain. Statistical organizes comparable measurements, published datasets, analytical series and derived observations.

### 2.5 Economics and Production

Economics explains how societies use resources, produce goods and services, exchange products, operate markets and develop economically.

It should include:

- Goods and services.
- Product identities and classifications.
- Markets and trading centers.
- Historical and current prices.
- Retail, wholesale and producer prices.
- Currency and quantity definitions.
- Trade and distribution.
- Agriculture and livestock production.
- Mining and mineral production.
- Fishing and forestry.
- Manufacturing.
- Tourism and services.
- Employment and economic activities.
- Regional economic relationships.
- Historical trade routes and economic systems.
- Inflation and purchasing power.
- Public investment and expenditure.

Economy, Finance and Procurement must remain distinguishable.

Economy describes production, exchange, prices and economic activity. Finance describes financial resources, budgets, debt and accounting. Procurement describes purchasing processes, tenders, awards and contracts.

## 3. Core architecture principles

### 3.1 One canonical owner for every real-world entity

Every entity should have one canonical domain owner.

Examples:

- A river belongs to Geography.
- A species belongs to Biology.
- A road's functional infrastructure identity belongs to Civic.
- A farm belongs to Agriculture.
- A product belongs to Economy.
- A person belongs to Person.
- An office belongs to Governance.
- An election belongs to Electoral.
- A historical research interpretation belongs to History.
- A statistical indicator belongs to Statistical.

Other domains reference these entities through real relationships.

Do not create duplicate river, road, population, election, product or person tables merely to make another domain's query easier.

### 3.2 Distinguish entities, spatial representations, observations and interpretations

Four different things must not be confused:

| Concept | Meaning | Example |
|---|---|---|
| Entity | A stable identity | River Tana |
| Spatial representation | Where and how that entity is represented geographically | A river's mapped line |
| Observation | A measurement or documented occurrence | Water level measured at a station |
| Interpretation | An evidence-backed explanation | How water use changed over a historical period |

A fifth capability, relationships, connects entities and their changes.

Evidence and provenance support all these records.

### 3.3 Geography and domain ownership are complementary

A road is both a geographic object and a civic infrastructure asset, but these descriptions are not interchangeable.

Geography supplies spatial identity and geometry.

Civic supplies infrastructure purpose, network membership, construction, operation and functional relationships.

Likewise:

- A reservoir is a geographic water feature.
- A dam is a constructed civic asset.
- A weather station is an environmental monitoring asset at a geographic place.
- A field is an agricultural plot represented geographically.
- A species occurrence has a biological identity and a spatial location.

### 3.4 Time is first-class, but temporal fields must be justified

Distinguish:

- When something existed or was valid.
- When an event occurred.
- When a measurement was observed.
- When a source was published.
- When Mzizi retrieved the source.
- When a fact was entered or revised.
- When a claim was reviewed or verified.

Do not apply generic `valid_from`, `valid_to`, `is_current` or precision fields to every table without justification.

Use domain-specific temporal fields and preserve uncertainty where appropriate.

### 3.5 Evidence is part of every important claim

The platform should preserve:

- Source identity.
- Original source artifact.
- Exact source version.
- Publication and acquisition dates.
- Source location or document locator.
- Extraction and transformation methods.
- Reviewer and verification history.
- Confidence and uncertainty where meaningful.
- Disagreements and competing claims.
- Record and evidence versions.

AI-generated suggestions must remain attributable and reviewable. They must not silently become canonical truth.

### 3.6 Prefer real foreign keys and explicit relationships

Use direct, typed foreign keys wherever possible.

Do not introduce unrestricted `entity_type + entity_id` relationships and describe them as referentially enforced.

Where an association must connect several domain types, evaluate explicit typed associations, constrained target columns or separate domain-specific relationship tables.

Every many-to-many relationship should have an intentional association model.

### 3.7 Reference defines meaning, not the entities themselves

Reference provides shared classifications, definitions, scopes, topics and approved reusable patterns.

It should not become a generic container for actual roads, rivers, species, offices, people, markets or statistical observations.

The connected Reference–Geography–Legal foundation and Task 03 remain the controlling design work for that foundation.

## 4. Candidate schema architecture

The following schemas and tables are a working inventory. Their names, ownership and existence must be checked against the active repository before being treated as target structures.

This inventory deliberately does not establish a final schema count.

### 4.1 `geography` — spatial foundation

Candidate tables:

| Table | Responsibility |
|---|---|
| `units` | Geographic areas and territories, including administrative, electoral, statistical, historical and ecological units. |
| `systems` | Geographic relationship systems, such as administrative, electoral, statistical and hydrological systems. |
| `relations` | Dated, typed relationships between geographic units within a defined system. |
| `features` | Physical geographic features such as rivers, lakes, mountains, valleys, coastlines and other mapped features. Their relationship to constructed infrastructure requires further design. |
| `places` | Physical sites, settlements, buildings, campuses, stations and identifiable locations. |
| `names` | Current, alternative, indigenous, historical and multilingual names. |
| `identifiers` | External geographic identifiers and source-system codes. |
| `shapes` | Versioned spatial representations of units, features and places. |
| `changes` | Geographic creation, subdivision, merger, renaming, relocation and dissolution events. |
| `participants` | Geographic entities participating in a geographic change, with roles. |
| `crosswalks` | Correspondence between different geographic units and boundary editions. |
| `connections` | Physical relationships such as river flow, tributary connection and other geographic connectivity. |
| `datasets` | Logical spatial datasets, such as terrain, soil, elevation, geology, land cover and satellite products. |
| `assets` | Actual versioned files and derived spatial artifacts belonging to datasets. |
| `layers` | Published and discoverable map layers with rendering metadata. |

Important design questions:

- Are natural and constructed features both canonical Geography features?
- Should Civic infrastructure reference a geographic feature, a shape or a dedicated spatial identity?
- How should roads, railway alignments, pipelines and other linear features be represented?
- How should a reservoir relate to its dam and underlying waterbody?
- How should historical and disputed boundaries be distinguished from official representations?
- How are geographic systems and overlapping hierarchies enforced?
- What is the correct model for physical places versus areas?
- How are geometry editions, coordinate reference systems, accuracy and provenance represented?
- When should crosswalks use exact correspondence, geometric overlap or a reviewed statistical reallocation?

PostGIS should be evaluated for curated vector geometry, topology and spatial queries. Large raster and distribution assets should use the existing S3-backed filesystem.

### 4.2 `civic` — infrastructure and public services

Candidate tables:

| Table | Responsibility |
|---|---|
| `infrastructure` | Stable identities of built infrastructure assets such as dams, bridges, highways, railways, power stations and pipelines. |
| `networks` | Road, rail, water, electricity and telecommunications networks. |
| `segments` | Individual sections of linear infrastructure. |
| `nodes` | Junctions, terminals, interchanges, switches and network connection points. |
| `facilities` | Functional facilities such as schools, hospitals, libraries, stations and public offices. |
| `projects` | Construction, rehabilitation, expansion and development projects. |
| `project_assets` | Relationships between projects and infrastructure assets. |
| `services` | Services delivered through facilities, networks and responsible institutions. |

Relationships to evaluate:

- Infrastructure to geographic features and shapes.
- Networks to segments and nodes.
- Facilities to physical places.
- Projects to infrastructure assets.
- Services to facilities and responsible institutions.
- Finance and Procurement to projects and their expenditure/contracts.

The current repository maps an existing `civic` schema into the governance redesign. This broader proposal does not automatically reverse that mapping. The local agent must examine the existing schema and document why Civic should remain distinct, be consolidated, or use a different structure.

### 4.3 `environment` — monitoring and environmental conditions

Candidate tables:

| Table | Responsibility |
|---|---|
| `stations` | Weather, water, air-quality and other environmental monitoring stations. |
| `sensors` | Instruments, calibration and operational configuration. |
| `readings` | Timestamped environmental measurements. |
| `models` | Environmental and climate model definitions, scenarios and configurations. |

The station's physical location comes from Geography.

Raw sensor readings belong to Environment.

Published monthly, annual or geographically aggregated statistical observations belong to Statistical.

The model must distinguish measured observations from modeled estimates and scenarios.

### 4.4 `biology` — living organisms and biodiversity

Candidate tables:

| Table | Responsibility |
|---|---|
| `taxa` | Scientific taxonomic identities of plants, animals, fungi and other organisms. |
| `names` | Scientific synonyms, common names and local names. |
| `surveys` | Biodiversity surveys, sampling exercises and observation methods. |
| `occurrences` | Documented observations of organisms at locations and times. |
| `habitats` | Sourced relationships between organisms and habitat types or environments. |
| `distributions` | Sourced or modeled species distribution ranges and their spatial assets. |

Important distinctions:

- A taxon is not an individual organism.
- An occurrence is not a population estimate.
- A modeled distribution is not a verified sighting.
- A population estimate belongs to Statistical and must retain its biological source and method.
- Sensitive wildlife locations may require restricted coordinates or generalized public distributions.

### 4.5 `agriculture` — cultivated production and livestock

Candidate tables:

| Table | Responsibility |
|---|---|
| `farms` | Farm identities and operators/owners. |
| `fields` | Cultivated plots with geographic representation. |
| `cultivations` | Crop cultivation cycles on fields. |
| `harvests` | Harvest events and actual production quantities. |
| `herds` | Managed livestock groups and their purpose. |
| `practices` | Irrigation, fertilization, soil management and other agricultural practices. |

Agricultural species identities should reference Biology.

Fields and farms must have meaningful geographic links.

Actual harvest records belong to Agriculture. National crop production and yield indicators belong to Statistical.

Agriculture should not duplicate Economy's products, markets or prices.

### 4.6 `economy` — products, markets, prices and production

Candidate tables:

| Table | Responsibility |
|---|---|
| `products` | Canonical identities of goods and services, including relevant specifications. |
| `markets` | Physical or organized markets linked to geographic places. |
| `prices` | Sourced price observations for products at markets and specific times. |
| `trades` | Documented exchanges and movements of goods and services. |
| `operations` | Economic activities such as mining, fishing, manufacturing, tourism, retail and trade. |
| `production` | Output associated with economic operations. |

A price observation must identify its product, market or geographic context, amount, currency, quantity, unit, price type, observation time and source.

Historical prices must preserve original currency and units. Inflation-adjusted or converted values must be derived separately with reproducible methodology.

A price quote is an Economy fact. An official price index or inflation series is a Statistical fact.

### 4.7 `statistical` — measurements and analytical series

Candidate tables:

| Table | Responsibility |
|---|---|
| `datasets` | Logical statistical collections, such as censuses and surveys. |
| `releases` | Published editions, corrections and vintages. |
| `indicators` | Definitions of measurable quantities. |
| `dimensions` | Statistical breakdown definitions, such as age, sex, residence and language. |
| `members` | Dimension-value assignments to series; exact naming and modeling require review. |
| `periods` | Reporting intervals and frequencies. |
| `series` | A defined indicator with geographic coverage, methodology and breakdowns. |
| `observations` | Actual reported, estimated or derived values. |
| `methods` | Measurement, survey, estimation and projection methodologies. |
| `derivations` | Traceable input and calculation relationships for derived observations. |

The statistical design must distinguish:

- Census counts.
- Survey estimates.
- Projections.
- Modeled estimates.
- Historical reconstructions.
- Administrative counts.
- Revised or corrected releases.

It must preserve geographic coverage, boundary edition, population definition, method, reporting period, release and uncertainty.

Do not treat missing values as zero or aggregate incompatible territories and populations.

The proposed `members` table and the relationship between series, dimensions and observations require a detailed SDMX-aligned review before adoption.

### 4.8 `history` — chronology and interpretation

Candidate tables:

| Table | Responsibility |
|---|---|
| `periods` | Stable identities of named historical periods and eras. |
| `definitions` | Source-specific period definitions, uncertain dates and geographic applicability. |
| `interpretations` | Evidence-backed historical explanations, arguments, influence and competing interpretations. |
| `accounts` | Historical research articles, biographies and thematic publications. |
| `editions` | Versioned publication content. |
| `chronologies` | Curated timelines organized by place, theme or period. |
| `entries` | Ordered records in a chronology. |
| `links` | Connections to geographic, political, legal, statistical, heritage and other domain records. |

History should reference actual Activity, Geography, Governance, Legal, Economy, Person and Heritage records.

It must not create a second event database or duplicate domain facts.

The proposed `links` mechanism is unresolved. A generic polymorphic FK must not be adopted. The local agent should investigate explicit association contracts and real FK enforcement.

Historical periods must support source-specific dates, approximate ranges, alternative calendars and uncertainty.

### 4.9 `heritage` — material and cultural heritage

Candidate tables:

| Table | Responsibility |
|---|---|
| `objects` | Identifiable artifacts, monuments, manuscripts, artworks and archaeological objects. |
| `collections` | Museum, archive, institutional and private collections. |
| `memberships` | Dated membership of objects in collections, including accession details. |
| `provenance` | Documented origin, discovery, custody, transfer and ownership history. |

Heritage objects should connect to places, periods, people, organizations, source evidence and historical accounts.

Intangible heritage, oral traditions and cultural practices require further consideration rather than automatically being forced into physical object records.

## 5. Existing domains and their continued responsibilities

The expansion must preserve and reconcile the current domain architecture.

| Schema/domain | Continuing responsibility |
|---|---|
| `reference` | Shared classifications, country identities, topics, scopes, patterns, versions and semantic definitions. |
| `legal` | Legal instruments, provisions, versions, applicability and legal authority. |
| `person` | Canonical individual identities and names. |
| `organization` | Canonical organization identities, memberships and physical presence. |
| `governance` | Government institutions, offices, mandates, holders and authority relationships. |
| `political` | Political parties, coalitions, affiliations and political positions. |
| `electoral` | Elections, contests, candidates, electorates and results. |
| `activity` | Events, public actions, occurrences and updates. |
| `finance` | Funds, budgets, allocations, transactions and liabilities/debt. |
| `procurement` | Procurement plans, tenders, lots, bids, awards, contracts and amendments. |
| `source` | Publishers, original documents, captures, attribution and verification. |
| `filesystem` | File identities, immutable versions, folders, tags and S3-backed storage. |
| `engine` | Processing runs, jobs, events and reliable execution. |
| `audit` | Review decisions and immutable accountability records. |
| `auth` | Accounts, identities, roles, permissions and access. |
| `participation` | Existing proposed public/official feedback and review capability; reconcile with the broader evidence model. |

The exact current and proposed schema counts must be verified from active SQL, migrations and domain contracts.

The schema-redesign README preserves an earlier pre-rewrite inventory of 24 application/runtime PostgreSQL schemas and 141 tables, measured from the former TypeORM repository definitions on 7 November 2026. That is a historical baseline, not the active SQL state. On 11 November 2026, `source/schema/database/migrations.yaml` defines six schemas with executable SQL folders (`auth`, `engine`, `filesystem`, `geography`, `legal`, `reference`) and 13 ordered migration files; the current Dryv contracts describe additional domain surfaces, but that does not mean corresponding full database schemas are implemented. This is a repository-file inventory, not a claim about any live database. The schema-redesign index separately has 18 original domain-design documents; this expansion adds seven proposed domain design briefs. Keep both counts and their dates/meanings explicit.

## 6. Additional domains to evaluate

These subjects may justify dedicated schemas when their operational models become sufficiently specialized.

| Candidate domain | Potential responsibility |
|---|---|
| Education | Schools, campuses, curricula, enrollment, qualifications and education systems. |
| Health | Healthcare delivery, public-health programs, facilities and disease surveillance. |
| Linguistics | Language families, dialects, linguistic relationships, evolution and documented distribution. |
| Migration | Migration events, movements, routes, populations and settlement changes. |

Their identities and measurements should initially reuse Geography, Person, Organization, History and Statistical where appropriate.

Do not create new schemas simply to give every topic its own label.

## 7. Important cross-domain modeling examples

### 7.1 Roads and railways

A road or railway needs:

- A stable infrastructure identity.
- A network identity.
- Individual segments.
- Junctions or network nodes.
- Spatial geometry.
- Operator and ownership relationships.
- Construction and maintenance history.
- Projects and procurement relationships.
- Traffic, capacity and condition measurements.

Geography provides spatial representation; Civic owns functional infrastructure; Governance and Organization identify responsible institutions/operators; Finance and Procurement describe investment and contracts; Statistical provides comparable traffic and infrastructure indicators; History explains development.

### 7.2 Dams and reservoirs

A dam is constructed infrastructure.

A reservoir is a geographic waterbody or feature.

They should be connected but must not be represented as the same entity.

The model should support:

- Dam identity and construction.
- Reservoir extent and changing water surface.
- River and catchment relationships.
- Water-level observations.
- Discharge and rainfall measurements.
- Hydropower production.
- Irrigation and water-service connections.
- Affected settlements.
- Historical construction and environmental change.

### 7.3 Weather and climate

Raw measurements are recorded in Environment through stations, sensors and readings.

Large gridded weather and climate datasets are registered through Geography's spatial dataset and asset model.

Statistical holds comparable published summaries such as annual rainfall, temperature averages and drought indicators.

Modeled climate scenarios must remain distinguishable from observed historical weather.

### 7.4 Vegetation and NDVI

NDVI is a derived remote-sensing measurement, not a species identity or direct crop count.

The flow should be:

```text
Original satellite imagery
    -> filesystem/S3 preservation
    -> geography spatial dataset/assets
    -> registered NDVI derivation
    -> dated raster products
    -> spatial aggregation
    -> statistical observations
    -> map and trend visualization
```

Agriculture identifies cultivated fields and crops. Biology identifies species and vegetation types. Geography provides boundaries and spatial datasets.

NDVI values should retain imagery source, acquisition date, resolution, processing method, quality mask and calculation version.

### 7.5 Animals and biodiversity

A species is represented in Biology.

An observation of that species is a biological occurrence.

A survey documents how observations were collected.

A distribution model provides an evidence-qualified geographic range.

An estimated population is a Statistical measurement.

Historical research explains how the species or ecosystem changed across time.

### 7.6 Agriculture and food markets

A crop species belongs to Biology.

A farm and cultivation cycle belong to Agriculture.

A harvest belongs to Agriculture.

A market and product price belong to Economy.

A national crop-production or yield indicator belongs to Statistical.

Historical cultivation and trade practices belong to History.

### 7.7 Historical infrastructure and economic development

A railway remains a Civic infrastructure identity.

Its historical route editions belong to Geography.

Its construction and opening events belong to Activity.

Its funding and contracts connect to Finance and Procurement.

Its freight, passenger and trade measurements connect to Statistical and Economy.

Historical explanations connect the railway to settlements, markets, political decisions and economic changes.

## 8. Statistical data ownership

Statistics is a cross-domain measurement capability, not a universal owner of numeric facts.

| Original fact | Canonical owner | Possible statistical result |
|---|---|---|
| Sensor temperature reading | Environment | Annual average temperature |
| Market price quote | Economy | Consumer price index |
| Crop harvest | Agriculture | Regional crop production |
| Wildlife occurrence | Biology | Estimated species population |
| Official candidate votes | Electoral | Turnout and comparative voting trends |
| Road infrastructure segment | Civic/Geography | Road density |
| Budget transaction | Finance | Public expenditure indicators |
| Census response or count | Statistical collection process | Published population distribution |

Statistical observations must remain traceable to source records and methods.

A derived aggregate must not become an untraceable substitute for its underlying facts.

## 9. Geographic and temporal comparison

Mzizi should eventually support questions such as:

- How did population change in the territory corresponding to a modern county?
- How did vegetation cover change across a watershed?
- How did rainfall vary over decades?
- How did a historical railway change market access?
- How did administrative boundary changes affect reported census totals?
- How did wildlife distribution change over time?
- How did the prices of staple goods evolve?
- How did public infrastructure investment vary across counties?

A comparison must account for the actual geography and definitions used in each observation.

Historical boundaries must not be silently replaced by modern boundaries.

Spatial overlap alone does not justify redistributing population or economic values. Reallocation requires an appropriate methodology and should be presented as a derived estimate.

The UI should distinguish original observations, reconstructed estimates and incompatible comparisons.

## 10. Data acquisition and processing

The expansion must preserve Mzizi's existing four acquisition categories.

| Category | Meaning | Example |
|---|---|---|
| Seeded/static | Manually researched, finite baseline information | Canonical historical period identities |
| Seeded/pattern | Generated structures based on established definitions | Expected administrative offices |
| Automated/collected | Downloaded, extracted or acquired source information | Rainfall records and census publications |
| Derived | Calculated or generated information from other records | County NDVI averages and population comparisons |

Table eligibility does not determine the origin of every row.

Each record or artifact must retain its actual provenance and generation lineage.

### Proposed general lifecycle

```text
Authoritative or researched source
    -> source registration
    -> original artifact preservation
    -> extraction and normalization
    -> candidate/staging representation
    -> classification and relationship proposals
    -> review and verification
    -> canonical domain records
    -> derived products and statistical outputs
    -> approved API capabilities
    -> user-facing exploration
```

The existing architecture separates source acquisition, extraction, intelligence, filesystem management, canonical data, the Engine and the NestJS API.

Do not collapse these responsibilities during expansion.

### Object storage

Continue using the already configured SeaweedFS S3-compatible storage.

- Existing bucket: `mzizi`.
- `public/` is the anonymous-public prefix.
- All other prefixes remain private by default.
- Preserve original artifacts and immutable file versions.
- Store large spatial, raster, imagery and documentary assets in S3.
- Keep metadata, identities, constraints and relationships in PostgreSQL.

This document does not authorize infrastructure or storage configuration changes.

## 11. Technical standards to evaluate

These are candidate standards and technologies, not a requirement to implement all of them.

| Area | Standards/technology to evaluate |
|---|---|
| Spatial database | PostgreSQL + PostGIS |
| Vector interchange | GeoJSON, GeoPackage, GeoParquet |
| Large raster | Cloud Optimized GeoTIFF |
| Multidimensional environmental data | NetCDF, Zarr and CF conventions |
| Spatial catalog | STAC |
| Spatial feature APIs | OGC API — Features |
| Map tile APIs | OGC API — Tiles |
| Environmental retrieval | OGC API — EDR |
| Statistical exchange | SDMX |
| Biodiversity records | Darwin Core and GBIF conventions |
| Agricultural indicators | FAOSTAT definitions |
| Product classification | UN Central Product Classification |
| Interactive mapping | MapLibre or equivalent |
| Routing | A suitable graph/routing engine over validated infrastructure networks |

PostGIS should manage curated spatial identities and queries. Large source and derived files should remain in S3.

The system should expose appropriate vector tiles, raster tiles, feature APIs and analytical endpoints rather than forcing the frontend to download large original files.

## 12. Unified user experience

The UI should provide common contextual dimensions:

1. Place.
2. Time or historical period.
3. Topic.

The available capabilities should be determined by the registered topic/capability contracts and actual data availability.

A user selecting Nairobi County should be able to explore:

- Geography: boundaries, rivers, terrain and physical features.
- Civic: roads, railways, facilities and infrastructure projects.
- Environment: weather, rainfall and environmental conditions.
- Biology: documented species and habitat information.
- Agriculture: cultivated land and agricultural activities where applicable.
- Governance: institutions, offices and representatives.
- Political and Electoral: parties, candidates and election results.
- Economy: markets, products and price histories.
- Statistics: population, demographics and measurable trends.
- History: territorial development, events and research accounts.
- Heritage: artifacts and historical collections.

### Shared UI components

- Geographic map and layer manager.
- Time-period selector.
- Historical timeline.
- Statistical chart and comparison interface.
- Source/evidence viewer.
- Entity profile and relationship explorer.
- Spatial dataset and map legend viewer.
- Research article and historical account viewer.
- Provenance and uncertainty indicators.

A page should show only capabilities and data that actually exist. Missing information must not be presented as zero or fabricated.

## 13. Important unresolved architecture questions

The following questions must be investigated before converting this proposal into final schema documents.

### Geography

- How should `units`, `features` and `places` divide ownership?
- Should constructed infrastructure have a Geography feature identity or only Civic identity with spatial representations?
- How should roads, railways, pipelines and network geometry relate?
- Should reservoirs be features, places or both under distinct meanings?
- How should boundary editions, crosswalks and uncertain geometry be enforced?
- How should natural systems and overlapping geographic hierarchies work?

### Environment

- Should all environmental observations live in Environment?
- How should gridded satellite/climate observations relate to sensor readings?
- Are model definitions and model executions separate?
- Which measurements are raw observations and which are derived indicators?

### Biology

- How should taxonomy versions and authoritative identifiers be managed?
- How should plant and animal occurrences be represented?
- When does an individual animal or plant deserve its own identity?
- How should biodiversity surveys and modeled distributions be linked?
- What public restrictions are needed for sensitive species locations?

### Agriculture

- What constitutes a farm, field, cultivation and agricultural enterprise?
- How should livestock identities differ from population estimates?
- How should agricultural production connect to economic production without duplicating facts?
- What land tenure and agricultural ownership relationships are required?

### Economy

- How should product specifications, currencies and units be normalized?
- How should historical currencies be preserved?
- How do price quotes relate to published price indices?
- How should trade flows and economic operations be modeled?
- Which economic activities need dedicated specialized structures?

### Statistics

- Is the proposed series/dimension/member model sufficient for SDMX-compatible datasets?
- How are multi-dimensional observations uniquely identified?
- How should missing, suppressed, estimated and revised values be represented?
- How should boundary changes affect comparability?
- Which observations remain canonical in their source domains?

### History and Heritage

- How should historical periods support multiple definitions and uncertainty?
- How should Activity events be connected to historical chronologies?
- What is the enforceable relationship model for historical research links?
- How should conflicting interpretations be represented?
- How should intangible heritage and oral traditions fit?
- How should provenance and custody histories be modeled?

### Cross-domain architecture

- Which new domains justify separate PostgreSQL schemas?
- Which capabilities can be implemented within existing schemas?
- Which associations need dedicated tables?
- How should topic/capability discovery resolve to versioned backend contracts?
- How should APIs expose historical, spatial and statistical comparisons?
- Which data should be generated, collected, curated or derived?

## 14. Documentation and design work required

The next architecture/documentation phase should:

1. Reconcile this vision with the current database schema inventory.
2. Inspect all existing schema-redesign documents.
3. Preserve the connected Reference–Geography–Legal foundation.
4. Refine Geography around areas, physical features, places, boundaries, spatial datasets and human-made structures.
5. Clarify Civic infrastructure and service ownership.
6. Design Environment and Biology.
7. Design Agriculture and Economy.
8. Reconcile Statistical ownership, dimensions, observations and derivations.
9. Expand History and Heritage.
10. Update cross-domain relationship diagrams.
11. Explain original facts versus derived statistical products.
12. Document geospatial data acquisition, storage, processing and publication.
13. Document historical and temporal comparison rules.
14. Update UI/API capability planning.
15. Record all unresolved decisions and explain alternatives.
16. Maintain consistent improvement indexes and project architecture documentation.

Every new domain design should explain:

- Domain purpose.
- What it owns.
- What it excludes.
- Candidate tables and responsibilities.
- Real primary and foreign-key relationships.
- Geographic relationships.
- Temporal responsibilities.
- Evidence and provenance.
- Acquisition categories.
- Derived-data ownership.
- Example real-world queries.
- UI and API usage.
- Unresolved decisions.
- Current design status.

## 15. Status and authority

This document records the expanded vision and candidate architecture as of 11 November 2026.

It does not establish:

- A final number of PostgreSQL schemas.
- A final table count.
- Approved table names.
- Approved column definitions.
- Approved migrations.
- Approved API contracts.
- Approved seed structures.
- Approved domain consolidation.
- Permission to change deployed data or infrastructure.

The previously discussed 125-table inventory is a preliminary discussion artifact, not an authoritative schema count. Its relationships, duplicate responsibilities, table names and missing constraints must be examined before being reused.

The existing repository inventory and active contracts remain the baseline.

The connected Reference–Geography–Legal foundation and Task 03 retain their current responsibilities. This expansion should inform subsequent design work without weakening or bypassing their acceptance requirements.

**The goal is to turn Mzizi into a connected, evidence-first African knowledge system in which physical geography, nature, infrastructure, people, institutions, history, statistics and economics can be researched and explored together across place and time.**

All subsequent design changes must explain what is being changed, why it is needed, which existing responsibility it affects, what alternatives were considered and what remains uncertain.

## 16. Cross-domain ownership rules to carry into detailed designs

These are working architectural boundaries for review. They do not approve schemas or tables.

| Boundary | Proposed owner and relationship |
|---|---|
| Geography / Civic | Geography owns geographic units, natural features, physical places and spatial representations. Civic owns built infrastructure identity and function. Roads/railways are Civic networks with segments and nodes carrying or referencing versioned geographic geometry; do not create competing road identities in Geography. A dam is Civic infrastructure; its reservoir/waterbody is Geography. |
| Environment / Statistical | Environment owns station/sensor observations at their original temporal and spatial resolution. Statistical owns published or derived comparable series, aggregations and indicators. Aggregated rainfall derived from readings carries inputs and method; do not copy raw readings into Statistical. |
| Biology / Agriculture | Biology owns taxa, biodiversity surveys and wild or cultivated organism occurrences. Agriculture owns managed farms, fields, cultivation cycles, livestock management and harvest events. Agriculture references crop/livestock taxa; a crop's cultivation is not another taxon. |
| Agriculture / Economy | Agriculture owns actual cultivation and harvest facts, including their quantity once. Economy owns product identity, markets, exchange, prices and economic production relationships. Link a harvest to its product where useful; do not re-record the same harvest quantity as economic output. |
| Economy / Statistical | Economy owns individual sourced market price quotes, preserving currency, quantity, unit, place and observation date. Statistical owns official indices and comparable statistical series. Conversions and inflation adjustment are reproducible derived observations with pinned inputs, rate/index release and method. |
| History / Activity | Activity owns the occurrence/event identity and its observed date or interval. History owns period definitions, research interpretations and curated chronology membership. History links to Activity events through explicit typed relationships; it does not create duplicate events. |
| History / Geography | Geography owns area identity, relationship systems and boundary editions. History links sources and interpretations to those identities and explains change without making modern national borders the default frame. |
| History / Heritage | Heritage owns artifact/collection identity and custody/provenance records. History owns interpretation and chronological narratives, linked to heritage records and their evidence. |
| Person / Statistical | Person owns individual identities. Statistical owns aggregate demographic definitions and measurements. Population estimates never generate individual Person rows. |

The connected foundation's settled rules remain authoritative: reference definitions are reusable meanings; domains own actual entities; direct typed FKs connect to Geography or Legal where applicable; legal basis, territorial reach, physical presence, and statistical scope remain distinct.

## 17. Spatial data lifecycle and products

Separate four representations: (1) preserved original spatial source artifacts in the existing S3-backed filesystem, pinned to immutable file versions; (2) curated canonical geometry in PostGIS for stable identities and operational spatial queries; (3) derived spatial assets such as reprojected, tiled, generalized, rasterized or aggregated products, each linked to exact input versions and processing method; and (4) published map layers/API views that expose an approved representation and its availability, license, date, uncertainty and attribution. Statistical aggregation across geography is a fifth analytical output and must record boundary edition, crosswalk or allocation method, and input coverage.

Evaluate GeoJSON for interchange and APIs; GeoPackage and GeoParquet for packaged/vector analytical transfer; Cloud Optimized GeoTIFF for cloud-hosted rasters; NetCDF/Zarr with CF metadata for multidimensional environmental data; STAC for discovery and metadata around spatiotemporal assets; OGC APIs for feature, map, tile, process and environmental data retrieval. These formats and standards complement PostGIS and filesystem custody; none is a canonical database schema by itself. Historical boundary editions remain immutable representations. Crosswalks must identify source/target boundary versions, method, weights where used, and uncertainty; a crosswalk does not rewrite historical geometry or guarantee comparability.

Rainfall and temperature may originate as station readings or gridded products; NDVI, elevation, biodiversity suitability and land cover may arrive as source rasters/vectors or be derived. Register coverage, time range, resolution, coordinate reference, units, nodata semantics, licensing, lineage and privacy/sensitivity. Only expose map/chart capabilities supported by available data and appropriate public access.

## 18. Product query contract

A shared exploration request should carry a topic/capability identifier, place or coordinate input, as-of date or interval, and explicitly supported filters. A registered backend capability resolves that request to a reviewed domain query; clients must not traverse arbitrary table names. A response should identify requested and resolved geographic scope, applicable boundary edition, data period, method/release, evidence links, uncertainty, coverage gaps, and any fallback/unavailable reason. Coordinates identify candidate spatial coverage, not residence, legal jurisdiction or eligibility. Place/time/topic selection is a product context shared by maps, timelines, infrastructure networks, statistical charts, market comparisons, biodiversity distributions, institutional structures and source evidence.

## 19. Standards review notes (11 November 2026)

Evaluate standards as exchange/metadata contracts and map them into Mzizi-owned concepts rather than copying their schemas. SDMX is an official statistical data and metadata exchange standard (the SDMX site lists 3.1 specifications released in May 2025); test dataset structures, dimensions, codelists, releases and revisions against Mzizi's statistical model. Darwin Core is a biodiversity vocabulary and exchange framework; GBIF occurrence publishing adds dataset and archive conventions, so evaluate occurrences and sampling-event data while retaining Mzizi's own evidence, uncertainty and access rules. FAOSTAT is a statistical dissemination source spanning agriculture, production, trade, prices, inputs and environmental domains, useful for definitions and source data but not an agriculture schema template. UN CPC is a product classification; the UN Statistics Division currently presents draft CPC Version 3.0 revision work, so pin any adopted version and do not assume a draft is final. OGC API standards and STAC support geospatial service and asset discovery. CF conventions support describing quantities and spatial/temporal metadata in NetCDF and related climate/geoscience datasets; test version and conformance for each collection.

Sources: [SDMX specifications](https://sdmx.org/standards-2/), [Darwin Core terms](https://dwc.tdwg.org/terms/), [GBIF data standards](https://www.gbif.org/standards), [FAOSTAT data sources](https://www.fao.org/family-farming/data-sources/en/), [UN Central Product Classification](https://unstats.un.org/unsd/classifications/cpc/), [OGC API – Features](https://www.ogc.org/standards/ogcapi-features/), [STAC](https://www.ogc.org/standards/stac/), [CF conventions](https://cfconventions.org/).

## 20. Existing-versus-proposed implementation baseline

At this documentation pass, executable SQL is limited to the six schemas and ordered migrations identified in section 5. Current contract sources in `dryv/contracts` include foundation Reference/Geography, legal, person, governance, elections/political, finance, statistics/services, filesystem, source, audit, place, website, exchange and pipeline surfaces. The breadth of a contract folder does not prove a complete schema, runtime endpoint or populated dataset. The 18 original redesign documents are historical planning artifacts; seven new briefs link from the schema-redesign index. Proposed tables throughout this file remain hypothetical and not approved for SQL. Confirm live database state separately before reporting deployed objects.
