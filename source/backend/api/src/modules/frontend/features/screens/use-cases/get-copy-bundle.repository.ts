/**
 * No canonical persistence plan: the project implements this operation in
 * src/implementations/get-copy-bundle.ts, exporting
 * `GetCopyBundleUseCase` with `execute(input: CopyRequestDto): Promise<CopyBundleDto>`.
 */
export { GetCopyBundleUseCase } from "#/implementations/get-copy-bundle";
