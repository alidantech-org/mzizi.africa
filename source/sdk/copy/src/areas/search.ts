import { defineCopy } from "../define.ts";

/** The header search field and its dialog. */
export const search = defineCopy("search", {
  field: {
    placeholder: { en: "Search places, institutions…", sw: "Tafuta maeneo, taasisi…" },
    shortcut: { en: "Press / to search", sw: "Bonyeza / kutafuta" },
    byVoice: { en: "Search by voice", sw: "Tafuta kwa sauti" },
  },
  dialog: {
    label: { en: "Search", sw: "Tafuta" },
    speak: { en: "Speak your search", sw: "Sema unachotafuta" },
    placeholder: { en: "A county, constituency, ward or public body", sw: "Kaunti, eneo bunge, wadi au taasisi ya umma" },
    listening: { en: "Listening…", sw: "Inasikiliza…" },
    loading: { en: "Loading places…", sw: "Inapakia maeneo…" },
    noMatch: { en: "Nothing matches “{query}”.", sw: "Hakuna kinacholingana na “{query}”." },
  },
});
