import { defineCopy } from "../define.ts";

/** The pages about the reader: preferences, saved places and help. */
export const pages = defineCopy("pages", {
  eyebrowYou: { en: "You", sw: "Wewe" },
  eyebrowHelp: { en: "Help", sw: "Msaada" },
  backToExploring: { en: "← Back to exploring", sw: "← Rudi kuchunguza" },
  me: {
    title: { en: "Your preferences", sw: "Mapendeleo yako" },
    intro: {
      en: "Theme, sound, language and the places you keep. They are kept in cookies in this browser so every page can show them the way you left them. Nothing is sent to a server.",
      sw: "Mandhari, sauti, lugha na maeneo unayohifadhi. Vinahifadhiwa kwenye vidakuzi vya kivinjari hiki ili kila ukurasa uvionyeshe kama ulivyoviacha. Hakuna kinachotumwa kwa seva.",
    },
    reset: { en: "Reset theme and sound to defaults", sw: "Rudisha mandhari na sauti kwenye hali ya awali" },
    theme: { en: "Theme", sw: "Mandhari" },
    themeNote: {
      en: "Colours, contrast, text size and display options. Changes apply at once.",
      sw: "Rangi, utofautishaji, ukubwa wa maandishi na chaguo za mwonekano. Mabadiliko hutumika mara moja.",
    },
    sound: { en: "Sound", sw: "Sauti" },
    soundNote: {
      en: "Read pages aloud and choose how Mzizi answers.",
      sw: "Soma kurasa kwa sauti na uchague jinsi Mzizi inavyojibu.",
    },
    language: { en: "Language", sw: "Lugha" },
    languageNote: {
      en: "A ?lang= in a link wins and is remembered. Without it, this choice is used. Choosing a language does not translate source evidence.",
      sw: "?lang= kwenye kiungo hushinda na hukumbukwa. Bila hiyo, chaguo hili hutumika. Kuchagua lugha hakutafsiri ushahidi wa vyanzo.",
    },
    places: { en: "Places", sw: "Maeneo" },
    placesNote: {
      en: "Your home place is chosen in setup. It decides where you start.",
      sw: "Eneo lako la nyumbani huchaguliwa kwenye uwekaji. Huamua unapoanzia.",
    },
    homeNow: { en: "Home place: {place}", sw: "Eneo la nyumbani: {place}" },
    homeNone: { en: "No home place yet.", sw: "Bado hakuna eneo la nyumbani." },
    changeHome: { en: "Change home place →", sw: "Badilisha eneo la nyumbani →" },
    manageSaved: { en: "Manage saved places →", sw: "Simamia maeneo yaliyohifadhiwa →" },
    app: { en: "App", sw: "Programu" },
    appNote: {
      en: "Install Mzizi to open it like an app.",
      sw: "Sakinisha Mzizi ili kuifungua kama programu.",
    },
    installUnavailable: {
      en: "Installing is not offered in this browser right now.",
      sw: "Kusakinisha hakutolewi kwenye kivinjari hiki kwa sasa.",
    },
  },
  saved: {
    title: { en: "Saved places", sw: "Maeneo yaliyohifadhiwa" },
    intro: {
      en: "Each card opens that place with the subject you choose.",
      sw: "Kila kadi hufungua eneo hilo na mada unayochagua.",
    },
    labelOptional: { en: "Label (optional)", sw: "Lebo (hiari)" },
    labelPlaceholder: { en: "Work, Family…", sw: "Kazi, Familia…" },
    label: { en: "Label", sw: "Lebo" },
    find: { en: "Find a place", sw: "Tafuta eneo" },
    findPlaceholder: {
      en: "Search a county, constituency, sub-county or ward",
      sw: "Tafuta kaunti, eneo bunge, kaunti ndogo au wadi",
    },
    findNeedsCountry: {
      en: "Choose a country in setup first, then search for places to save.",
      sw: "Chagua nchi kwenye uwekaji kwanza, kisha utafute maeneo ya kuhifadhi.",
    },
    empty: { en: "No saved places yet.", sw: "Bado hakuna maeneo yaliyohifadhiwa." },
    emptyManage: { en: " Search above to add one.", sw: " Tafuta hapo juu kuongeza moja." },
    remove: { en: "Remove {place}", sw: "Ondoa {place}" },
    explore: { en: "Explore", sw: "Chunguza" },
    home: { en: "Home", sw: "Nyumbani" },
    unresolved: { en: "Not in the registered places", sw: "Haipo kwenye maeneo yaliyosajiliwa" },
  },
  help: {
    title: { en: "How addresses work", sw: "Jinsi anwani zinavyofanya kazi" },
    intro: {
      en: "The address names a place. The sidebar chooses what to show about it. Changing the subject keeps the place; changing the place keeps the subject.",
      sw: "Anwani hutaja eneo. Upau wa pembeni huchagua cha kuonyesha kulihusu. Kubadilisha mada huhifadhi eneo; kubadilisha eneo huhifadhi mada.",
    },
    rowPlace: { en: "A place, within its parent places.", sw: "Eneo, ndani ya maeneo yanayolizunguka." },
    rowSubject: { en: "A subject about that same place.", sw: "Mada kuhusu eneo hilo hilo." },
    rowSelection: { en: "A record inside a subject.", sw: "Rekodi ndani ya mada." },
    rowList: { en: "Filters, sorting and pages in a list.", sw: "Vichujio, upangaji na kurasa kwenye orodha." },
    rowLang: { en: "An explicit interface language.", sw: "Lugha ya kiolesura iliyochaguliwa wazi." },
    shortcutsLead: { en: "Shortcuts.", sw: "Njia za mkato." },
    shortcutSearch: { en: "search", sw: "tafuta" },
    shortcutSidebar: { en: "show or hide the sidebar", sw: "onyesha au ficha upau wa pembeni" },
    shortcutResize: { en: "drag the sidebar edge to resize", sw: "buruta ukingo wa upau wa pembeni kubadilisha ukubwa" },
    a11yTitle: { en: "Accessibility", sw: "Ufikivu" },
    a11yIntro: {
      en: "Mzizi is built to work with screen readers, keyboards and assistive settings. These commitments apply to every page and every new component.",
      sw: "Mzizi imejengwa kufanya kazi na visoma skrini, kibodi na mipangilio saidizi. Ahadi hizi zinatumika kwa kila ukurasa na kila kijenzi kipya.",
    },
    a11yStructure: { en: "Structure:", sw: "Muundo:" },
    a11yStructureText: {
      en: "one heading outline per page, landmarks for navigation, main content and sidebar, and a visible keyboard focus on every control.",
      sw: "muhtasari mmoja wa vichwa kwa kila ukurasa, alama za urambazaji, maudhui makuu na upau wa pembeni, na mwelekeo wa kibodi unaoonekana kwenye kila kidhibiti.",
    },
    a11yNames: { en: "Names and descriptions:", sw: "Majina na maelezo:" },
    a11yNamesText: {
      en: "every icon-only button has an accessible name and images carry alternative text.",
      sw: "kila kitufe chenye ikoni pekee kina jina linalofikika na picha zina maandishi mbadala.",
    },
    a11yDialogs: { en: "Dialogs and menus:", sw: "Madirisha na menyu:" },
    a11yDialogsText: {
      en: "they close with Escape, return focus where you were and announce their title.",
      sw: "hufungwa kwa Escape, hurudisha mwelekeo ulipokuwa na hutangaza kichwa chake.",
    },
    a11yColour: { en: "Colour:", sw: "Rangi:" },
    a11yColourText: {
      en: "meaning is never carried by colour alone. Contrast modes: high contrast, high contrast light, yellow on black and black on yellow.",
      sw: "maana haibebwi na rangi peke yake. Hali za utofautishaji: utofautishaji wa juu, utofautishaji wa juu wa mwanga, njano kwenye nyeusi na nyeusi kwenye njano.",
    },
    a11yText: { en: "Text:", sw: "Maandishi:" },
    a11yTextText: {
      en: "four text sizes, wider text spacing, underlined links and reduced motion.",
      sw: "ukubwa nne wa maandishi, nafasi pana ya maandishi, viungo vilivyopigiwa mstari na mwendo uliopunguzwa.",
    },
    a11yVoice: { en: "Voice:", sw: "Sauti:" },
    a11yVoiceText: {
      en: "talk to search, read a page aloud, and optional spoken responses or hands-free mode. These use your browser's own speech support.",
      sw: "tafuta kwa sauti, soma ukurasa kwa sauti, na majibu ya sauti hiari au hali bila mikono. Hizi hutumia usaidizi wa usemaji wa kivinjari chako.",
    },
    scrollTitle: { en: "Your place on the page", sw: "Mahali pako kwenye ukurasa" },
    scrollText: {
      en: "Switching place, sorting, filtering or changing a tab keeps you where you were reading instead of jumping to the top. The address also records the section you are on (the part after #), so a copied link opens at the same spot, and Back returns to your previous place and position.",
      sw: "Kubadilisha eneo, kupanga, kuchuja au kubadilisha kichupo hukuweka ulipokuwa unasoma badala ya kurukia juu. Anwani pia hurekodi sehemu uliyomo (sehemu baada ya #), hivyo kiungo kilichonakiliwa hufunguka mahali pale pale, na Rudi hukurudisha mahali na nafasi yako ya awali.",
    },
    languageTitle: { en: "Language", sw: "Lugha" },
    languageText: {
      en: "The language comes from ?lang= in the address, then your saved choice, then the default. Everything the interface says is in that language. Source texts keep the language they were written in.",
      sw: "Lugha hutoka kwenye ?lang= kwenye anwani, kisha chaguo lako lililohifadhiwa, kisha ile ya kawaida. Kila kitu ambacho kiolesura kinasema kiko katika lugha hiyo. Maandishi ya vyanzo hubaki katika lugha yalimoandikwa.",
    },
  },
});
