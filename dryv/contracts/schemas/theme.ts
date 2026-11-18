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
      // Colour: an earth palette graded in OKLCH (perceptually even lightness; Dryv also writes the sRGB hex that
      // Flutter needs). Any CSS notation is accepted here: hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch().
      oat: token.color("oklch(1 0 0)"),
      cream: token.color("oklch(1 0 0)"),
      sand: token.color("oklch(0.968 0.004 85)"),
      ink: token.color("oklch(0.23 0.025 55)"),
      inkSoft: token.color("oklch(0.5 0.035 60)"),
      line: token.color("oklch(0.918 0.005 85)"),
      clay: token.color("oklch(0.585 0.152 41)"),
      calabash: token.color("oklch(0.735 0.138 76)"),
      raffia: token.color("oklch(0.545 0.095 130)"),
      indigo: token.color("oklch(0.43 0.085 250)"),
      lagoon: token.color("oklch(0.62 0.105 205)"),
      plum: token.color("oklch(0.47 0.125 345)"),
      danger: token.color("oklch(0.53 0.185 28)"),
      bark: token.color("oklch(0.285 0.02 55)"),
      barkLine: token.color("oklch(0.385 0.022 55)"),
      // Dark-mode text and sunken surfaces, graded for contrast on the bark surfaces.
      mist: token.color("oklch(0.8 0.025 75)"),
      deepBark: token.color("oklch(0.34 0.02 55)"),
      sky: token.color("oklch(0.78 0.1 230)"),
      skyDark: token.color("oklch(0.45 0.09 240)"),
      // Glass: translucent surfaces for cards, bars and sheets, with a bright rim (use with backdrop blur).
      glass: token.color("oklch(1 0 0 / 0.8)"),
      glassStrong: token.color("oklch(1 0 0 / 0.94)"),
      glassEdge: token.color("oklch(1 0 0 / 0.65)"),
      glassDark: token.color("oklch(0.3 0.02 55 / 0.55)"),
      glassStrongDark: token.color("oklch(0.27 0.02 55 / 0.82)"),
      glassEdgeDark: token.color("oklch(1 0 0 / 0.14)"),
      // Map and data ramps (low to high), used for choropleths and heat maps.
      rampLow: token.color("oklch(0.94 0.04 90)"),
      rampMid: token.color("oklch(0.72 0.14 60)"),
      rampHigh: token.color("oklch(0.45 0.16 30)"),

      // Shape.
      radiusSm: token.dimension(12),
      radius: token.dimension(20),
      radiusLg: token.dimension(30),
      radiusXl: token.dimension(42),
      blurGlass: token.dimension(18),

      // Type.
      fontDisplay: token.fontFamily("Iowan Old Style", "Palatino Linotype", "Palatino", "Book Antiqua", "Georgia", "serif"),
      fontBody: token.fontFamily(
        "ui-sans-serif",
        "-apple-system",
        "Segoe UI",
        "Inter",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ),
      fontMono: token.fontFamily("ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"),

      // Depth: the main layer of the www shadows (one layer per token).
      shadow: token.shadow({
        color: "oklch(0.3 0.04 55 / 0.22)",
        offset_x: { value: 0, unit: "px" },
        offset_y: { value: 8, unit: "px" },
        blur: { value: 24, unit: "px" },
        spread: { value: -12, unit: "px" },
      }),
      shadowLift: token.shadow({
        color: "oklch(0.3 0.04 55 / 0.34)",
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
      "content.muted": "inkSoft",
      "surface.sunken": "sand",
      "action.accent": "calabash",
      "status.success": "raffia",
      "surface.glass": "glass",
      "surface.glassStrong": "glassStrong",
      "border.glass": "glassEdge",
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
          "content.muted": "mist",
          "surface.sunken": "deepBark",
          "action.accent": "sky",
          "surface.glass": "glassDark",
          "surface.glassStrong": "glassStrongDark",
          "border.glass": "glassEdgeDark",
        },
        { color_scheme: "dark" },
      ),
    },
  ),
});
