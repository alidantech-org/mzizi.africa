import { Injectable } from '@nestjs/common';
import type { ClassificationRecordListQueryDto } from '#/modules/reference/dto/classification-record-list-query.dto';
import type { ClassificationRecordResponseDto } from '#/modules/reference/dto/classification-record-response.dto';
import type { ClassificationRecordsListResponseDto } from '#/modules/reference/dto/classification-records-list-response.dto';
import type { JurisdictionListQueryDto } from '#/modules/reference/dto/jurisdiction-list-query.dto';
import type { JurisdictionResponseDto } from '#/modules/reference/dto/jurisdiction-response.dto';
import type { JurisdictionsListResponseDto } from '#/modules/reference/dto/jurisdictions-list-response.dto';
import { FindClassificationRecordsUseCase } from '#/modules/reference/reference-read/use-cases/find-classification-records.usecase';
import { FindJurisdictionsUseCase } from '#/modules/reference/reference-read/use-cases/find-jurisdictions.usecase';
import { GetClassificationRecordByIdUseCase } from '#/modules/reference/reference-read/use-cases/get-classification-record-by-id.usecase';
import { GetJurisdictionByIdUseCase } from '#/modules/reference/reference-read/use-cases/get-jurisdiction-by-id.usecase';

/**
 * Reference Read: implements the generated ReferenceReferenceReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class ReferenceReferenceReadServiceImpl {
  constructor(
    private readonly findClassificationRecordsUseCase: FindClassificationRecordsUseCase,
    private readonly findJurisdictionsUseCase: FindJurisdictionsUseCase,
    private readonly getClassificationRecordByIdUseCase: GetClassificationRecordByIdUseCase,
    private readonly getJurisdictionByIdUseCase: GetJurisdictionByIdUseCase,
  ) {}

  /** List classification records. */
  findClassificationRecords(input: ClassificationRecordListQueryDto) {
    return this.findClassificationRecordsUseCase.execute(input);
  }

  /** List jurisdictions. */
  findJurisdictions(input: JurisdictionListQueryDto) {
    return this.findJurisdictionsUseCase.execute(input);
  }

  /** Get classification records by id. */
  getClassificationRecordById(input: { recordId: string }) {
    return this.getClassificationRecordByIdUseCase.execute(input);
  }

  /** Get jurisdictions by id. */
  getJurisdictionById(input: { jurisdictionId: string }) {
    return this.getJurisdictionByIdUseCase.execute(input);
  }
}