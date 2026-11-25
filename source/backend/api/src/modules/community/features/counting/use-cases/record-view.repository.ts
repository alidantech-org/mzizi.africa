/**
 * No canonical persistence plan: the project implements this operation in
 * src/implementations/record-view.ts, exporting
 * `RecordViewUseCase` with `execute(input: { body: ViewInputDto;  }): Promise<RecordedDto>`.
 */
export { RecordViewUseCase } from "#/implementations/record-view";
