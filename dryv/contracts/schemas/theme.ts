/**
 * The shared Mzizi theme: the one place colours, type, radii and shadows are defined.
 *
 * Foundation tokens come from the landing page (`source/apps/www/src/app/globals.css`). Generation maps
 * them, and the semantic roles, to CSS/Tailwind for the Next.js apps and `ThemeData` for Flutter. The
 * dark mode (`bark` tokens) and the `danger` colour are new proposals, not taken from www.
 */
import { dryv, theme, themeMode, token } from "@dryvcode/author";

export const brand = dryv.group({ name: "brand" }).description("Mzizi brand: design tokens shared by every frontend.");

export const themes = brand.themes({
  Mzizi: theme(
    {
      // Colour: earth palette from the landing page.
      oat: token.color("#F2ECE0"),
      cream: token.color("#FBF7EF"),
      sand: token.color("#E9DEC6"),
      ink: token.color("#2B231C"),
      inkSoft: token.color("#7A6B5C"),
      line: token.color("#E0D5C2"),
      clay: token.color("#B4542F"),
      calabash: token.color("#C68A2E"),
      raffia: token.color("#6B7A4B"),
      indigo: token.color("#2F4C6E"),
      // Proposed, not in www: a destructive colour and the dark-mode surfaces.
      danger: token.color("#A63A2B"),
      bark: token.color("#3A3027"),
      barkLine: token.color("#52463A"),

      // Shape.
      radiusSm: token.dimension(12),
      radius: token.dimension(20),
      radiusLg: token.dimension(30),
      radiusXl: token.dimension(42),

      // Type.
      fontDisplay: token.fontFamily("Iowan Old Style", "Palatino Linotype", "Palatino", "Book Antiqua", "Georgia", "serif"),
      fontBody: token.fontFamily("ui-sans-serif", "-apple-system", "Segoe UI", "Inter", "Roboto", "Helvetica", "Arial", "sans-serif"),
      fontMono: token.fontFamily("ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"),

      // Depth: the main layer of the www shadows (one layer per token).
      shadow: token.shadow({
        color: "#46342238",
        offset_x: { value: 0, unit: "px" },
        offset_y: { value: 8, unit: "px" },
        blur: { value: 24, unit: "px" },
        spread: { value: -12, unit: "px" },
      }),
      shadowLift: token.shadow({
        color: "#46342257",
        offset_x: { value: 0, unit: "px" },
        offset_y: { value: 22, unit: "px" },
        blur: { value: 44, unit: "px" },
        spread: { value: -18, unit: "px" },
      }),
    },
    {
      "content.primary": "ink",
      "content.inverse": "cream",
      "surface.background": "oat",
      "surface.elevated": "cream",
      "action.primary": "clay",
      "action.danger": "danger",
      "border.default": "line",
      "focus.indicator": "indigo",
    },
    {
      dark: themeMode(
        {
          "content.primary": "cream",
          "content.inverse": "ink",
          "surface.background": "ink",
          "surface.elevated": "bark",
          "border.default": "barkLine",
          "focus.indicator": "calabash",
        },
        { color_scheme: "dark" },
      ),
    },
  ),
});
