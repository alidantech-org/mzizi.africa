# Draft: patterns, institutions and offices the Constitution establishes

Status: **draft for the owner's approval**. Nothing here is loaded or seeded: this folder sits outside `seed/data/`. Approving means moving the files
you accept into `seed/data/` (the layout is identical) and adding the new schemes and values with them.

Each record rests on provisions already seeded from the English NCLR print of the Constitution; every `established-by` row in
`data/ke/legal/bases/patterns.bases.csv` is a link to one of them. Check them with `uv run python scripts/seed/check_drafts.py`.

What is drafted: 11 patterns, 33 institutions (each with an entity and a name), 44 offices, 33 mandates,
10 part-of relationships and 182 legal bases. Names are the Constitution's own words for the body.

What is not drafted, and why:

- **County governments.** There are 47 and each has the same shape, so they are one pattern (`ke.county-government`, Articles 176 to 183) rather than 94
  hand-written institutions. Once you approve the pattern, a script can create a county assembly, an executive committee, a governor, a deputy governor and a speaker per county.
- **Office holders.** The Constitution creates offices, not the people in them; holders come from sources such as the IEBC and Kenya Gazette, one at a time.
- **Statutory bodies.** The Ethics and Anti-Corruption Commission is required by Article 79 but created by an Act; it is listed with its constitutional mandate only.
- **Authority scopes** (which county or country an office covers) wait for the county institutions.

## Patterns

### `ke.independent-commission`

An independent commission: members, appointment, removal and functions common to Chapter Fifteen

- Article 248 (Application of Chapter): This Chapter applies to the commissions specified in clause (2) and the independent offices specified in clause (3), except to the extent that this Constitution provides …
- Article 249 (Objects, authority and funding of commissions and independent offices): The objects of the commissions and the independent offices are to—
- Article 250 (Composition, appointment and terms of office): Each commission shall consist of at least three, but not more than nine, members.
- Article 251 (Removal from office): A member of a commission (other than an ex officio member), or the holder of an independent office, may be removed from office only for—
- Article 252 (General functions and powers): Each commission, and each holder of an independent office—
- Article 253 (Incorporation of commissions and independent offices): Each commission and each independent office—
- Article 254 (Reporting by commissions and independent offices): As soon as practicable after the end of each financial year, each commission, and each holder of an independent office, shall submit a report to the President and to Parl…

### `ke.independent-office`

An independent office established by the Constitution

- Article 248 (Application of Chapter): This Chapter applies to the commissions specified in clause (2) and the independent offices specified in clause (3), except to the extent that this Constitution provides …
- Article 249 (Objects, authority and funding of commissions and independent offices): The objects of the commissions and the independent offices are to—
- Article 250 (Composition, appointment and terms of office): Each commission shall consist of at least three, but not more than nine, members.
- Article 251 (Removal from office): A member of a commission (other than an ex officio member), or the holder of an independent office, may be removed from office only for—
- Article 252 (General functions and powers): Each commission, and each holder of an independent office—
- Article 253 (Incorporation of commissions and independent offices): Each commission and each independent office—
- Article 254 (Reporting by commissions and independent offices): As soon as practicable after the end of each financial year, each commission, and each holder of an independent office, shall submit a report to the President and to Parl…

### `ke.executive-authority`

Executive authority of the Republic: the President, Deputy President and Cabinet

- Article 129 (Principles of executive authority): Executive authority derives from the people of Kenya and shall be exercised in accordance with this Constitution.
- Article 130 (The National Executive): The national executive of the Republic comprises the President, the Deputy President and the rest of the Cabinet.
- Article 131 (Authority of the President): The President—
- Article 152 (Cabinet): The Cabinet consists of—

### `ke.legislative-chamber`

A House of Parliament

- Article 93 (Establishment of Parliament): There is established a Parliament of Kenya, which shall consist of the National Assembly and the Senate.
- Article 94 (Role of Parliament): The legislative authority of the Republic is derived from the people and, at the national level, is vested in and exercised by Parliament.
- Article 95 (Role of the National Assembly): The National Assembly represents the people of the constituencies and special interests in the National Assembly.
- Article 96 (Role of the Senate): The Senate represents the counties, and serves to protect the interests of the counties and their governments.

### `ke.court`

A court in the system of courts

- Article 159 (Judicial authority): Judicial authority is derived from the people and vests in, and shall be exercised by, the courts and tribunals established by or under this Constitution.
- Article 162 (System of courts): The superior courts are the Supreme Court, the Court of Appeal, the High Court and the courts mentioned in clause (2).
- Article 163 (Supreme Court): There is established the Supreme Court, which shall consists of—
- Article 164 (Court of Appeal): There is established the Court of Appeal, which—
- Article 165 (High Court): There is established the High Court, which—
- Article 169 (Subordinate courts): The subordinate courts are—

### `ke.county-government`

A county government: a county assembly and a county executive committee

- Article 176 (County governments): There shall be a county government for each county, consisting of a county assembly and a county executive.
- Article 177 (Membership of county assembly): A county assembly consists of—
- Article 178 (Speaker of a county assembly): Each county assembly shall have a speaker elected by the county assembly from among persons who are not members of the assembly.
- Article 179 (County executive committees): The executive authority of the county is vested in, and exercised by, a county executive committee.
- Article 183 (Functions of county executive committees): A county executive committee shall—

### `ke.security-organ`

A national security organ

- Article 239 (National security organs): The national security organs are—
- Article 240 (Establishment of the National Security Council): There is established a National Security Council.
- Article 241 (Establishment of Defence Forces and Defence Council): There are established the Kenya Defence Forces.
- Article 242 (Establishment of National Intelligence Service): There is established the National Intelligence Service.
- Article 243 (Establishment of the National Police Service): There is established the National Police Service.

### `ke.public-service-body`

A body of the public service

- Article 232 (Values and principles of public service): The values and principles of public service include—
- Article 233 (The Public Service Commission): There is established the Public Service Commission.
- Article 235 (Staffing of county governments): A county government is responsible, within a framework of uniform norms and standards prescribed by an Act of Parliament, for––
- Article 237 (Teachers Service Commission): There is established the Teachers Service Commission.

### `ke.state-officer`

A State officer: oath, conduct and limits on activities

- Article 74 (Oath of office of State officers): Before assuming a State office, acting in a State office, or performing any functions of a State office, a person shall take and subscribe the oath or affirmation of offi…
- Article 75 (Conduct of State officers): A State officer shall behave, whether in public and official life, in private life, or in association with other persons, in a manner that avoids—
- Article 76 (Financial probity of State officers): A gift or donation to a State officer on a public or official occasion is a gift or donation to the Republic and shall be delivered to the State unless exempted under an …
- Article 77 (Restriction on activities of State officers): A full-time State officer shall not participate in any other gainful employment.

### `ke.electoral-unit`

An electoral unit: a constituency or ward

- Article 89 (Delimitation of electoral units): There shall be two hundred and ninety constituencies for the purposes of the election of the members of the National Assembly provided for in Article 97 (1) (a).
- Article 177 (Membership of county assembly): A county assembly consists of—

### `ke.devolved-unit`

A county as a unit of devolved government

- Article 6 (Devolution and access to services): The territory of Kenya is divided into the counties specified in the First Schedule.
- Article 176 (County governments): There shall be a county government for each county, consisting of a county assembly and a county executive.
- Article 188 (Boundaries of counties): The boundaries of a county may be altered only by a resolution––

## Institutions

| Institution | Kind | Pattern | Articles | Offices |
|---|---|---|---|---|
| `ke.national-executive` The National Executive | executive-organ | executive-authority | 130 | none |
| `ke.the-presidency` The President and Deputy President | executive-organ | executive-authority | 131, 147 | President, Deputy President |
| `ke.cabinet` Cabinet | executive-organ | executive-authority | 152 | Cabinet Secretary, Secretary to the Cabinet |
| `ke.state-departments` State departments | executive-organ | executive-authority | 155 | Principal Secretary |
| `ke.office-of-the-attorney-general` Office of the Attorney-General | independent-office | independent-office | 156 | Attorney-General |
| `ke.office-of-the-director-of-public-prosecutions` Office of the Director of Public Prosecutions | independent-office | independent-office | 157 | Director of Public Prosecutions |
| `ke.parliament` Parliament | legislative-chamber | legislative-chamber | 93 | none |
| `ke.national-assembly` The National Assembly | legislative-chamber | legislative-chamber | 95, 97 | Speaker of the National Assembly, Member of the National Assembly, Leader of the majority party, Leader of the minority party |
| `ke.senate` The Senate | legislative-chamber | legislative-chamber | 96, 98 | Speaker of the Senate, Member of the Senate |
| `ke.parliamentary-service-commission` Parliamentary Service Commission | constitutional-commission | independent-commission | 127 | Chairperson, Member (commissioner) |
| `ke.judiciary` The Judiciary | court | court | 159, 160 | Chief Registrar of the Judiciary |
| `ke.supreme-court` The Supreme Court | court | court | 163 | Chief Justice, Deputy Chief Justice, Judge of the Supreme Court |
| `ke.court-of-appeal` The Court of Appeal | court | court | 164 | Judge of the Court of Appeal |
| `ke.high-court` The High Court | court | court | 165 | Judge of the High Court |
| `ke.subordinate-courts` Subordinate courts | court | court | 169 | none |
| `ke.kadhis-courts` Kadhis' courts | court | court | 170 | Chief Kadhi |
| `ke.judicial-service-commission` Judicial Service Commission | constitutional-commission | independent-commission | 171, 172 | Chairperson, Member (commissioner) |
| `ke.independent-electoral-and-boundaries-commission` Independent Electoral and Boundaries Commission | constitutional-commission | independent-commission | 88 | Chairperson, Member (commissioner) |
| `ke.commission-on-revenue-allocation` Commission on Revenue Allocation | constitutional-commission | independent-commission | 215, 216 | Chairperson, Member (commissioner) |
| `ke.salaries-and-remuneration-commission` Salaries and Remuneration Commission | constitutional-commission | independent-commission | 230 | Chairperson, Member (commissioner) |
| `ke.public-service-commission` The Public Service Commission | constitutional-commission | independent-commission | 233, 234 | Chairperson, Member (commissioner) |
| `ke.teachers-service-commission` Teachers Service Commission | constitutional-commission | independent-commission | 237 | Chairperson, Member (commissioner) |
| `ke.national-police-service-commission` National Police Service Commission | constitutional-commission | independent-commission | 246 | Chairperson, Member (commissioner) |
| `ke.national-land-commission` National Land Commission | constitutional-commission | independent-commission | 67 | Chairperson, Member (commissioner) |
| `ke.kenya-national-human-rights-and-equality-commission` Kenya National Human Rights and Equality Commission | constitutional-commission | independent-commission | 59 | Chairperson, Member (commissioner) |
| `ke.ethics-and-anti-corruption-commission` Ethics and Anti-Corruption Commission | constitutional-commission | independent-commission | 79 | none |
| `ke.office-of-the-controller-of-budget` Office of the Controller of Budget | independent-office | independent-office | 228 | Controller of Budget |
| `ke.office-of-the-auditor-general` Office of the Auditor-General | independent-office | independent-office | 229 | Auditor-General |
| `ke.central-bank-of-kenya` Central Bank of Kenya | independent-office | independent-office | 231 | Governor of the Central Bank |
| `ke.national-security-council` National Security Council | security-organ | security-organ | 240 | none |
| `ke.defence-forces` Kenya Defence Forces | security-organ | security-organ | 241 | none |
| `ke.national-intelligence-service` National Intelligence Service | security-organ | security-organ | 242 | none |
| `ke.national-police-service` National Police Service | security-organ | security-organ | 243, 244 | Inspector-General of the National Police Service |

## To decide

1. Which patterns, institutions and offices to accept, drop or rename.
2. The new schemes and values (`ofc.entity.kind`, `gov.institution.kind`, `gov.office.kind`, `gov.mandate.kind`, `gov.relationship.kind`).
3. Whether to generate the per-county institutions from the county-government pattern.
