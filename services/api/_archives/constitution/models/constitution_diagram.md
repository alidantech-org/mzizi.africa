# Constitution Domain - Table Relationships Diagram

## 📜 Constitution Domain Overview

The constitution domain provides the legal foundation for Kenya's governance system, defining the supreme law and its evolution through amendments.

---

## 📊 Entity Relationship Diagram

```
┌──────────────────────┐    ┌─────────────────────────────┐    ┌─────────────────────┐
│      Constitutions    │    │     ConstitutionSections     │    │     Amendments      │
│                      │    │                             │    │                     │
│ - id (PK)           │    │ - id (PK)                   │    │ - id (PK)           │
│ - constitution_code    │◄──►│ - constitution_id (FK)        │◄──►│ - constitution_id (FK) │
│ - constitution_title   │    │ - section_number             │    │ - amendment_code      │
│ - description         │    │ - section_title              │    │ - amendment_title     │
│ - enacted_date        │    │ - section_text               │    │ - description         │
│ - effective_date      │    │ - chapter_id                 │    │ - proposed_date       │
│ - is_active           │    │ - part_id                    │    │ - amendment_type      │
│ - created_at          │    │ - created_at                 │    │ - status              │
│ - updated_at          │    │ - updated_at                 │    │ - created_at          │
│                      │    │                             │    │ - updated_at          │
└──────────────────────┘    └─────────────────────────────┘    └─────────────────────┘
                                ▲                                    ▲
                                │                                    │
                                │                                    │
                                │                                    │
                                └────────────────┐                   │
                                                 │                   │
                                                 ▼                   ▼
                               ┌─────────────────────────────────────┐
                               │   AmendmentSectionChanges           │
                               │                                     │
                               │ - id (PK)                          │
                               │ - amendment_id (FK)                 │
                               │ - section_id (FK)                   │
                               │ - change_type                       │
                               │ - original_text                     │
                               │ - new_text                          │
                               │ - change_reason                     │
                               │ - effective_date                    │
                               │ - created_at                        │
                               │ - updated_at                        │
                               └─────────────────────────────────────┘
```

---

## 🔗 Key Relationships Explained

### Primary Keys (PK)

- **id**: ULID string (26 characters) in all tables
- Ensures global uniqueness across the system

### Foreign Keys (FK)

- **ConstitutionSections.constitution_id** → **Constitutions.id**
    - Links each section to its constitution
- **Amendments.constitution_id** → **Constitutions.id**
    - Links each amendment to its constitution
- **AmendmentSectionChanges.amendment_id** → **Amendments.id**
    - Links each change to its amendment
- **AmendmentSectionChanges.section_id** → **ConstitutionSections.id**
    - Links each change to its affected section

---

## 📋 Constitutional Structure

### Kenyan Constitution (2010) Hierarchy

```
Constitution: Constitution of Kenya (2010)
├── Preamble
├── Chapters (1-18)
│   ├── Chapter 1: Sovereignty of the People
│   ├── Chapter 2: The Republic
│   ├── Chapter 3: Citizenship
│   ├── Chapter 4: Bill of Rights
│   ├── Chapter 5: Land and Environment
│   ├── Chapter 6: Leadership and Integrity
│   ├── Chapter 7: Representation of the People
│   ├── Chapter 8: The Legislature
│   ├── Chapter 9: The Executive
│   ├── Chapter 10: Judiciary
│   ├── Chapter 11: Devolved Government
│   ├── Chapter 12: Public Finance
│   ├── Chapter 13: Public Service
│   ├── Chapter 14: National Security
│   ├── Chapter 15: Commissions and Independent Offices
│   ├── Chapter 16: Amendment of Constitution
│   ├── Chapter 17: General Provisions
│   └── Chapter 18: Transitional and Consequential Provisions
└── Schedules (6 Schedules)
    ├── Schedule 1: Counties
    ├── Schedule 2: National Symbols
    ├── Schedule 3: County Boundaries
    ├── Schedule 4: Oaths
    ├── Schedule 5: Transitional Provisions
    └── Schedule 6: Local Government Provisions
```

### Constitutional Sections

```
ConstitutionSections:
├── Article 1: Sovereignty of the People
├── Article 2: Supremacy of Constitution
├── Article 3: Defence of Constitution
├── Article 4: Declaration of Sovereignty
├── Article 5: Territory of Kenya
├── Article 6: Languages
├── Article 7: National Symbols
├── Article 8: Principles of Governance
├── Article 9: National Values and Principles
├── Article 10: National Values and Principles of Governance
├── Article 11: Culture
├── Article 12: Citizenship
├── Article 13: Citizenship by Birth
├── Article 14: Citizenship by Registration
├── Article 15: Retention of Citizenship
├── Article 16: Revocation of Citizenship
├── Article 17: Dual Citizenship
├── Article 18: Legislation on Citizenship
├── Article 19: Bill of Rights
├── Article 20: Application of Bill of Rights
├── Article 21: Implementation of Rights
├── Article 22: Enforcement of Bill of Rights
├── Article 23: Authority of Courts to Uphold and Enforce Bill of Rights
├── Article 24: Limitation of Rights
├── Article 25: Fundamental Rights and Freedoms
├── Article 26: Equality and Freedom from Discrimination
├── Article 27: Equality before Law
├── Article 28: Equality
├── Article 29: Freedom from Slavery
├── Article 30: Equality of Women
├── Article 31: Rights of Children
├── Article 32: Rights of Persons with Disabilities
├── Article 33: Youth
├── Article 34: Older Members of Society
├── Article 35: Minorities and Marginalized Groups
├── Article 36: Access to Information
├── Article 37: Freedom of Information
├── Article 38: Freedom of Expression
├── Article 39: Freedom of Media
├── Article 40: Freedom of Association
├── Article 41: Assembly, Demonstration, Picketing and Petition
├── Article 42: Political Rights
├── Article 43: Economic and Social Rights
├── Article 44: Labour Relations
├── Article 45: Family
├── Article 46: Consumer Rights
├── Article 47: Fair Administrative Action
├── Article 48: Right to Justice
├── Article 49: Rights of Arrested Persons
├── Article 50: Fair Hearing
├── Article 51: Rights of Persons Detained, Held in Custody or Imprisoned
├── Article 52: Rights of Persons in Remand
├── Article 53: Rights of Children
├── Article 54: Rights of Persons with Disabilities
├── Article 55: Rights of Youth
├── Article 56: Rights of Older Members of Society
├── Article 57: Rights of Minorities and Marginalized Groups
├── Article 58: Access to Justice
├── Article 59: Environmental Rights
├── Article 60: Principles of Land Policy
├── Article 61: Classification of Land
├── Article 62: Public Land
├── Article 63: Community Land
├── Article 64: Private Land
├── Article 65: Land Holding by Non-Citizens
├── Article 66: Regulation of Land Use and Property
├── Article 67: National Land Commission
├── Article 68: Legislation on Land
├── Article 69: Obligations in Respect of Environment
├── Article 70: Enforcement of Environmental Rights
├── Article 71: Agreements Relating to Natural Resources
├── Article 72: Legislation on Environment
├── Article 73: Responsibility of Leadership
├── Article 74: Integrity of Leadership
├── Article 75: Financial Probity of State Officers
├── Article 76: Restriction on Activities of State Officers
├── Article 77: Conduct of State Officers
├── Article 78: Ethics and Values
├── Article 79: Determination of Violation of Chapter
├── Article 80: Legislation on Leadership
├── Article 81: Principles of Electoral System
├── Article 82: Electoral System and Process
├── Article 83: Registration of Voters
├── Article 84: Political Parties
├── Article 85: Political Party System
├── Article 86: Political Party Membership
├── Article 87: Political Party Funding
├── Article 88: Independent Electoral and Boundaries Commission
├── Article 89: Functions of IEBC
├── Article 90: Membership of IEBC
├── Article 91: Removal from Office
├── Article 92: Staff of IEBC
├── Article 93: Establishment of Parliament
├── Article 94: Role of Parliament
├── Article 95: National Assembly
├── Article 96: Senate
├── Article 97: Membership of National Assembly
├── Article 98: Membership of Senate
├── Article 99: Qualifications and Disqualifications for Election as Member of Parliament
├── Article 100: Representation of Marginalized Groups
├── Article 101: Election of Members of Parliament
├── Article 102: Term of Parliament
├── Article 103: Vacation of Office of Member of Parliament
├── Article 104: Right of Recall
├── Article 105: Removal from Office by Recall
├── Article 106: Speaker and Deputy Speaker
├── Article 107: Presiding Officers
├── Article 108: Party Leaders
├── Article 109: Procedure of Parliament
├── Article 110: Passage of Bills
├── Article 111: Presidential Assent and Refusal
├── Article 112: Mediation Committee
├── Article 113: Presidential Assent to Mediated Bill
├── Article 114: County Assemblies
├── Article 115: Membership of County Assemblies
├── Article 116: County Executive Committees
├── Article 117: Speakers of County Assemblies
├── Article 118: County Legislation
├── Article 119: County Executive Authority
├── Article 120: County Attorney
├── Article 121: County Public Finance
├── Article 122: County Planning
├── Article 123: County Development
├── Article 124: County Public Service
├── Article 125: County Security
├── Article 126: County Boundaries
├── Article 127: County Governance
├── Article 128: County Legislation
├── Article 129: County Executive
├── Article 130: County Administration
├── Article 131: County Services
├── Article 132: County Powers
├── Article 133: County Functions
├── Article 134: County Legislation
├── Article 135: County Planning
├── Article 136: County Development
├── Article 137: County Public Finance
├── Article 138: County Public Service
├── Article 139: County Security
├── Article 140: County Boundaries
├── Article 141: County Governance
├── Article 142: County Legislation
├── Article 143: County Executive
├── Article 144: County Administration
├── Article 145: County Services
├── Article 146: County Powers
├── Article 147: County Functions
├── Article 148: County Legislation
├── Article 149: County Planning
├── Article 150: County Development
├── Article 151: County Public Finance
├── Article 152: County Public Service
├── Article 153: County Security
├── Article 154: County Boundaries
├── Article 155: County Governance
├── Article 156: County Legislation
├── Article 157: County Executive
├── Article 158: County Administration
├── Article 159: County Services
├── Article 160: County Powers
├── Article 161: County Functions
├── Article 162: County Legislation
├── Article 163: County Planning
├── Article 164: County Development
├── Article 165: County Public Finance
├── Article 166: County Public Service
├── Article 167: County Security
├── Article 168: County Boundaries
├── Article 169: County Governance
├── Article 170: County Legislation
├── Article 171: County Executive
├── Article 172: County Administration
├── Article 173: County Services
├── Article 174: County Powers
├── Article 175: County Functions
├── Article 176: County Legislation
├── Article 177: County Planning
├── Article 178: County Development
├── Article 179: County Public Finance
├── Article 180: County Public Service
├── Article 181: County Security
├── Article 182: County Boundaries
├── Article 183: County Governance
├── Article 184: County Legislation
├── Article 185: County Executive
├── Article 186: County Administration
├── Article 187: County Services
├── Article 188: County Powers
├── Article 189: County Functions
├── Article 190: County Legislation
├── Article 191: County Planning
├── Article 192: County Development
├── Article 193: County Public Finance
├── Article 194: County Public Service
├── Article 195: County Security
├── Article 196: County Boundaries
├── Article 197: County Governance
├── Article 198: County Legislation
├── Article 199: County Executive
├── Article 200: County Administration
├── Article 201: County Services
├── Article 202: County Powers
├── Article 203: County Functions
├── Article 204: County Legislation
├── Article 205: County Planning
├── Article 206: County Development
├── Article 207: County Public Finance
├── Article 208: County Public Service
├── Article 209: County Security
├── Article 210: County Boundaries
├── Article 211: County Governance
├── Article 212: County Legislation
├── Article 213: County Executive
├── Article 214: County Administration
├── Article 215: County Services
├── Article 216: County Powers
├── Article 217: County Functions
├── Article 218: County Legislation
├── Article 219: County Planning
├── Article 220: County Development
├── Article 221: County Public Finance
├── Article 222: County Public Service
├── Article 223: County Security
├── Article 224: County Boundaries
├── Article 225: County Governance
├── Article 226: County Legislation
├── Article 227: County Executive
├── Article 228: County Administration
├── Article 229: County Services
├── Article 230: County Powers
├── Article 231: County Functions
├── Article 232: County Legislation
├── Article 233: County Planning
├── Article 234: County Development
├── Article 235: County Public Finance
├── Article 236: County Public Service
├── Article 237: County Security
├── Article 238: County Boundaries
├── Article 239: County Governance
├── Article 240: County Legislation
├── Article 241: County Executive
├── Article 242: County Administration
├── Article 243: County Services
├── Article 244: County Powers
├── Article 245: County Functions
├── Article 246: County Legislation
├── Article 247: County Planning
├── Article 248: County Development
├── Article 249: County Public Finance
├── Article 250: County Public Service
├── Article 251: County Security
├── Article 252: County Boundaries
├── Article 253: County Governance
├── Article 254: County Legislation
├── Article 255: County Executive
├── Article 256: County Administration
├── Article 257: County Services
├── Article 258: County Powers
├── Article 259: County Functions
├── Article 260: County Legislation
└── [Articles 261-264: Final Provisions]
```

---

## 🔄 Amendment Process

### Constitutional Amendment Types

```
Amendments:
├── Parliamentary Amendment (Article 256)
│   ├── Requires 2/3 majority in Parliament
│   ├── Can amend most constitutional provisions
│   └── No referendum required
├── Referendum Amendment (Article 255)
│   ├── Requires parliamentary approval + referendum
│   ├── For entrenched provisions (e.g., Bill of Rights)
│   └── Requires 50% + 1 vote of registered voters
└── Popular Initiative (Article 257)
    ├── Requires 1 million registered voters
    ├── IEBC verification
    ├── Parliamentary consideration
    └── Referendum approval
```

### Amendment Section Changes

```
AmendmentSectionChanges:
├── ADDITION: New section added
├── MODIFICATION: Existing section changed
├── DELETION: Section removed
├── REPEAL: Section repealed
└── CONSOLIDATION: Multiple sections merged
```

---

## 🎯 Integration with Other Domains

### Legal Domain

```
Legal.LegalInstruments.constitution_id → Constitution.Constitutions.id
Legal.LegalSections.constitution_section_id → Constitution.ConstitutionSections.id
```

- Links laws to constitutional authority
- References specific constitutional provisions

### Governance Domain

```
Governance.Offices.constitution_id → Constitution.Constitutions.id
Governance.Offices.constitution_section_id → Constitution.ConstitutionSections.id
```

- Links offices to constitutional authority
- References specific constitutional provisions

### Justice Domain

```
Justice.LegalCases.constitution_sections_challenged → Constitution.ConstitutionSections.id
Justice.JudicialOverrules.constitution_section_id → Constitution.ConstitutionSections.id
```

- Links legal challenges to constitutional provisions
- References constitutional sections in judicial rulings

### Elections Domain

```
Elections.Elections.constitution_id → Constitution.Constitutions.id
Elections.Elections.constitution_section_id → Constitution.ConstitutionSections.id
```

- Links elections to constitutional authority
- References electoral constitutional provisions

---

## 📋 Data Flow Examples

### Adding New Constitution

1. **Constitutions**: Create new constitution record
2. **ConstitutionSections**: Add all sections and articles
3. **Amendments**: No amendments initially
4. **AmendmentSectionChanges**: No changes initially

### Constitutional Amendment Process

1. **Amendments**: Create new amendment record
2. **AmendmentSectionChanges**: Add affected sections
3. **ConstitutionSections**: Update sections if amendment passes
4. **Legal Domain**: Update law references if needed

### Constitutional Challenge

1. **Justice.LegalCases**: Create case challenging constitution
2. **Justice.JudicialRulings**: Court decision on challenge
3. **Justice.JudicialOverrules**: If section invalidated
4. **ConstitutionSections**: Update status if needed

---

## 🎯 Key Benefits

### 1. **Legal Authority**

- **Supreme law** reference for all other domains
- **Constitutional compliance** tracking
- **Legal hierarchy** maintenance

### 2. **Amendment Tracking**

- **Historical evolution** of constitution
- **Change audit trail** for all modifications
- **Temporal validity** of constitutional provisions

### 3. **System Integration**

- **Consistent legal references** across domains
- **Constitutional compliance** validation
- **Legal authority** verification

### 4. **Governance Foundation**

- **Office legitimacy** through constitutional authority
- **Electoral processes** based on constitutional provisions
- **Judicial review** constitutional basis

---

## 🚀 Performance Considerations

### Indexing Strategy

- **Primary Keys**: ULID indexes on all tables
- **Foreign Keys**: Composite indexes on FK columns
- **Constitutional References**: Indexes on constitution_id and section_id
- **Amendment Tracking**: Indexes on amendment_id and effective_date

### Query Optimization

- **Constitutional Searches**: Use section_number and chapter_id
- **Amendment History**: Use amendment_id and effective_date
- **Cross-Domain Queries**: Use constitution_id for joins

This constitution domain provides the legal foundation for Kenya's entire governance system, ensuring all other domains have proper constitutional authority and compliance tracking.
