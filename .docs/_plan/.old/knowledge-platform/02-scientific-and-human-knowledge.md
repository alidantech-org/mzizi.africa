---
id: DOC-MZIZI-SCIENTIFIC-KNOWLEDGE-20261111
name: Scientific and human knowledge architecture
type: architecture-proposal
tags: [biology, environment, health, agriculture, education, linguistics, science]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-11
---

# Mzizi Africa — Scientific and Human Knowledge Architecture

> STATUS: WORKING DESIGN PROPOSAL. The tables below are candidates. They require table-level ownership, constraint, duplication and source-standard reviews before SQL approval.

## 1. Purpose

Mzizi must be capable of supporting scientific research and education, not merely storing government statistics.

The scientific architecture should explain:

- Which organisms exist.
- How organisms relate to one another.
- Where species are distributed.
- What environmental conditions exist in different places.
- Which conditions support or threaten particular organisms.
- Which pathogens, pests and vectors affect living organisms.
- How diseases and infestations develop geographically and over time.
- How agriculture interacts with soil, water, weather and biodiversity.
- How human health relates to animal health and environmental conditions.
- How education systems and curricula develop.
- How languages evolve and spread.
- How scientific findings can be connected to historical evidence and statistical measurements.

The architecture should use shared entities and relationships rather than creating a separate schema for every scientific discipline.

## 2. Scientific domain boundaries

Five domains provide the primary scientific foundation.

| Domain | Primary question | Canonical responsibility |
|---|---|---|
| Geography | Where is it? | Spatial identities, physical structures, landforms and geometry. |
| Environment | What conditions exist? | Environmental measurements, monitoring and modeled conditions. |
| Biology | What living things exist? | Organisms, taxonomic identities, biological traits and interactions. |
| Health | What conditions affect living organisms and populations? | Health conditions, outbreaks, surveillance and interventions. |
| Agriculture | What is cultivated and managed? | Farms, fields, cultivation and agricultural production. |

Education and Linguistics provide two additional independent knowledge domains.

Migration remains a cross-domain capability initially.

## 3. Geography

### Purpose

Geography is the spatial foundation of the scientific knowledge system.

It must support administrative, physical, environmental, ecological, historical and statistical geography.

### Candidate tables

| Table | Responsibility | Important connections |
|---|---|---|
| `units` | Geographic areas and territories. | Reference, Governance, Statistical, History and all geographically scoped domains. |
| `systems` | Distinct systems of geographic relationships, such as administrative, electoral, ecological and hydrological systems. | Reference and geographic relationships. |
| `relations` | Typed and dated relationships between geographic units. | Statistical, Governance, Linguistics, History and Geography. |
| `features` | Rivers, lakes, mountains, valleys, plains, geological features, wetlands and other physical features. | Environment, Biology, Civic and Agriculture. |
| `places` | Physical sites, settlements, buildings, stations, campuses and identifiable locations. | Civic, Organization, Education, Health and Economy. |
| `names` | Historical, indigenous, local, multilingual and alternative names. | History, Linguistics and Reference. |
| `identifiers` | External geographic identifiers and codes. | Source and Reference. |
| `shapes` | Versioned geometry representations of units, features, places and spatial assets. | PostGIS, Environment, Civic, Biology and Statistical. |
| `changes` | Geographic creation, subdivision, merger, relocation, renaming and dissolution. | History, Activity and Statistical. |
| `participants` | Typed geographic entities participating in a geographic change. | Geographic units and changes. |
| `crosswalks` | Correspondence between different geographic unit editions and boundary systems. | Statistical and historical comparisons. |
| `connections` | Physical connectivity such as tributaries, drainage connections and other spatial network relationships. | Environment and Biology. |
| `datasets` | Logical spatial dataset identities and their coverage/metadata. | Source, Filesystem and statistical/geospatial consumers. |
| `layers` | Published map-layer configuration and discoverability. | Frontend maps and spatial APIs. |

The exact division between `relations` and `connections`, and the geometry ownership strategy, must be examined to prevent duplicate relationships and generic untyped records.

`shapes` must not become a file-storage table. Actual geometry assets and large files must reference Filesystem versions.

### Natural and physical geography

The model must support:

- Rivers, lakes and catchments.
- Mountains and elevation.
- Geological formations.
- Soil regions and soil profiles.
- Plains, plateaus and valleys.
- Coastlines and wetlands.
- Drainage networks.
- Climate and ecological regions.
- Natural hazards.
- Historical and reconstructed territories.

Human-made infrastructure has functional identity in Civic but can have spatial representations through Geography.

### Historical geography

Historical boundaries must remain distinct from current boundaries.

A territory can have:

- Multiple sourced geometry editions.
- Different names.
- Different administrative relationships.
- Uncertain or approximate extents.
- Disputed territorial claims.
- Historical relationships that no longer exist.

Geographic crosswalks should support comparisons across boundary changes.

Do not silently redistribute statistical values using modern boundaries. Any reallocation requires an explicit methodology.

## 4. Environment

### Purpose

Environment owns environmental observations, monitoring and environmental model products.

It should support both point observations and spatially distributed environmental datasets.

### Candidate tables

| Table | Responsibility | Connections |
|---|---|---|
| `stations` | Monitoring station identity, location and operator. | Geography, Organization and Source. |
| `sensors` | Measurement instruments, capabilities and calibration. | Stations and environmental readings. |
| `readings` | Timestamped original measurements, units and quality information. | Sensors, Geography, Statistical and Source. |
| `surveys` | Environmental sampling and field research campaigns. | Geography, Biology and Source. |
| `models` | Environmental model definitions, versions, scenarios and methodologies. | Statistical, Biology and Agriculture. |
| `outputs` | Versioned modeled products, predictions and spatial datasets. | Filesystem, Geography and Statistical. |

### Environmental subject coverage

The system must accommodate:

- Rainfall and precipitation.
- Temperature.
- Humidity.
- Wind speed and direction.
- Solar radiation.
- Evapotranspiration.
- Soil moisture.
- Soil pH and nutrient measurements.
- Water quality.
- River and lake levels.
- Air quality.
- Pollution.
- Floods and droughts.
- Land cover and vegetation indices.
- Climate trends and climate scenarios.

These are classifications and measurement types, not separate schemas or automatically separate tables.

### Soil ownership

Distinguish:

1. Soil type and soil geography: Geography.
2. Actual soil measurements: Environment.
3. Biological soil organisms: Biology.
4. Soil-management activities: Agriculture.
5. Agricultural suitability: derived scientific analysis.

This prevents four domains from independently storing the same soil identity or measurement.

### Environmental observations versus statistical indicators

An original sensor reading belongs to Environment.

A published annual average rainfall indicator belongs to Statistical.

A modeled rainfall projection belongs to an identified model output and must not be presented as an observed measurement.

## 5. Biology

### Purpose

Biology represents living organisms, their identities, characteristics, interactions and sourced occurrences.

It must support scientific taxonomy and ecological relationships across Africa.

### Candidate tables

| Table | Responsibility |
|---|---|
| `taxa` | Stable taxonomic identities for plants, animals, fungi, bacteria and other organisms. |
| `names` | Scientific, common, local and alternative organism names. |
| `identifiers` | External taxonomy identifiers and authority versions. |
| `traits` | Biological characteristics and attributes. |
| `tolerances` | Evidence-backed environmental ranges and conditions associated with organisms. |
| `surveys` | Biodiversity research and sampling exercises. |
| `occurrences` | Sourced observations or specimens at a location and time. |
| `distributions` | Sourced or modeled geographical distributions. |
| `interactions` | Relationships between organisms and their hosts, predators, prey, vectors, parasites and other organisms. |

These are candidate tables, not a requirement to create every table independently. Some concepts may be represented through constrained relationships or classifications after reviewing real datasets.

### Organism identities

A taxon must have a stable identity independent of its names.

For example:

- A scientific name can change.
- A local name may have several spellings.
- Two species may have similar common names.
- Taxonomic authorities may disagree.
- A species may be reclassified.

The identity and its source-specific classifications must be preserved rather than overwriting historical names.

### Plant and animal relationships

The system must support:

- Host and pathogen.
- Host and parasite.
- Predator and prey.
- Pollinator and plant.
- Vector and disease agent.
- Pest and affected crop.
- Invasive and native species.
- Symbiotic organisms.
- Competition and ecological dependence.

A pest is not necessarily a separate biological class of organism.

A species becomes a pest in a particular agricultural or ecological context.

For example, a grasshopper can be a normal biological occurrence in one setting and a documented agricultural pest in another.

This context must be modeled through sourced interaction and incident records.

### Environmental suitability

The system should support research into:

- Plant temperature tolerance.
- Animal temperature tolerance.
- Rainfall requirements.
- Water availability.
- Soil conditions.
- Elevation ranges.
- Humidity preferences.
- Habitat dependence.
- Seasonal behavior.
- Climate vulnerability.

`biology.traits` describes organism characteristics.

`biology.tolerances` records documented ranges and their scientific evidence.

`environment.readings` records actual environmental measurements.

`geography` provides the spatial context.

`agriculture` provides cultivation requirements and managed production context.

A suitability prediction must be distinguishable from a scientifically documented tolerance.

## 6. Health and One Health

### Purpose

Health should support human, animal and plant health research using a connected One Health approach.

One Health recognizes that human health, animal health, plant health and environmental conditions can influence one another.

### Candidate tables

| Table | Responsibility | Connections |
|---|---|---|
| `conditions` | Disease, disorder, syndrome and other health-condition identities. | Biology and Reference. |
| `incidents` | Documented outbreak, infestation or disease occurrence. | Geography, Biology, Environment and Agriculture. |
| `surveillance` | Disease-monitoring programmes and surveillance definitions. | Organization, Environment and Statistical. |
| `interventions` | Treatment, vaccination, prevention and control activities. | Agriculture, Biology, Civic, Organization and Activity. |
| `exposures` | Documented exposure of populations or organisms to hazards or agents. | Environment, Biology, Geography and Statistical. |

### Disease versus pathogen

A disease is not the same as the organism causing it.

For example:

- Disease identity: Health.
- Fungal pathogen: Biology.
- Host crop: Biology.
- Affected field: Agriculture and Geography.
- Environmental conditions: Environment.
- Outbreak record: Health.
- National incidence statistics: Statistical.

The same distinction applies to animal and human diseases.

### Pests and infestations

A pest is an organism with an evidenced harmful impact in a particular context.

- Pest identity: Biology.
- Host relationship: Biology.
- Infestation incident: Health.
- Affected crop and farm: Agriculture.
- Environmental conditions: Environment.
- Control intervention: Health/Agriculture, according to the action's ownership.
- Recorded losses: Agriculture and Statistical.

Do not create separate `plant_disease`, `animal_disease`, `pests` and `pathogens` schemas.

### Health privacy

Mzizi should prioritize:

- Public-health statistics.
- Official disease surveillance.
- Research publications.
- Animal and plant disease reporting.
- Geographic outbreak information at appropriate resolution.
- Scientific and environmental evidence.

Identifiable patient records are outside the default public knowledge model.

Access restrictions, aggregation, anonymization and sensitive-location protection must be designed before any health data ingestion.

## 7. Agriculture

### Purpose

Agriculture owns managed cultivation and agricultural production, not all biological knowledge.

### Candidate tables

| Table | Responsibility |
|---|---|
| `farms` | Managed agricultural operation identity and operator relationships. |
| `fields` | Individual cultivated plots and their spatial identity. |
| `cultivations` | Crop, field, season and cultivation-cycle records. |
| `herds` | Managed livestock groups, distinct from wild populations. |
| `practices` | Dated farming, irrigation, fertilization, soil and livestock-management practices. |
| `harvests` | Actual harvested products, quantities, units, time and source. |
| `suitability` | Optional derived crop/location suitability assessments, if a stable operational model justifies a dedicated table. |

### Connections

- Crop and animal species: Biology.
- Disease and pest information: Health and Biology.
- Soil and climate: Geography and Environment.
- Farm location and field geometry: Geography.
- Markets and agricultural products: Economy.
- Agricultural output measurements: Statistical.
- Irrigation and storage infrastructure: Civic.
- Agricultural history: History.

### FarmAI use

FarmAI should be able to combine:

1. Farm and field location.
2. Crop identity.
3. Soil characteristics.
4. Rainfall and weather history.
5. Crop environmental tolerances.
6. Pest and disease evidence.
7. Agricultural practices.
8. Historical yield data.
9. Market prices.

The resulting recommendations must retain the model, input datasets, version, uncertainty and geographic/time coverage.

Private farm records and user-specific recommendations belong to FarmAI's operational data environment unless deliberately contributed under an appropriate agreement.

## 8. Education

### Purpose

Education models educational systems, knowledge structures, curricula and qualifications.

It should support comparison between African education systems without assuming they share identical structures.

### Candidate tables

| Table | Responsibility |
|---|---|
| `systems` | National and regional education-system identities and editions. |
| `levels` | Educational levels and their relationships. |
| `programmes` | Educational programmes and programme types. |
| `curricula` | Curriculum identities and versioned editions. |
| `subjects` | Subjects taught within programmes and curricula. |
| `frameworks` | National and international qualification frameworks. |
| `qualifications` | Certificates, diplomas, degrees and other awards. |
| `accreditations` | Recognition and accreditation of institutions/programmes. |

Schools, universities and education providers are Organizations.

Their campuses and buildings are Geography places.

Facility functions are Civic facilities.

Enrollment totals, examination performance and literacy indicators are Statistical observations.

Individual student records should not be imported into the public knowledge platform without a separate, explicit privacy and legal design.

Evaluate UNESCO ISCED for cross-country educational classification.

## 9. Linguistics

### Purpose

Linguistics models languages, dialects, language families, scripts, linguistic characteristics and historical distribution.

### Candidate tables

| Table | Responsibility |
|---|---|
| `languages` | Stable identities for languages and dialects, with a defined classification kind. |
| `names` | Endonyms, exonyms, historical and alternative language names. |
| `relations` | Language-family, ancestry and other typed linguistic relationships. |
| `scripts` | Writing systems and their historical identities. |
| `features` | Sourced phonological, grammatical and other linguistic characteristics. |
| `attestations` | Documented historical forms and examples from evidence. |
| `distributions` | Dated geographic language-use or language-presence assertions. |

Language identity must be distinct from:

- A country’s official language.
- A person's preferred language.
- A language's geographical distribution.
- A census estimate of speakers.
- A historical linguistic reconstruction.

Reference provides shared classification meanings.

Geography provides locations and regions.

Statistical provides speaker estimates and census measurements.

History provides language evolution and historical context.

Evaluate Glottolog, ISO 639 and appropriate UNESCO language resources. Preserve alternative scholarly classifications and their sources.

## 10. Migration and human movement

Migration should initially be modeled across existing domains.

| Concept | Initial owner |
|---|---|
| Migration events | Activity |
| Historical migration explanations | History |
| Population flow measurements | Statistical |
| Origin/destination territories | Geography |
| Migration corridors | Geography |
| Identified historical people | Person |
| Animal migration | Biology |
| Language-community movement | Linguistics |

A future dedicated Migration schema may become appropriate for detailed displacement episodes, mobility networks, route histories and specialized operational workflows.

Do not create it merely because migration is an important research topic.

## 11. Cross-domain scientific examples

### Example A: Crop disease

```text
biology.taxa
    -> pathogen identity

biology.interactions
    -> pathogen affects crop

health.conditions
    -> disease identity

health.incidents
    -> documented outbreak

agriculture.farms
agriculture.fields
    -> affected agricultural operation

geography
    -> field and affected region

environment.readings
    -> rainfall, temperature and other measurements

health.interventions
    -> documented control action

agriculture.harvests
    -> actual production result

statistical.observations
    -> regional disease/yield indicators
```

The relationship does not establish that rainfall caused an outbreak merely because the measurements overlap in time and place. Causal explanations require appropriate evidence and methodology.

### Example B: A plant's climate suitability

```text
biology.taxa
    -> plant identity

biology.traits
    -> plant characteristics

biology.tolerances
    -> documented climate/soil tolerance

geography.units
    -> comparison areas

environment.readings
    -> measured conditions

environment.models
    -> suitability model

environment.outputs
    -> derived spatial result

agriculture.suitability
    -> optional farm/crop-specific assessment
```

### Example C: An animal disease

```text
biology.taxa
    -> animal host

biology.taxa
    -> disease-causing organism

health.conditions
    -> disease identity

health.incidents
    -> documented outbreak

biology.distributions
    -> organism distribution

geography
    -> affected territories

environment
    -> environmental observations

statistical
    -> reported incidence and mortality estimates
```

### Example D: Educational development

```text
education.systems
    -> national education system

education.curricula
    -> curriculum edition

education.subjects
    -> curriculum subjects

education.qualifications
    -> awards

organization.entities
    -> educational institutions

civic.facilities
    -> school/university facility

geography.places
    -> campus location

legal
    -> education legislation

history
    -> historical curriculum development

statistical
    -> enrollment, attainment and outcomes
```

## 12. Scientific evidence and data standards

Evaluate standards as interoperability contracts, not as mandatory internal schemas.

| Area | Candidate standards/resources |
|---|---|
| Biodiversity | Darwin Core, GBIF |
| Taxonomy | Catalogue of Life, authoritative taxonomic releases |
| Pests and plant health | EPPO Global Database |
| Animal health | WOAH-WAHIS |
| Human health | WHO ICD-11 and public-health reporting standards |
| Agriculture | FAOSTAT and relevant FAO standards |
| Education | UNESCO ISCED |
| Language | ISO 639, Glottolog |
| Environmental observations | OGC Observations and Measurements, SensorThings |
| Climate | NetCDF, Zarr, CF conventions |
| Spatial datasets | STAC and OGC API standards |
| Statistics | SDMX |

Preserve the originating authority, version, identifier and mapping method.

Never assume two external taxonomic or statistical classifications are equivalent simply because their labels look similar.

## 13. Scientific integrity rules

1. An observation is not a universal truth.
2. A modeled distribution is not a confirmed occurrence.
3. A pest is context-dependent.
4. A disease is not its pathogen.
5. An environmental correlation is not automatically causation.
6. A crop suitability prediction is not a guaranteed harvest.
7. A population estimate is not an individual identity.
8. A historical language reconstruction is not a contemporary census result.
9. A scientific name must not erase local names.
10. Missing measurements must not become zero.
11. Sensitive species and human-health locations require appropriate disclosure controls.
12. Every derived result must retain its inputs and method.

## 14. Outstanding design work

Before SQL approval, investigate:

- Taxonomy versioning and competing classifications.
- Environmental tolerance units and life stages.
- Organism-interaction cardinality and evidence.
- Disease/condition identity and outbreak modeling.
- Plant and animal disease classification.
- Environmental sensor quality and calibration.
- Soil type versus soil measurement ownership.
- Farm/field ownership and spatial versioning.
- Crop suitability model lineage.
- Education-system comparison.
- Language classification alternatives.
- Migration's eventual schema threshold.
- Cross-domain foreign-key and deletion rules.

All candidate tables remain subject to KEEP, REMOVE, DERIVE, MOVE, RENAME or ADD review.

## 2026-11-11 — Storage boundary

Scientific and human knowledge are proposed Main schemas so accepted facts connect to geography, people, organizations, statistical releases and evidence through local relationships. Large grids, imagery, arrays and media remain versioned S3 objects with searchable coverage, lineage and hashes in Main. High-rate observations require measured capacity and per-table partition review. Unreviewed mappings remain in Operations staging; disposable Python vectors are not canonical. See [capacity and partitioning](capacity-partitioning-storage.md) and the schema review files.