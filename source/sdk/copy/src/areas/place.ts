import { defineCopy } from "../define.ts";

/** The home view of a place: headline figures, the map of what is inside it, and how its people are made up. */
export const place = defineCopy("place", {
  eyebrow: { en: "{kind} · {parent}", sw: "{kind} · {parent}" },
  eyebrowCountry: { en: "{kind}", sw: "{kind}" },
  kpi: {
    population: { en: "Population", sw: "Idadi ya watu" },
    area: { en: "Land area", sw: "Eneo la ardhi" },
    density: { en: "People per km²", sw: "Watu kwa km²" },
    voters: { en: "Registered voters", sw: "Wapiga kura waliosajiliwa" },
    since: { en: "{change} since {year}", sw: "{change} tangu {year}" },
    asOf: { en: "Recorded for {year}", sw: "Imerekodiwa kwa {year}" },
    estimated: { en: "{text} (estimate)", sw: "{text} (makadirio)" },
  },
  map: {
    title: { en: "Inside {place}", sw: "Ndani ya {place}" },
    titleSelf: { en: "{place} on the map", sw: "{place} kwenye ramani" },
    noteShaded: { en: "Shaded by population", sw: "Imetiwa rangi kulingana na idadi ya watu" },
    noteOutline: { en: "Recorded boundary", sw: "Mpaka uliorekodiwa" },
    group: { en: "Places inside {place}", sw: "Maeneo ndani ya {place}" },
    shape: { en: "{name}, {value}", sw: "{name}, {value}" },
    lowest: { en: "Fewest", sw: "Wachache zaidi" },
    highest: { en: "Most", sw: "Wengi zaidi" },
    withoutBoundary: {
      en: "{count} places have no recorded boundary and are not drawn.",
      sw: "Maeneo {count} hayana mpaka uliorekodiwa na hayachorwi.",
    },
    none: { en: "No boundary is recorded for this place yet.", sw: "Bado hakuna mpaka uliorekodiwa wa eneo hili." },
    credit: { en: "Boundaries: {source}", sw: "Mipaka: {source}" },
  },
  people: {
    title: { en: "Who lives here", sw: "Wanaoishi hapa" },
    note: { en: "Latest recorded", sw: "Ya hivi karibuni zaidi iliyorekodiwa" },
    age: { en: "Age", sw: "Umri" },
    sex: { en: "Sex", sw: "Jinsia" },
    residence: { en: "Where people live", sw: "Mahali watu wanapoishi" },
    languages: { en: "Languages", sw: "Lugha" },
    communities: { en: "Communities", sw: "Jamii" },
    share: { en: "{label}: {share}", sw: "{label}: {share}" },
    chart: { en: "{what} of the people of {place}", sw: "{what} ya watu wa {place}" },
  },
  position: {
    title: { en: "Among its peers", sw: "Miongoni mwa wenzake" },
    population: { en: "{position} of {of} by population", sw: "Nafasi ya {position} kati ya {of} kwa idadi ya watu" },
    density: { en: "{position} of {of} by density", sw: "Nafasi ya {position} kati ya {of} kwa msongamano" },
  },
  children: {
    title: { en: "Places inside", sw: "Maeneo ya ndani" },
    count: { en: "{count} places", sw: "Maeneo {count}" },
    name: { en: "Name", sw: "Jina" },
    kind: { en: "Kind", sw: "Aina" },
    population: { en: "Population", sw: "Idadi ya watu" },
    inside: { en: "Places inside", sw: "Maeneo ya ndani" },
    none: { en: "No places are registered inside this one.", sw: "Hakuna maeneo yaliyosajiliwa ndani ya eneo hili." },
  },
  pending: {
    title: { en: "{subject} is not shown for places yet", sw: "{subject} bado haionyeshwi kwa maeneo" },
    text: {
      en: "The place and the subject are kept in the address, so this link will work as soon as the subject is added.",
      sw: "Eneo na mada vinahifadhiwa kwenye anwani, hivyo kiungo hiki kitafanya kazi mara mada itakapoongezwa.",
    },
    back: { en: "Back to {place}", sw: "Rudi {place}" },
  },
  empty: {
    statistics: {
      en: "No statistics are recorded for this place yet.",
      sw: "Bado hakuna takwimu zilizorekodiwa za eneo hili.",
    },
    unavailable: {
      en: "This place could not be loaded. Try again in a moment.",
      sw: "Eneo hili halikuweza kupakiwa. Jaribu tena baada ya muda mfupi.",
    },
  },
});
