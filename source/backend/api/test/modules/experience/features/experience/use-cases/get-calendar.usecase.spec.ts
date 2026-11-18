import { describe, expect, it } from "vitest";

import { GetCalendarUseCase } from "#/modules/experience/features/experience/use-cases/get-calendar.usecase";

/**
 * Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCalendarUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCalendarUseCase>;
    expect(new GetCalendarUseCase(...args)).toBeInstanceOf(GetCalendarUseCase);
  });

  it.todo(
    "Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.",
  );
});
