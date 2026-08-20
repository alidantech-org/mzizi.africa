# Legal Domain - Table Relationships Diagram

## ⚖️ Legal Domain Overview
The legal domain provides the comprehensive legal framework for Kenya's governance system, including statutes, regulations, and subsidiary legislation with temporal versioning and constitutional traceability.

---

## 📊 Entity Relationship Diagram

```
┌──────────────────────┐    ┌─────────────────────────────┐    ┌──────────────────────────────────┐
│      LegalLevels     │    │       LegalInstruments       │    │     LegalInstrumentVersions       │
│                      │    │                             │    │                                  │
│ - id (PK)           │    │ - id (PK)                   │    │ - id (PK)                        │
│ - level_code         │◄──►│ - level_id (FK)              │◄──►│ - instrument_id (FK)              │
│ - level_name         │    │ - constitution_id (FK)        │    │ - version_code                   │
│ - description        │    │ - constitution_section_id (FK)│    │ - version_number                 │
│ - hierarchy_level     │    │ - instrument_code            │    │ - title                          │
│ - is_active          │    │ - instrument_title           │    │ - description                    │
│ - created_at         │    │ - instrument_type            │    │ - publication_date               │
│ - updated_at         │    │ - legal_status                │    │ - effective_date                 │
│                      │    │ - created_at                  │    │ - expiry_date                    │
│                      │    │ - updated_at                  │    │ - is_current                     │
│                      │    │                             │    │ - created_at                     │
│                      │    │                             │    │ - updated_at                     │
└──────────────────────┘    └─────────────────────────────┘    └──────────────────────────────────┘
                                ▲                                    ▲
                                │                                    │
                                │                                    │
                                │                                    │
                                │                                    │
                                ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      LegalSections                                                    │
│                                                                                                     │
│ - id (PK)                                                                                           │
│ - instrument_id (FK)                                                                                │
│ - version_id (FK)                                                                                   │
│ - section_number                                                                                    │
│ - section_title                                                                                     │
│ - section_text                                                                                      │
│ - chapter_id                                                                                        │
│ - part_id                                                                                           │
│ - parent_section_id                                                                                 │
│ - section_type                                                                                      │
│ - is_active                                                                                         │
│ - created_at                                                                                        │
│ - updated_at                                                                                        │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                ▲
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            HOW ALL TABLES WORK TOGETHER                                                     │
 ├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                     │
│ 1. LegalLevels defines the legal hierarchy:                                                          │
│    - CONSTITUTION → ACT → REGULATION → RULE → BYLAW → POLICY                                         │
│                                                                                                     │
│ 2. LegalInstruments represents specific legal documents:                                               │
│    - Constitution of Kenya (2010), County Governments Act, Land Act, etc.                            │
│    - Each instrument has a level (from LegalLevels) and constitutional authority                       │
│                                                                                                     │
│ 3. LegalInstrumentVersions tracks changes over time:                                                  │
│    - Version 2013: Original Act                                                                       │
│    - Version 2015: Amended Act                                                                       │
│    - Version 2020: Further amendments                                                               │
│    - Each instrument can have multiple versions over time                                            │
│                                                                                                     │
│ 4. LegalSections contains the actual legal text:                                                     │
│    - Links to specific instrument and version                                                        │
│    - Contains sections, chapters, parts with full text                                                │
│    - Hierarchical structure within instruments                                                       │
│                                                                                                     │
│ 5. LegalAuthoritySources provides legal authority for instruments:                                  │
│    - Links instruments to their constitutional basis                                                   │
│    - Tracks enabling provisions and legal foundations                                                 │
│                                                                                                     │
│ 6. LegalInstrumentDependencies tracks relationships between instruments:                              │
│    - Parent-child relationships (Act → Regulations)                                                   │
│    - Cross-references and dependencies                                                               │
│    - Amendment relationships                                                                         │
│                                                                                                     │
│ 7. LegalApplicability defines geographic and temporal scope:                                         │
│    - Where the law applies (national, county, specific areas)                                       │
│    - When the law applies (effective dates, temporal scope)                                          │
│    - Who the law applies to (government entities, citizens, businesses)                              │
│                                                                                                     │
│ 8. LegalAmendments tracks changes to legal instruments:                                             │
│    - Amendment processes and procedures                                                              │
│    - Legal authority for amendments                                                                 │
│    - Status and outcomes of amendments                                                              │
│                                                                                                     │
│ 9. LegalAmendmentChanges records specific modifications:                                             │
│    - Section additions, modifications, deletions                                                    │
│    - Text changes and legal effects                                                                 │
│    - Effective dates and implementation requirements                                                 │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                ▲
                                │
                                │
                                │
                                ▼
┌──────────────────────────────┐    ┌─────────────────────────────────────┐    ┌──────────────────────────────────┐
│   LegalAuthoritySources    │    │   LegalInstrumentDependencies       │    │        LegalApplicability         │
│                            │    │                                     │    │                                  │
│ - id (PK)                  │    │ - id (PK)                           │    │ - id (PK)                        │
│ - instrument_id (FK)        │    │ - parent_instrument_id (FK)         │    │ - instrument_id (FK)            │
│ - authority_type           │    │ - child_instrument_id (FK)          │    │ - geo_unit_code                 │
│ - authority_source         │    │ - dependency_type                   │    │ - effective_from                 │
│ - authority_reference      │    │ - description                       │    │ - effective_to                   │
│ - constitutional_basis      │    │ - created_at                        │    │ - applicability_type             │
│ - created_at               │    │ - updated_at                        │    │ - subject_entities               │
│ - updated_at               │    │                                     │    │ - created_at                     │
│                            │    │                                     │    │ - updated_at                     │
└──────────────────────────────┘    └─────────────────────────────┘    └──────────────────────────────────┘
                                ▲                                    ▲
                                │                                    │
                                │                                    │
                                ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  LegalAmendments                                                     │
│                                                                                                     │
│ - id (PK)                                                                                           │
│ - instrument_id (FK)                                                                                │
│ - amendment_code                                                                                    │
│ - amendment_title                                                                                   │
│ - amendment_type                                                                                    │
│ - proposing_authority                                                                               │
│ - proposed_date                                                                                     │
│ - status                                                                                            │
│ - legal_basis                                                                                       │
│ - created_at                                                                                        │
│ - updated_at                                                                                        │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                ▲
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               LegalAmendmentChanges                                                   │
│                                                                                                     │
│ - id (PK)                                                                                           │
│ - amendment_id (FK)                                                                                 │
│ - section_id (FK)                                                                                   │
│ - change_type                                                                                       │
│ - original_text                                                                                     │
│ - new_text                                                                                          │
│ - change_reason                                                                                     │
│ - effective_date                                                                                    │
│ - created_at                                                                                        │
│ - updated_at                                                                                        │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Key Relationships Explained

### Primary Keys (PK)
- **id**: ULID string (26 characters) in all tables
- Ensures global uniqueness across the system

### Foreign Keys (FK)
- **LegalInstruments.level_id** → **LegalLevels.id**
  - Links each instrument to its legal hierarchy level
- **LegalInstruments.constitution_id** → **Constitution.Constitutions.id**
  - Links instruments to constitutional authority
- **LegalInstruments.constitution_section_id** → **Constitution.ConstitutionSections.id**
  - Links instruments to specific constitutional provisions
- **LegalInstrumentVersions.instrument_id** → **LegalInstruments.id**
  - Links versions to their parent instrument
- **LegalSections.instrument_id** → **LegalInstruments.id**
  - Links sections to their instrument
- **LegalSections.version_id** → **LegalInstrumentVersions.id**
  - Links sections to specific version
- **LegalAuthoritySources.instrument_id** → **LegalInstruments.id**
  - Links authority sources to instruments
- **LegalInstrumentDependencies.parent_instrument_id** → **LegalInstruments.id**
  - Links parent instruments in dependencies
- **LegalInstrumentDependencies.child_instrument_id** → **LegalInstruments.id**
  - Links child instruments in dependencies
- **LegalApplicability.instrument_id** → **LegalInstruments.id**
  - Links applicability to instruments
- **LegalAmendments.instrument_id** → **LegalInstruments.id**
  - Links amendments to instruments
- **LegalAmendmentChanges.amendment_id** → **LegalAmendments.id**
  - Links changes to amendments
- **LegalAmendmentChanges.section_id** → **LegalSections.id**
  - Links changes to affected sections

### Self-Referencing Relationships
- **LegalSections.parent_section_id** → **LegalSections.id**
  - Creates hierarchical structure within instruments

---

## ⚖️ Kenyan Legal Hierarchy

### Legal Levels
```
LegalLevels:
├── CONSTITUTION (Level 1)
├── ACT (Level 2)
├── REGULATION (Level 3)
├── RULE (Level 4)
├── BYLAW (Level 5)
└── POLICY (Level 6)
```

### Legal Instruments Examples
```
LegalInstruments:
├── Constitutional Level:
│   └── Constitution of Kenya (2010)
├── Act Level:
│   ├── County Governments Act (2012)
│   ├── Land Act (2012)
│   ├── Public Finance Management Act (2012)
│   ├── Elections Act (2011)
│   ├── Public Procurement and Asset Disposal Act (2015)
│   ├── Public Officer Ethics Act (2003)
│   └── Leadership and Integrity Act (2012)
├── Regulation Level:
│   ├── County Governments (General) Regulations (2013)
│   ├── Land Registration Regulations (2012)
│   ├── Public Finance Management Regulations (2015)
│   ├── Elections (General) Regulations (2012)
│   └── Public Procurement Regulations (2020)
├── Rule Level:
│   ├── County Government Rules (2013)
│   ├── Land Registration Rules (2012)
│   ├── Court Rules (various)
│   └── Parliamentary Rules (various)
└── Bylaw Level:
    ├── County Bylaws (various counties)
    ├── Municipal Bylaws (various towns)
    └── Local Authority Bylaws
```

### Legal Instrument Versions
```
LegalInstrumentVersions:
├── Constitution of Kenya (2010)
│   ├── Version 2010-08-27 (Original)
│   └── Version 2020-08-27 (10-year review)
├── County Governments Act (2012)
│   ├── Version 2012-11-27 (Original)
│   ├── Version 2015-12-31 (First Amendment)
│   ├── Version 2017-12-31 (Second Amendment)
│   └── Version 2020-12-31 (Third Amendment)
└── Elections Act (2011)
    ├── Version 2011-09-01 (Original)
    ├── Version 2013-12-31 (Amended)
    ├── Version 2015-12-31 (Further Amendments)
    ├── Version 2017-12-31 (Technology Amendments)
    └── Version 2020-12-31 (COVID-19 Amendments)
```

---

## 📋 Legal Section Structure

### Legal Sections Hierarchy
```
LegalSections:
├── Constitution of Kenya (2010)
│   ├── Chapter 1: Sovereignty of the People
│   │   ├── Article 1: Sovereignty of the People
│   │   ├── Article 2: Supremacy of Constitution
│   │   └── Article 3: Defence of Constitution
│   ├── Chapter 2: The Republic
│   │   ├── Article 4: Declaration of Sovereignty
│   │   ├── Article 5: Territory of Kenya
│   │   └── Article 6: Languages
│   └── [Other Chapters and Articles]
├── County Governments Act (2012)
│   ├── Part I: Preliminary
│   │   ├── Section 1: Citation
│   │   ├── Section 2: Interpretation
│   │   └── Section 3: Application
│   ├── Part II: County Governments
│   │   ├── Section 4: County Governments Established
│   │   ├── Section 5: County Boundaries
│   │   └── Section 6: County Executive
│   └── [Other Parts and Sections]
└── Land Act (2012)
    ├── Part I: Preliminary
    │   ├── Section 1: Citation
    │   ├── Section 2: Interpretation
    │   └── Section 3: Application
    ├── Part II: Land Classification
    │   ├── Section 4: Classification of Land
    │   ├── Section 5: Public Land
    │   └── Section 6: Private Land
    └── [Other Parts and Sections]
```

---

## 🔗 Legal Authority Sources

### Constitutional Authority
```
LegalAuthoritySources:
├── Constitutional Authority:
│   ├── Constitution of Kenya (2010), Article 94
│   ├── Constitution of Kenya (2010), Article 109
│   ├── Constitution of Kenya (2010), Article 110
│   └── Constitution of Kenya (2010), Article 256
├── Statutory Authority:
│   ├── County Governments Act, Section 3
│   ├── Land Act, Section 2
│   ├── Public Finance Management Act, Section 4
│   └── Elections Act, Section 5
├── Regulatory Authority:
│   ├── Statutory Instruments Act, Section 11
│   ├── County Governments Act, Section 45
│   ├── Land Act, Section 78
│   └── Public Finance Management Act, Section 107
└── Judicial Authority:
    ├── Supreme Court Act, Section 2
    ├── High Court Act, Section 3
    ├── Magistrates Court Act, Section 4
    └── Judicial Service Act, Section 5
```

---

## 🔗 Legal Instrument Dependencies

### Parent-Child Relationships
```
LegalInstrumentDependencies:
├── Constitutional Level:
│   └── Constitution of Kenya → All Other Instruments (Supreme Authority)
├── Act Level:
│   ├── County Governments Act → County Government Regulations
│   ├── Land Act → Land Registration Regulations
│   ├── Public Finance Management Act → Financial Regulations
│   └── Elections Act → Election Regulations
├── Regulation Level:
│   ├── County Government Regulations → County Bylaws
│   ├── Land Registration Regulations → Land Registration Rules
│   ├── Financial Regulations → Financial Rules
│   └── Election Regulations → Election Rules
└── Cross-References:
    ├── County Governments Act ↔ Land Act (Land in counties)
    ├── Public Finance Management Act ↔ County Governments Act (County finance)
    ├── Elections Act ↔ County Governments Act (County elections)
    └── Leadership and Integrity Act ↔ All Other Instruments (Leadership requirements)
```

---

## 🌍 Legal Applicability

### Geographic Scope
```
LegalApplicability:
├── National Scope:
│   ├── Constitution of Kenya (All Kenya)
│   ├── National Acts (All Kenya)
│   ├── National Regulations (All Kenya)
│   └── National Rules (All Kenya)
├── County Scope:
│   ├── County Governments Act (All 47 Counties)
│   ├── County-Specific Acts (Individual Counties)
│   ├── County Regulations (Individual Counties)
│   └── County Bylaws (Individual Counties)
├── Municipal Scope:
│   ├── Municipal Acts (Specific Municipalities)
│   ├── Municipal Regulations (Specific Municipalities)
│   └── Municipal Bylaws (Specific Municipalities)
└── Specialized Scope:
    ├── Land Act (Specific land parcels)
    ├── Environmental Act (Specific environmental areas)
    ├── Heritage Act (Specific heritage sites)
    └── Water Act (Specific water bodies)
```

### Temporal Scope
```
LegalApplicability:
├── Permanent Laws:
│   ├── Constitution of Kenya (2010) (Permanent)
│   ├── Fundamental Acts (Permanent)
│   └── Core Regulations (Permanent)
├── Time-Limited Laws:
│   ├── Emergency Regulations (Limited duration)
│   ├── Transitional Provisions (Limited duration)
│   └── Pilot Programs (Limited duration)
├── Seasonal Laws:
│   ├── Agricultural Regulations (Seasonal)
│   ├── Tourism Regulations (Seasonal)
│   └── Environmental Regulations (Seasonal)
└── Event-Specific Laws:
    ├── Election Regulations (During elections)
    ├── Census Regulations (During census)
    └── Disaster Response Regulations (During disasters)
```

---

## 🔄 Legal Amendment Process

### Amendment Types
```
LegalAmendments:
├── Parliamentary Amendments:
│   ├── Act Amendments (Parliament)
│   ├── Regulation Amendments (Cabinet)
│   └── Rule Amendments (Responsible Authority)
├── Constitutional Amendments:
│   ├── Parliamentary Amendments (2/3 majority)
│   ├── Referendum Amendments (Parliament + Referendum)
│   └── Popular Initiative Amendments (1M voters + Referendum)
├── County Amendments:
│   ├── County Act Amendments (County Assembly)
│   ├── County Regulation Amendments (County Executive)
│   └── County Bylaw Amendments (County Assembly)
└── Specialized Amendments:
    ├── Emergency Amendments (Emergency powers)
    ├── Transitional Amendments (Transitional periods)
    └── Technical Amendments (Technical corrections)
```

### Amendment Changes
```
LegalAmendmentChanges:
├── Section Additions:
│   ├── New sections added
│   ├── New chapters added
│   └── New parts added
├── Section Modifications:
│   ├── Text amendments
│   ├── Number changes
│   └── Title changes
├── Section Deletions:
│   ├── Sections repealed
│   ├── Chapters repealed
│   └── Parts repealed
└── Structural Changes:
    ├── Reorganization
    ├── Consolidation
    └── Division
```

---

## 🎯 Integration with Other Domains

### Constitution Domain
```
Legal.LegalInstruments.constitution_id → Constitution.Constitutions.id
Legal.LegalInstruments.constitution_section_id → Constitution.ConstitutionSections.id
Legal.LegalAuthoritySources.constitutional_basis → Constitution.ConstitutionSections.id
```
- Links laws to constitutional authority
- References specific constitutional provisions

### Governance Domain
```
Governance.Offices.law_id → Legal.LegalInstruments.id
Governance.Offices.law_section_id → Legal.LegalSections.id
```
- Links offices to legal authority
- References specific legal provisions

### Justice Domain
```
Justice.LegalCases.laws_challenged → Legal.LegalInstruments.id
Justice.JudicialOverrules.law_id → Legal.LegalInstruments.id
Justice.JudicialOverrules.law_section_id → Legal.LegalSections.id
```
- Links legal challenges to laws
- References legal sections in judicial rulings

### Finance Domain
```
Finance.Budgets.law_id → Legal.LegalInstruments.id
Finance.Budgets.law_section_id → Legal.LegalSections.id
Finance.Expenditure.law_section_id → Legal.LegalSections.id
```
- Links financial allocations to legal authority
- References legal provisions for spending

### Procurement Domain
```
Procurement.Tenders.law_id → Legal.LegalInstruments.id
Procurement.Tenders.law_section_id → Legal.LegalSections.id
Procurement.Contracts.law_id → Legal.LegalInstruments.id
Procurement.Contracts.law_section_id → Legal.LegalSections.id
```
- Links procurement to legal authority
- References legal provisions for procurement

---

## 📋 Data Flow Examples

### Adding New Legal Instrument
1. **LegalLevels**: Ensure appropriate level exists
2. **LegalInstruments**: Create new instrument record
3. **LegalInstrumentVersions**: Create initial version
4. **LegalSections**: Add all sections and text
5. **LegalAuthoritySources**: Add constitutional authority
6. **LegalApplicability**: Define geographic and temporal scope
7. **LegalInstrumentDependencies**: Add dependencies if needed

### Legal Amendment Process
1. **LegalAmendments**: Create new amendment record
2. **LegalAmendmentChanges**: Add affected sections
3. **LegalInstrumentVersions**: Create new version if needed
4. **LegalSections**: Update sections if amendment passes
5. **LegalApplicability**: Update scope if needed
6. **LegalInstrumentDependencies**: Update dependencies if needed

### Legal Challenge Process
1. **Justice.LegalCases**: Create case challenging law
2. **Justice.JudicialRulings**: Court decision on challenge
3. **Justice.JudicialOverrules**: If law/section invalidated
4. **Legal.LegalInstruments**: Update status if needed
5. **Legal.LegalSections**: Update status if needed

---

## 🎯 Key Benefits

### 1. **Legal Authority**
- **Comprehensive legal framework** for governance
- **Constitutional compliance** tracking
- **Legal hierarchy** maintenance

### 2. **Temporal Versioning**
- **Historical evolution** of laws
- **Change audit trail** for all modifications
- **Temporal validity** of legal provisions

### 3. **System Integration**
- **Consistent legal references** across domains
- **Legal compliance** validation
- **Legal authority** verification

### 4. **Governance Foundation**
- **Office legitimacy** through legal authority
- **Financial authority** through legal provisions
- **Procurement authority** through legal framework

---

## 🚀 Performance Considerations

### Indexing Strategy
- **Primary Keys**: ULID indexes on all tables
- **Foreign Keys**: Composite indexes on FK columns
- **Legal References**: Indexes on instrument_id and section_id
- **Temporal Queries**: Indexes on effective dates
- **Geographic Queries**: Indexes on geo_unit_code

### Query Optimization
- **Legal Searches**: Use instrument_code and section_number
- **Amendment History**: Use amendment_id and effective_date
- **Cross-Domain Queries**: Use instrument_id for joins
- **Geographic Queries**: Use geo_unit_code for filtering

### Partitioning Strategy
- **LegalInstruments**: Partition by level_id
- **LegalInstrumentVersions**: Partition by effective_date
- **LegalSections**: Partition by instrument_id
- **LegalApplicability**: Partition by geo_unit_code

This legal domain provides the comprehensive legal framework for Kenya's governance system, ensuring all other domains have proper legal authority and can track legal evolution over time.
