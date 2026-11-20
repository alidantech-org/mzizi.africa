import { defineCopy } from "../define.ts";

/** The help, saved places and appearance menus in the top bar. */
export const menus = defineCopy("menus", {
  help: {
    label: { en: "Help and more", sw: "Msaada na zaidi" },
    help: { en: "Help", sw: "Msaada" },
    preferences: { en: "Your preferences", sw: "Mapendeleo yako" },
    shortcuts: { en: "Keyboard shortcuts", sw: "Njia za mkato za kibodi" },
    searchPlaces: { en: "Search places", sw: "Tafuta maeneo" },
    toggleSidebar: { en: "Show or hide sidebar", sw: "Onyesha au ficha upau wa pembeni" },
    install: { en: "Install Mzizi as an app", sw: "Sakinisha Mzizi kama programu" },
    installIos: {
      en: "To install: tap Share, then Add to Home Screen.",
      sw: "Ili kusakinisha: gusa Shiriki, kisha Ongeza kwenye Skrini ya Mwanzo.",
    },
  },
  saved: {
    label: { en: "Saved places", sw: "Maeneo yaliyohifadhiwa" },
    labelWithCount: { en: "Saved places, {count}", sw: "Maeneo yaliyohifadhiwa, {count}" },
    empty: { en: "Nothing saved yet.", sw: "Hakuna kilichohifadhiwa bado." },
    hideCount: { en: "Hide count", sw: "Ficha idadi" },
    viewAll: { en: "View all →", sw: "Tazama yote →" },
  },
  language: {
    label: { en: "Choose language", sw: "Chagua lugha" },
    button: { en: "Language: {code}. Change language", sw: "Lugha: {code}. Badilisha lugha" },
    search: { en: "Search languages", sw: "Tafuta lugha" },
    available: { en: "Available", sw: "Zinazopatikana" },
    found: { en: "{count} found", sw: "{count} zimepatikana" },
    noMatch: { en: "No language matches.", sw: "Hakuna lugha inayolingana." },
    note: {
      en: "Choosing a language changes the interface only. Source evidence is not translated.",
      sw: "Kuchagua lugha kunabadilisha kiolesura tu. Ushahidi wa vyanzo haujatafsiriwa.",
    },
  },
  settings: {
    label: { en: "Appearance and accessibility", sw: "Mwonekano na ufikivu" },
    tabs: { en: "Preferences", sw: "Mapendeleo" },
    theme: { en: "Theme", sw: "Mandhari" },
    sound: { en: "Sound", sw: "Sauti" },
    reset: { en: "Reset", sw: "Weka upya" },
    manage: { en: "Manage preferences →", sw: "Simamia mapendeleo →" },
  },
});
