import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { MemberEntryDto } from "#/modules/reference/schema/dto/member-entry.dto.ts";

/**
 * Member Collection
 */
export class MemberCollectionDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MemberEntryDto)
  values!: MemberEntryDto[];
}