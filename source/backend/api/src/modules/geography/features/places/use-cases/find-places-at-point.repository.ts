/**
 * No canonical persistence plan: the project implements this operation in
 * src/implementations/find-places-at-point.ts, exporting
 * `FindPlacesAtPointUseCase` with `execute(input: PointQueryDto): Promise<PlaceAtPointDto>`.
 */
export { FindPlacesAtPointUseCase } from "#/implementations/find-places-at-point";
