/** Current governance reads: exact dates take priority; unknown year-only ends remain possible through that year. */
type GovernedAlias = "h" | "o" | "i" | "p" | "s" | "m";
type StartColumn = "took_office_on" | "created_on" | "established_on" | "starts_on";
type EndColumn = "left_office_on" | "abolished_on" | "dissolved_on" | "ends_on";

function currentPeriod(alias: GovernedAlias, start: StartColumn, end: EndColumn): string {
  return `${alias}.deleted_at is null
    and (case when ${alias}.${start} is not null then ${alias}.${start} <= current_date
      else ${alias}.from_year is null or ${alias}.from_year <= extract(year from current_date) end)
    and (case when ${alias}.${end} is not null then ${alias}.${end} > current_date
      else ${alias}.to_year is null or ${alias}.to_year >= extract(year from current_date) end)`;
}

export const activeInstitution = (alias: "i" | "p" | "s" | "o" = "i"): string => currentPeriod(alias, "established_on", "dissolved_on");
export const activeOffice = (alias: "o" = "o"): string => currentPeriod(alias, "created_on", "abolished_on");
export const activeHolder = (alias: "h" = "h"): string => currentPeriod(alias, "took_office_on", "left_office_on");
export const activeMandate = (alias: "m" = "m"): string => currentPeriod(alias, "starts_on", "ends_on");

/** Use only after joining h -> o -> i. Shared by rows, counts and ranking cohorts. */
export const activeGovernance = (): string => `${activeHolder()} and ${activeOffice()} and ${activeInstitution()}`;
