import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ArticleLinkDto } from "#/modules/frontend/schema/dto/article-link.dto.ts";
import { CountryLinkDto } from "#/modules/frontend/schema/dto/country-link.dto.ts";
import { EventLinkDto } from "#/modules/frontend/schema/dto/event-link.dto.ts";
import { FigureDto } from "#/modules/frontend/schema/dto/figure.dto.ts";
import { LanguageOptionDto } from "#/modules/frontend/schema/dto/language-option.dto.ts";
import { LeaderDto } from "#/modules/frontend/schema/dto/leader.dto.ts";
import { PlaceLinkDto } from "#/modules/frontend/schema/dto/place-link.dto.ts";
import { ProjectLinkDto } from "#/modules/frontend/schema/dto/project-link.dto.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Place Screen
 */
export class PlaceScreenDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ArticleLinkDto)
  articles!: ArticleLinkDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceLinkDto)
  breadcrumb!: PlaceLinkDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceLinkDto)
  children!: PlaceLinkDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => CountryLinkDto)
  country!: CountryLinkDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EventLinkDto)
  events!: EventLinkDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FigureDto)
  figures!: FigureDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageOptionDto)
  languages!: LanguageOptionDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderDto)
  leaders!: LeaderDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceLinkDto)
  place!: PlaceLinkDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectLinkDto)
  projects!: ProjectLinkDto[];
}
