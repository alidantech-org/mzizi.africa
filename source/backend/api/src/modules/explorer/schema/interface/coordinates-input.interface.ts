import type { Accuracy } from "#/modules/explorer/schema/type/accuracy.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Latitude } from "#/modules/explorer/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/explorer/schema/type/longitude.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/** Coordinates Input */
export interface CoordinatesInput {
  accuracyMeters?: Accuracy;
  countryCode?: IsoAlpha2;
  languageCode?: LanguageCode;
  latitude: Latitude;
  longitude: Longitude;
}
