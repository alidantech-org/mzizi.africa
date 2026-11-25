/**
 * No canonical persistence plan: the project implements this operation in
 * src/implementations/get-institution-screen.ts, exporting
 * `GetInstitutionScreenUseCase` with `execute(input: InstitutionRequestDto): Promise<InstitutionScreenDto>`.
 */
export { GetInstitutionScreenUseCase } from "#/implementations/get-institution-screen";
