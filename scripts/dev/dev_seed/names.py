"""Name lists and weights for the invented people, parties, companies and projects."""

from __future__ import annotations

import random

FIRST = [
    "Wanjiru",
    "Kamau",
    "Achieng",
    "Otieno",
    "Njeri",
    "Mwangi",
    "Akinyi",
    "Odhiambo",
    "Chebet",
    "Kiprono",
    "Amina",
    "Hassan",
    "Naliaka",
    "Wafula",
    "Mutheu",
    "Musyoka",
    "Wambui",
    "Kariuki",
    "Atieno",
    "Omondi",
    "Jepkosgei",
    "Kiplagat",
    "Fatuma",
    "Abdi",
    "Nyambura",
    "Maina",
    "Adhiambo",
    "Ochieng",
    "Cherono",
    "Rotich",
    "Zawadi",
    "Mohamed",
    "Syokau",
    "Kioko",
    "Naserian",
    "Lekishon",
    "Moraa",
    "Nyakundi",
    "Wangari",
    "Gathoni",
]
LAST = [
    "Mwangi",
    "Njoroge",
    "Otieno",
    "Kamau",
    "Odhiambo",
    "Wekesa",
    "Kiptoo",
    "Mutua",
    "Ndung'u",
    "Omondi",
    "Kibet",
    "Abdullahi",
    "Wanyama",
    "Kimani",
    "Ochieng",
    "Muriuki",
    "Barasa",
    "Cheruiyot",
    "Ouma",
    "Nyaga",
    "Korir",
    "Ali",
    "Mbugua",
    "Simiyu",
    "Kilonzo",
    "Gitau",
    "Onyango",
    "Langat",
    "Hussein",
    "Macharia",
    "Nzioka",
    "Ruto",
    "Karanja",
]
PARTIES = [
    ("uda", "United Democratic Alliance", 5),
    ("odm", "Orange Democratic Movement", 5),
    ("jubilee", "Jubilee Party", 2),
    ("wiper", "Wiper Democratic Movement", 2),
    ("anc", "Amani National Congress", 1),
    ("kanu", "Kenya African National Union", 1),
    ("ford-kenya", "FORD-Kenya", 1),
    ("dap-k", "Democratic Action Party of Kenya", 1),
    ("independent", "Independent", 1),
]
COMPANY_WORDS = [
    "Savannah",
    "Rift",
    "Lakeside",
    "Highland",
    "Coastal",
    "Equator",
    "Baobab",
    "Acacia",
    "Kilimani",
    "Safari",
]
COMPANY_TRADES = [
    "Roadworks",
    "Construction",
    "Water Engineering",
    "Electrical Works",
    "Supplies",
    "Medical Supplies",
    "ICT Solutions",
    "Builders",
]
PROJECT_THEMES = [
    ("Rehabilitation of access roads", "roads"),
    ("Borehole drilling and water supply", "water"),
    ("Construction of a health dispensary", "health"),
    ("Supply of classroom desks", "education"),
    ("Street lighting installation", "energy"),
    ("Upgrading of a market shed", "markets"),
]


def person_name(rng: random.Random) -> str:
    return f"{rng.choice(FIRST)} {rng.choice(LAST)}"


def weighted_party(rng: random.Random) -> tuple[str, str]:
    pool = [(code, name) for code, name, weight in PARTIES for _ in range(weight)]
    return rng.choice(pool)
