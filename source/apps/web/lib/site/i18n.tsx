"use client";

/**
 * Interface language. The words of the interface live here (English and Swahili); the names and labels of places,
 * offices and kinds come from the API in the language chosen here, so the system's own translations are used
 * wherever it holds them. The choice is remembered in the browser.
 */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SW_PHRASES } from "#/lib/site/phrases.ts";

export type Language = "en" | "sw";

const WORDS = {
  en: {
    tagline: "Who serves you, where the money goes, and the evidence behind it.",
    navPlaces: "Places",
    navStats: "Statistics",
    navElections: "Elections",
    navParliament: "Parliament",
    navCivic: "Money & projects",
    navBoards: "Rankings",
    navTenders: "Tenders",
    navLeaders: "Leaders",
    navInstitutions: "Institutions",
    navConstitution: "Constitution",
    navCompare: "Compare places",
    navParties: "Parties",
    searchEverything: "Search places, leaders, parties, projects…",
    navSources: "Sources",
    heroTitle: "Know your place in Kenya",
    heroBody:
      "Find the people who represent you, the public projects around you, and the sources behind every claim.",
    useLocation: "Use my location",
    locating: "Finding where you are…",
    locationDenied: "We could not read your location. Search for your place by name instead.",
    searchPlaceholder: "Search a county, constituency or ward",
    search: "Search",
    noResults: "No places match that name.",
    representatives: "Who represents you",
    procurement: "Public projects and procurement",
    totalAwarded: "Awarded in total",
    contracts: "contracts",
    awardedTo: "Awarded to",
    evidence: "Evidence",
    seeEvidence: "See evidence",
    sources: "Sources",
    sourcesBody:
      "Every fact on this site points back to a source. These are the datasets and documents behind it.",
    artifacts: "files",
    citations: "citations",
    searchSources: "Filter sources",
    inOffice: "In office since",
    party: "Party",
    notRecorded: "Not recorded yet",
    sampleNotice:
      "This place uses sample development data: people, parties and amounts are invented.",
    gaps: "What is missing",
    chainLabel: "Where this sits",
    loading: "Loading…",
    errorTitle: "Something went wrong",
    retry: "Try again",
    edition: "Edition",
    locator: "Where in the file",
    files: "Files",
    back: "Back",
    footerAbout:
      "Mzizi connects African knowledge across time and place, and keeps the evidence with it.",
    footerData: "Data",
    footerProject: "Project",
    language: "Language",
    likeLeader: "Follow this leader",
    likeProject: "Like this project",
    savePlace: "Save place",
    savedPlace: "Saved",
    saveSpot: "Save my spot",
    spotSaved: "Spot saved",
    navSaved: "Saved",
    savedTitle: "Your saved",
    savedBody:
      "Places, leaders and spots you keep. They stay on this device; nothing is sent anywhere.",
    savedEmpty: "Nothing saved yet. Open a place and tap the star or the heart.",
    myPlaces: "Places",
    myLeaders: "Leaders you follow",
    myProjects: "Projects you like",
    mySpots: "Spots from your GPS",
    remove: "Remove",
    mapTitle: "On the map",
    youAreHere: "You are here",
  },
  sw: {
    tagline: "Nani anakuhudumia, pesa zinakwenda wapi, na ushahidi wake.",
    navPlaces: "Maeneo",
    navStats: "Takwimu",
    navElections: "Uchaguzi",
    navParliament: "Bunge",
    navCivic: "Fedha na miradi",
    navBoards: "Viwango",
    navTenders: "Zabuni",
    navLeaders: "Viongozi",
    navInstitutions: "Taasisi",
    navConstitution: "Katiba",
    navCompare: "Linganisha maeneo",
    navParties: "Vyama",
    searchEverything: "Tafuta maeneo, viongozi, vyama, miradi…",
    navSources: "Vyanzo",
    heroTitle: "Jua eneo lako nchini Kenya",
    heroBody: "Pata wanaokuwakilisha, miradi ya umma karibu nawe, na vyanzo vya kila dai.",
    useLocation: "Tumia mahali nilipo",
    locating: "Tunatafuta mahali ulipo…",
    locationDenied: "Hatukuweza kusoma mahali ulipo. Tafuta eneo lako kwa jina.",
    searchPlaceholder: "Tafuta kaunti, eneobunge au wadi",
    search: "Tafuta",
    noResults: "Hakuna maeneo yanayolingana na jina hilo.",
    representatives: "Wanaokuwakilisha",
    procurement: "Miradi ya umma na ununuzi",
    totalAwarded: "Jumla iliyotolewa",
    contracts: "mikataba",
    awardedTo: "Imetolewa kwa",
    evidence: "Ushahidi",
    seeEvidence: "Tazama ushahidi",
    sources: "Vyanzo",
    sourcesBody:
      "Kila taarifa hapa inarudi kwenye chanzo. Hivi ndivyo seti za data na hati zilizo nyuma yake.",
    artifacts: "faili",
    citations: "marejeo",
    searchSources: "Chuja vyanzo",
    inOffice: "Ofisini tangu",
    party: "Chama",
    notRecorded: "Bado haijarekodiwa",
    sampleNotice: "Eneo hili linatumia data ya majaribio: watu, vyama na kiasi vimebuniwa.",
    gaps: "Kinachokosekana",
    chainLabel: "Eneo hili liko wapi",
    loading: "Inapakia…",
    errorTitle: "Hitilafu imetokea",
    retry: "Jaribu tena",
    edition: "Toleo",
    locator: "Mahali kwenye faili",
    files: "Faili",
    back: "Rudi",
    footerAbout:
      "Mzizi inaunganisha maarifa ya Afrika kwa wakati na mahali, na kuweka ushahidi pamoja nayo.",
    footerData: "Data",
    footerProject: "Mradi",
    language: "Lugha",
    likeLeader: "Mfuate kiongozi huyu",
    likeProject: "Penda mradi huu",
    savePlace: "Hifadhi eneo",
    savedPlace: "Imehifadhiwa",
    saveSpot: "Hifadhi mahali pangu",
    spotSaved: "Mahali pamehifadhiwa",
    navSaved: "Vilivyohifadhiwa",
    savedTitle: "Ulivyohifadhi",
    savedBody:
      "Maeneo, viongozi na mahali unavyohifadhi. Vinabaki kwenye kifaa hiki; hakuna kinachotumwa popote.",
    savedEmpty: "Hujahifadhi chochote bado. Fungua eneo kisha bonyeza nyota au moyo.",
    myPlaces: "Maeneo",
    myLeaders: "Viongozi unaowafuata",
    myProjects: "Miradi unayopenda",
    mySpots: "Mahali kutoka GPS yako",
    remove: "Ondoa",
    mapTitle: "Kwenye ramani",
    youAreHere: "Uko hapa",
  },
} as const;

export type Word = keyof (typeof WORDS)["en"];

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (word: Word) => string;
  /** Translates a sentence or heading of the newer pages; `{}` holes take the values in order. */
  tr: (english: string, ...values: (string | number | null | undefined)[]) => string;
}

const LanguageContext = createContext<LanguageState | null>(null);
const STORAGE_KEY = "mzizi.language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "sw") { setLanguageState(stored); document.cookie = `mz_lang=${stored}; path=/; max-age=31536000; samesite=lax`; }
    } catch {
      // The choice is only a convenience; the page works without storage.
    }
  }, []);
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `mz_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // Ignored: see above.
    }
  }, []);
  const value = useMemo<LanguageState>(
    () => ({
      language,
      setLanguage,
      t: (word) => WORDS[language][word],
      tr: (english, ...values) => {
        let text = language === "sw" ? (SW_PHRASES[english] ?? english) : english;
        for (const v of values) text = text.replace("{}", String(v ?? "—"));
        return text;
      },
    }),
    [language, setLanguage],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext);
  if (value === null) throw new Error("useLanguage needs a LanguageProvider");
  return value;
}

/** A sentence or heading of the newer pages, shown in the interface language. */
export function T({ children }: { children: string }) {
  return <>{useLanguage().tr(children)}</>;
}
