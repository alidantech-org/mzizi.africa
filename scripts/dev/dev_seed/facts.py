"""Did-you-know facts about Kenya, tagged to places. These are well-known public facts written for the interface; the
source is stated in each detail line, and none is a statistic that the system computes. A fact with no place is about the
whole country."""

from __future__ import annotations

from dev_seed.common import Feature, slug
from dev_seed.store import Tables

# (statement, detail, topic, place county slug or "" for the whole country)
FACTS: list[tuple[str, str, str, str]] = [
    (
        "Kenya has 47 counties, each with its own elected governor.",
        "They were created by the Constitution of 2010 and began work after the 2013 election.",
        "topic.governance",
        "",
    ),
    (
        "Kenya's Constitution was promulgated on 27 August 2010.",
        "It replaced the independence constitution and introduced devolution and a Bill of Rights.",
        "topic.governance",
        "",
    ),
    (
        "More than forty communities call Kenya home.",
        "Kikuyu, Luhya, Kalenjin, Luo and Kamba are the largest, and Swahili and English are the official languages.",
        "topic.demographics",
        "",
    ),
    (
        "The 2019 census counted 47.6 million people in Kenya.",
        "It was the country's first census with a third gender category, counted at 1,524 people.",
        "topic.population",
        "",
    ),
    (
        "The Great Rift Valley runs through Kenya from north to south.",
        "It holds a chain of lakes, from Turkana in the north to Magadi in the south.",
        "topic.land",
        "",
    ),
    (
        "Nairobi is the only capital city with a national park inside its limits.",
        "Nairobi National Park shares a border with the city, and lions can be seen against the skyline.",
        "topic.land",
        "nairobi",
    ),
    (
        "Nairobi is the most populous county in Kenya.",
        "The 2019 census counted 4.4 million residents in 694.9 square kilometres.",
        "topic.population",
        "nairobi",
    ),
    (
        "Mount Kenya is the second-highest mountain in Africa.",
        "Its highest peak, Batian, rises to 5,199 metres and the mountain is a UNESCO World Heritage Site.",
        "topic.land",
        "nyeri",
    ),
    (
        "Lake Turkana is the world's largest permanent desert lake.",
        "It is also called the Jade Sea, and its shores are a UNESCO World Heritage Site.",
        "topic.land",
        "turkana",
    ),
    (
        "Lamu Old Town is the oldest continuously inhabited Swahili settlement in Kenya.",
        "It was named a UNESCO World Heritage Site in 2001.",
        "topic.governance",
        "lamu",
    ),
    (
        "Fort Jesus in Mombasa was built by the Portuguese in 1593.",
        "It became a UNESCO World Heritage Site in 2011.",
        "topic.governance",
        "mombasa",
    ),
    (
        "Mombasa is Kenya's main seaport.",
        "Most of the country's imports, and goods for Uganda and Rwanda, pass through it.",
        "topic.economy",
        "mombasa",
    ),
    (
        "Lake Nakuru is known for its flamingos.",
        "At times hundreds of thousands gather on the shallow lake, which is a national park.",
        "topic.land",
        "nakuru",
    ),
    (
        "Kisumu sits on Lake Victoria, the largest lake in Africa.",
        "Lake Victoria is shared by Kenya, Uganda and Tanzania.",
        "topic.land",
        "kisumu",
    ),
    (
        "Eldoret and the Rift Valley highlands have produced many Olympic champions.",
        "Altitude and a strong running culture make the area a global centre of distance running.",
        "topic.education",
        "uasin-gishu",
    ),
    (
        "Every year the Great Migration crosses the Maasai Mara.",
        "Over a million wildebeest and zebra move between the Serengeti and the Mara between July and October.",
        "topic.land",
        "narok",
    ),
    (
        "Hell's Gate National Park, near Naivasha, lets visitors walk and cycle among wildlife.",
        "It is one of the few Kenyan parks where this is allowed.",
        "topic.land",
        "nakuru",
    ),
    (
        "Lake Naivasha is one of the few freshwater lakes in the Rift Valley.",
        "Flower farms around it are a major source of Kenya's exports.",
        "topic.economy",
        "nakuru",
    ),
    (
        "The Standard Gauge Railway links Mombasa to Nairobi.",
        "It opened in 2017 and cut the journey to about five hours.",
        "topic.economy",
        "",
    ),
    (
        "Kenya was among the first African countries to popularise mobile money.",
        "M-Pesa launched in 2007, and most adults now use a mobile wallet.",
        "topic.economy",
        "",
    ),
    (
        "Kenya's coat of arms carries the Swahili words Harambee.",
        "It means 'let us all pull together' and is the country's motto.",
        "topic.governance",
        "",
    ),
    (
        "Kenya has a county named after a river that forms its border: Tana River.",
        "The Tana is Kenya's longest river, at about 1,000 kilometres.",
        "topic.land",
        "tana-river",
    ),
    (
        "Marsabit is home to a national park and a forested volcano in the northern desert.",
        "Its crater lakes are an oasis for elephants and birds.",
        "topic.land",
        "marsabit",
    ),
    (
        "Kenya's parliament has two houses: the National Assembly and the Senate.",
        "The National Assembly has 349 members; the Senate has 67.",
        "topic.governance",
        "",
    ),
    (
        "A county governor serves a five-year term and may be re-elected once.",
        "Counties are run by the governor with a county executive and a county assembly.",
        "topic.governance",
        "",
    ),
    (
        "Kenya holds general elections every five years on the second Tuesday of August.",
        "Voters choose a president, governors, senators, women representatives, MPs and ward representatives.",
        "topic.elections",
        "",
    ),
    (
        "Machakos was one of the first towns on the old caravan route to the coast.",
        "It is now a county headquarters about 60 kilometres from Nairobi.",
        "topic.governance",
        "machakos",
    ),
    (
        "Kakamega Forest is the last remnant of the ancient Guineo-Congolian rainforest in Kenya.",
        "It shelters species found nowhere else in the country.",
        "topic.land",
        "kakamega",
    ),
    (
        "Garissa lies on the Tana River and is the largest town in north-eastern Kenya.",
        "It is a centre of the pastoral trade in livestock.",
        "topic.economy",
        "garissa",
    ),
]


def build_facts(t: Tables, counties: list[Feature]) -> int:
    by_slug = {c.code.split(".")[1]: c.code for c in counties}
    for number, (statement, detail, topic, county) in enumerate(FACTS, start=1):
        code = f"ke.fact.{number:03d}-{slug(statement)[:40].strip('-')}"
        row = {"code": code, "statement": statement, "detail": detail, "topic_code": topic}
        t.add("ke/facts/facts.csv", row)
        if county and county in by_slug:
            t.add("ke/facts/fact_places.csv", {"fact_code": code, "feature_code": by_slug[county]})
    return len(FACTS)
