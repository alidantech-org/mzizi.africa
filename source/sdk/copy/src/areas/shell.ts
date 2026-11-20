import { defineCopy } from "../define.ts";

/** Sidebar, navigation and the top bar. */
export const shell = defineCopy("shell", {
  home: { en: "Mzizi home", sw: "Mzizi nyumbani" },
  main: { en: "Main", sw: "Kuu" },
  sidebar: {
    label: { en: "Sidebar", sw: "Upau wa pembeni" },
    resize: { en: "Resize sidebar", sw: "Badilisha upana wa upau wa pembeni" },
    expand: { en: "Expand sidebar", sw: "Panua upau wa pembeni" },
    minimise: { en: "Minimise sidebar", sw: "Punguza upau wa pembeni" },
    open: { en: "Open sidebar", sw: "Fungua upau wa pembeni" },
    openWithKey: { en: "Open sidebar (Ctrl+B)", sw: "Fungua upau wa pembeni (Ctrl+B)" },
    closeMenu: { en: "Close menu", sw: "Funga menyu" },
  },
  group: {
    politics: { en: "Politics", sw: "Siasa" },
    government: { en: "Government", sw: "Serikali" },
    money: { en: "Money", sw: "Fedha" },
    data: { en: "Data", sw: "Data" },
  },
  link: {
    overview: { en: "Overview", sw: "Muhtasari" },
    elections: { en: "Elections", sw: "Uchaguzi" },
    parliament: { en: "Parliament", sw: "Bunge" },
    law: { en: "Laws", sw: "Sheria" },
    leaders: { en: "Leadership", sw: "Uongozi" },
    institutions: { en: "Institutions", sw: "Taasisi" },
    arms: { en: "Three arms", sw: "Mihimili mitatu" },
    power: { en: "Power model", sw: "Muundo wa madaraka" },
    finance: { en: "Finance", sw: "Fedha" },
    suppliers: { en: "Suppliers", sw: "Wasambazaji" },
    statistics: { en: "Statistics", sw: "Takwimu" },
    compare: { en: "Compare", sw: "Linganisha" },
    sources: { en: "Sources", sw: "Vyanzo" },
  },
  unavailable: {
    title: { en: "{label} is not available here", sw: "{label} haipatikani hapa" },
    description: { en: "{label} is not available here. {reason}", sw: "{label} haipatikani hapa. {reason}" },
    noData: {
      en: "{view} has no recorded data for {country} yet.",
      sw: "{view} haina data iliyorekodiwa ya {country} bado.",
    },
  },
});
