"""Reference data the new dev tables need: schemes and values (with Swahili labels), topics, units and a few languages."""

from __future__ import annotations

from dev_seed.store import Tables

# scheme code -> (title, [(word, English, Swahili)])
# values added to schemes the seed already owns
EXTRA_VALUES: dict[str, list[tuple[str, str, str]]] = {
    "fil.media.kind": [("social-post", "Social media post", "Chapisho la mitandao ya kijamii")]
}

SCHEMES: dict[str, tuple[str, list[tuple[str, str, str]]]] = {
    "sta.measure.kind": (
        "How a statistic is measured",
        [
            ("count", "Count", "Idadi"),
            ("rate", "Rate", "Kiwango"),
            ("ratio", "Ratio", "Uwiano"),
            ("share", "Share", "Sehemu"),
            ("index", "Index", "Kielezo"),
            ("amount", "Amount", "Kiasi"),
            ("density", "Density", "Msongamano"),
        ],
    ),
    "sta.dimension.sex": (
        "Sex breakdown",
        [("male", "Male", "Wanaume"), ("female", "Female", "Wanawake"), ("intersex", "Intersex", "Jinsia tofauti")],
    ),
    "sta.dimension.residence": ("Urban or rural", [("urban", "Urban", "Mjini"), ("rural", "Rural", "Vijijini")]),
    "sta.dimension.agegroup": (
        "Five-year age groups",
        [(f"{a}-{a + 4}", f"{a}–{a + 4} years", f"Miaka {a}–{a + 4}") for a in range(0, 75, 5)]
        + [("75-plus", "75 and over", "Miaka 75 na zaidi")],
    ),
    "sta.dimension.ethnicity": (
        "Ethnic community",
        [
            ("kikuyu", "Kikuyu", "Kikuyu"),
            ("luhya", "Luhya", "Waluhya"),
            ("kalenjin", "Kalenjin", "Kalenjin"),
            ("luo", "Luo", "Waluo"),
            ("kamba", "Kamba", "Kamba"),
            ("kisii", "Kisii", "Kisii"),
            ("mijikenda", "Mijikenda", "Mijikenda"),
            ("meru", "Meru", "Meru"),
            ("somali", "Somali", "Wasomali"),
            ("turkana", "Turkana", "Turkana"),
            ("maasai", "Maasai", "Wamaasai"),
            ("embu", "Embu", "Embu"),
            ("taita", "Taita", "Taita"),
            ("other", "Other communities", "Jamii nyingine"),
        ],
    ),
    "act.sitting.kind": (
        "Kind of sitting",
        [
            ("plenary", "Plenary sitting", "Kikao cha jumla"),
            ("committee", "Committee sitting", "Kikao cha kamati"),
            ("cabinet", "Cabinet meeting", "Mkutano wa Baraza la Mawaziri"),
            ("bench", "Court bench", "Jopo la mahakama"),
        ],
    ),
    "act.motion.kind": (
        "Kind of motion",
        [
            ("bill", "Bill", "Mswada"),
            ("motion", "Motion", "Hoja"),
            ("budget", "Budget decision", "Uamuzi wa bajeti"),
            ("appointment", "Appointment vetting", "Kuidhinisha uteuzi"),
            ("executive-decision", "Executive decision", "Uamuzi wa utendaji"),
            ("judgment", "Judgment", "Hukumu"),
        ],
    ),
    "act.motion.outcome": (
        "Outcome of a motion",
        [
            ("passed", "Passed", "Imepitishwa"),
            ("rejected", "Rejected", "Imekataliwa"),
            ("withdrawn", "Withdrawn", "Imeondolewa"),
            ("pending", "Pending", "Inasubiri"),
        ],
    ),
    "act.vote.position": (
        "A member's position",
        [
            ("yes", "Yes", "Ndiyo"),
            ("no", "No", "Hapana"),
            ("abstain", "Abstained", "Alijizuia"),
            ("absent", "Absent", "Hakuwepo"),
        ],
    ),
    "act.contribution.kind": (
        "Kind of contribution",
        [
            ("speech", "Speech", "Hotuba"),
            ("question", "Question", "Swali"),
            ("statement", "Statement", "Taarifa"),
            ("petition", "Petition", "Ombi"),
        ],
    ),
    "fin.expenditure.class": (
        "What money was spent on",
        [
            ("salaries", "Salaries and staff costs", "Mishahara na gharama za wafanyakazi"),
            ("running-costs", "Running costs", "Gharama za uendeshaji"),
            ("committee", "Committee costs", "Gharama za kamati"),
            ("bursary", "Bursaries", "Basari"),
            ("emergency", "Emergency", "Dharura"),
            ("capacity-building", "Training and capacity building", "Mafunzo"),
            ("education-infrastructure", "Education infrastructure", "Miundombinu ya elimu"),
            ("roads-and-drainage", "Roads and drainage", "Barabara na mifereji"),
            ("health-infrastructure", "Health infrastructure", "Miundombinu ya afya"),
            ("security-and-administration", "Security and administration", "Usalama na utawala"),
            ("other-projects", "Other projects", "Miradi mingine"),
        ],
    ),
    "civ.procurement.status": (
        "Where a tender stands",
        [
            ("open", "Open", "Wazi"),
            ("closed", "Closed", "Imefungwa"),
            ("evaluation", "Under evaluation", "Inatathminiwa"),
            ("awarded", "Awarded", "Imetuzwa"),
            ("cancelled", "Cancelled", "Imefutwa"),
            ("complete", "Complete", "Imekamilika"),
        ],
    ),
    "fil.media.platform": (
        "Where remote media lives",
        [
            (w, w.title(), w.title())
            for w in ("youtube", "tiktok", "facebook", "instagram", "x", "vimeo", "pexels", "dicebear", "website")
        ],
    ),
    "fil.folder.role": ("What a folder is for", [("media", "Media", "Vyombo vya habari")]),
    "fin.budget.status": (
        "State of a budget version",
        [("approved", "Approved", "Imeidhinishwa"), ("proposed", "Proposed", "Imependekezwa")],
    ),
    "pol.election.kind": (
        "Kind of election",
        [
            ("general", "General election", "Uchaguzi mkuu"),
            ("by-election", "By-election", "Uchaguzi mdogo"),
            ("referendum", "Referendum", "Kura ya maoni"),
        ],
    ),
    "pol.contest.kind": (
        "Kind of contest",
        [
            ("presidential", "President", "Rais"),
            ("governor", "Governor", "Gavana"),
            ("member-of-parliament", "Member of Parliament", "Mbunge"),
            ("member-of-county-assembly", "Member of County Assembly", "Mwakilishi wa Wadi"),
        ],
    ),
    "pol.candidate.kind": ("Kind of candidate", [("candidate", "Candidate", "Mgombea")]),
    "pol.result.status": (
        "Status of a result",
        [("declared", "Declared", "Imetangazwa"), ("provisional", "Provisional", "Ya muda")],
    ),
    "fin.period.kind": ("Kind of fiscal period", [("financial-year", "Financial year", "Mwaka wa fedha")]),
    "ofc.contact.kind": (
        "Contact kinds added for dev",
        [
            ("x", "X (Twitter)", "X (Twitter)"),
            ("facebook", "Facebook", "Facebook"),
            ("instagram", "Instagram", "Instagram"),
            ("tiktok", "TikTok", "TikTok"),
            ("youtube", "YouTube", "YouTube"),
        ],
    ),
}
EXISTING_SCHEMES = {"ofc.contact.kind"}

TOPICS: list[tuple[str, str, str]] = [
    ("topic.population", "Population", ""),
    ("topic.demographics", "Demographics", "topic.population"),
    ("topic.health", "Health", ""),
    ("topic.education", "Education", ""),
    ("topic.economy", "Economy and poverty", ""),
    ("topic.water", "Water and sanitation", ""),
    ("topic.governance", "Governance", ""),
    ("topic.elections", "Elections", ""),
    ("topic.transparency", "Transparency and audit", "topic.governance"),
    ("topic.civic", "Civic infrastructure", ""),
    ("topic.land", "Land and area", ""),
]
UNITS: list[tuple[str, str, str, str]] = [
    ("unit.person", "persons", "people", "1"),
    ("unit.percent", "%", "share", "1"),
    ("unit.kes", "KSh", "money", "1"),
    ("unit.km2", "km²", "area", "1"),
    ("unit.per-km2", "per km²", "density", "1"),
    ("unit.score", "score", "index", "1"),
    ("unit.per-100k", "per 100,000", "rate", "1"),
    ("unit.count", "count", "count", "1"),
]
LANGUAGES: list[tuple[str, str, str]] = [
    ("ki", "Kikuyu", "Gĩkũyũ"),
    ("luo", "Dholuo", "Dholuo"),
    ("kam", "Kikamba", "Kĩkamba"),
    ("kln", "Kalenjin", "Kalenjin"),
    ("luy", "Luhya", "Luluhya"),
    ("so", "Somali", "Soomaali"),
    ("mer", "Kimeru", "Kĩmĩrũ"),
]


def build_reference(t: Tables) -> None:
    for scheme, (title, members) in SCHEMES.items():
        if scheme not in EXISTING_SCHEMES:
            t.add("global/reference/dev2.schemes.csv", {"code": scheme, "title": title, "owner_snapshot": "dev sample"})
        for word, english, swahili in members:
            code = f"{scheme}.{word}"
            t.add("global/reference/values/dev2.values.csv", {"code": code, "scheme_code": scheme, "label": english})
            t.add(
                "global/reference/dev2.value_labels.csv",
                {"value_code": code, "language_code": "sw", "label_kind": "preferred", "label": swahili},
            )
    for scheme, members in EXTRA_VALUES.items():
        for word, english, swahili in members:
            code = f"{scheme}.{word}"
            t.add("global/reference/values/dev2.values.csv", {"code": code, "scheme_code": scheme, "label": english})
            t.add(
                "global/reference/dev2.value_labels.csv",
                {"value_code": code, "language_code": "sw", "label_kind": "preferred", "label": swahili},
            )
    for code, label, parent in TOPICS:
        t.add("global/reference/topics.csv", {"code": code, "label": label, "parent_code": parent})
    for code, symbol, quantity, scale in UNITS:
        t.add(
            "global/reference/units.csv",
            {"code": code, "symbol": symbol, "quantity": quantity, "scale": scale, "offset": "0", "base_code": ""},
        )
    for code, name, endonym in LANGUAGES:
        t.add(
            "global/reference/dev2.languages.csv",
            {
                "code": code,
                "name": name,
                "iso6391": code if len(code) == 2 else "",
                "iso6393": code if len(code) == 3 else "",
                "kind_code": "ref.language.kind.language",
            },
        )
        t.add(
            "global/reference/dev2.language_names.csv",
            {"language_code": code, "in_language_code": code, "name": endonym, "name_kind": "endonym"},
        )
