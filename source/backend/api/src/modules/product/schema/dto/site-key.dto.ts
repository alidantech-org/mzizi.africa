import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import type { Host } from "#/modules/product/schema/type/host.type.ts";

/**
 * Site Key
 */
export class SiteKeyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(253)
  @Matches(new RegExp("^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$"))
  host!: Host;
}
