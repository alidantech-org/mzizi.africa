import { IsString, MaxLength, MinLength } from "class-validator";
import type { Ref } from "#/modules/interactions/schema/type/ref.type.ts";
import type { Table } from "#/modules/interactions/schema/type/table.type.ts";
import type { Visitor } from "#/modules/interactions/schema/type/visitor.type.ts";

/**
 * View Input
 */
export class ViewInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subjectRef!: Ref;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  subjectTable!: Table;

  @IsString()
  @MinLength(1)
  @MaxLength(600)
  visitor!: Visitor;
}
