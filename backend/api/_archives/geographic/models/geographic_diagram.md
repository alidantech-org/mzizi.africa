# Geographic Domain - Table Relationships Diagram

## 🌍 Geographic Domain Overview
The geographic domain provides the spatial foundation for all other domains, defining Kenya's administrative hierarchy and boundaries.

---

## 📊 Entity Relationship Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│   GeoLevels     │    │    GeoUnits      │    │   GeoVersions       │    │ GeoBoundaries    │
│                 │    │                  │    │                     │    │                  │
│ - id (PK)       │    │ - id (PK)        │    │ - id (PK)           │    │ - id (PK)        │
│ - level_code    │◄──►│ - level_id (FK)  │◄──►│ - version_code      │◄──►│ - geo_version_id │
│ - level_name    │    │ - version_id (FK)│    │ - description       │    │ - boundary_geom  │
│ - description   │    │ - geo_unit_code  │    │ - start_date        │    │ - simplified_geom│
│ - is_active     │    │ - name           │    │ - end_date          │    │ - created_at     │
│ - created_at    │    │ - parent_unit_id │    │ - is_active         │    │ - updated_at     │
│ - updated_at    │    │ - geo_unit_code  │    │ - created_at        │    │                  │
│                 │    │ - created_at     │    │ - updated_at        │    │                  │
└─────────────────┘    │ - updated_at     │    └─────────────────────┘    └──────────────────┘
                       └──────────────────┘
                                ▲
                                │
                       ┌────────────────────┐
                       │ GeoRelationships   │
                       │                    │
                       │ - id (PK)          │
                       │ - from_unit_id     │◄───┐
                       │ - to_unit_id       │    │
                       │ - relationship_type│    │
                       │ - description      │    │
                       │ - start_date       │    │
                       │ - end_date         │    │
                       │ - is_active        │    │
                       │ - created_at       │    │
                       │ - updated_at       │    │
                       └────────────────────┘    │
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            HOW ALL TABLES WORK TOGETHER                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                             │
│ 1. GeoLevels defines the administrative hierarchy:                                                          │
│    - NATION → COUNTY → CONSTITUENCY → WARD → POLLING STATION                                                │
│                                                                                                             │
│ 2. GeoUnits represents specific geographic areas:                                                           │
│    - Kenya (Nation), Nairobi County, Starehe Constituency, Mabatini Ward                                    │
│    - Each unit has a level (from GeoLevels) and parent unit                                                 │
│                                                                                                             │
│ 3. GeoVersions tracks boundary changes over time:                                                           │
│    - Version 2020: Original boundaries                                                                      │
│    - Version 2022: New constituency boundaries                                                              │
│    - Each GeoUnit can have multiple versions over time                                                      │
│                                                                                                             │
│ 4. GeoBoundaries stores the actual GIS geometry:                                                            │
│    - Links to GeoVersion (which boundaries)                                                                 │
│    - Contains spatial data (MULTIPOLYGON) for mapping                                                       │
│    - Includes simplified geometry for faster rendering                                                      │
│                                                                                                             │
│ 5. GeoRelationships defines connections between units:                                                      │
│    - Parent-child relationships (Nairobi County contains Starehe Constituency)                              │
│    - Adjacency relationships (Starehe borders Westlands)                                                    │
│    - Service delivery relationships (Nairobi serves satellite towns)                                        │
│                                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
---

## 🔗 Key Relationships Explained

### Primary Keys (PK)
- **id**: ULID string (26 characters) in all tables
- Ensures global uniqueness across the system

### Foreign Keys (FK)
- **GeoUnits.level_id** → **GeoLevels.id**
  - Links each geographic unit to its administrative level
- **GeoUnits.version_id** → **GeoVersions.id**
  - Links each unit to its boundary version
- **GeoBoundaries.geo_version_id** → **GeoVersions.id**
  - Links boundaries to specific boundary version
- **GeoRelationships.from_unit_id** → **GeoUnits.id**
- **GeoRelationships.to_unit_id** → **GeoUnits.id**
  - Links related geographic units

### Self-Referencing Relationships
- **GeoUnits.parent_unit_id** → **GeoUnits.id**
  - Creates hierarchical structure (County → Constituency → Ward)

---

## 🌍 Kenyan Administrative Hierarchy

```
GeoLevels:
├── NATION (Level 1)
├── COUNTY (Level 2)
├── CONSTITUENCY (Level 3)
├── WARD (Level 4)
└── POLLING_STATION (Level 5)

GeoUnits (Example):
├── Kenya (NATION)
│   ├── Nairobi County (COUNTY)
│   │   ├── Starehe Constituency (CONSTITUENCY)
│   │   │   ├── Mabatini Ward (WARD)
│   │   │   │   ├── Mabatini Primary Polling Station (POLLING_STATION)
│   │   │   │   └── Mabatini Secondary Polling Station (POLLING_STATION)
│   │   ├── Westlands Constituency (CONSTITUENCY)
│   │   └── Kibera Constituency (CONSTITUENCY)
│   ├── Mombasa County (COUNTY)
│   └── [Other 45 Counties]
└── [Administrative boundaries change over time]

GeoVersions:
├── VERSION_2010 (Original boundaries)
├── VERSION_2013 (Post-2010 constitution)
└── VERSION_2022 (New constituency boundaries)

GeoBoundaries:
├── Kenya National Boundary (VERSION_2010)
├── Nairobi County Boundary (VERSION_2013)
├── Starehe Constituency Boundary (VERSION_2022)
└── [All administrative boundaries with GIS data]

GeoRelationships:
├── Kenya → Nairobi County (CONTAINS)
├── Nairobi County → Starehe Constituency (CONTAINS)
├── Starehe → Westlands (BORDERS)
└── Nairobi → Thika (SERVES)
```

---

## 🗺️ Integration with Other Domains

### Governance Domain
```
Governance.Offices.geo_unit_code → Geographic.GeoUnits.geo_unit_code
```
- Links government offices to their jurisdiction
- Governor's office links to County geo unit
- MP's office links to Constituency geo unit

### Elections Domain
```
Elections.Seats.geo_unit_code → Geographic.GeoUnits.geo_unit_code
```
- Links electoral seats to geographic areas
- Governor's seat links to County geo unit
- MP's seat links to Constituency geo unit

### Services Domain
```
Services.Amenities.geo_unit_code → Geographic.GeoUnits.geo_unit_code
```
- Links amenities to their location
- Hospital in Nairobi links to Nairobi geo unit
- School in Mombasa links to Mombasa geo unit

### Finance Domain
```
Finance.Budgets.geo_unit_code → Geographic.GeoUnits.geo_unit_code
Finance.Revenue.geo_unit_code → Geographic.GeoUnits.geo_unit_code
```
- Links financial allocations to geographic areas
- County budget links to County geo unit
- Revenue collection by geographic area

### Justice Domain
```
Justice.CourtStations.geo_unit_code → Geographic.GeoUnits.geo_unit_code
```
- Links courts to their jurisdiction
- High Court in Nairobi links to Nairobi geo unit
- Magistrate Court links to Constituency geo unit

---

## 📋 Data Flow Examples

### Adding New County
1. **GeoLevels**: Ensure COUNTY level exists
2. **GeoUnits**: Create new county unit with level_id = COUNTY
3. **GeoVersions**: Create new boundary version
4. **GeoBoundaries**: Add GIS boundaries for new county
5. **GeoRelationships**: Link county to nation (CONTAINS relationship)

### Boundary Changes (e.g., 2022 Delimitation)
1. **GeoVersions**: Create VERSION_2022
2. **GeoUnits**: Update affected units with new version_id
3. **GeoBoundaries**: Add new boundary shapes
4. **GeoRelationships**: Update relationships if needed

### Electoral Impact
1. **Elections.Seats**: New seats created for new constituencies
2. **Governance.Offices**: New MP offices created
3. **Services.Amenities**: New government facilities planned
4. **Finance.Budgets**: Budget allocations updated

---

## 🎯 Key Benefits

### 1. **Spatial Foundation**
- All other domains reference geographic units
- Consistent geographic coding across system
- Single source of truth for boundaries

### 2. **Temporal Tracking**
- Boundary changes tracked over time
- Historical analysis possible
- Data integrity maintained during transitions

### 3. **Hierarchical Structure**
- Clear administrative hierarchy
- Parent-child relationships
- Roll-up reporting capabilities

### 4. **GIS Integration**
- Actual boundary shapes stored
- Mapping and visualization support
- Spatial queries and analysis

### 5. **System Integration**
- Seamless integration with all domains
- Referential integrity maintained
- Consistent geographic context

---

## 🚀 Performance Considerations

### Indexing Strategy
- **Primary Keys**: ULID indexes on all tables
- **Foreign Keys**: Composite indexes on FK columns
- **Geographic Queries**: GIST indexes on geometry columns
- **Time-based Queries**: Indexes on version dates

### Partitioning Strategy
- **GeoUnits**: Partition by level (NATION, COUNTY, etc.)
- **GeoVersions**: Partition by start_date
- **GeoBoundaries**: Partition by geo_version_id

### Query Optimization
- **Hierarchical Queries**: Use parent_unit_id for fast lookups
- **Boundary Queries**: Use simplified_geom for rendering
- **Historical Queries**: Use version_id for time-based analysis

This geographic domain provides the spatial foundation for Kenya's entire governance system, ensuring all other domains have consistent geographic context and boundaries.
