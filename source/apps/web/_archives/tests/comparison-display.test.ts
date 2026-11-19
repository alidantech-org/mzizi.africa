/// <reference types="bun-types" />
/** Percentage scale and zero-baseline regressions discovered through live browser comparisons. */
import { expect, test } from "bun:test";
import { comparisonDifference } from "#/_archives/lib/site/governance/comparison-display";

test("renders API percentages directly rather than multiplying them by one hundred", () => {
  expect(
    comparisonDifference({ a: 86698, b: 17509, diffPercent: 395.2 }, "Peer")
      .value,
  ).toBe("+395.2%");
  expect(
    comparisonDifference({ a: 14168.9, b: 12250.9, diffPercent: 15.7 }, "Peer")
      .value,
  ).toBe("+15.7%");
  expect(
    comparisonDifference({ a: 1, b: 2, diffPercent: -50 }, "Peer").value,
  ).toBe("-50.0%");
  expect(
    comparisonDifference({ a: 2, b: 2, diffPercent: 0 }, "Peer").value,
  ).toBe("0.0%");
});

test("distinguishes a zero baseline from missing measurements", () => {
  expect(
    comparisonDifference({ a: 0, b: 0, diffPercent: null }, "Peer"),
  ).toEqual({
    value: "Not defined",
    note: "Relative percent is undefined when the baseline is zero",
  });
  expect(
    comparisonDifference({ a: 5, b: 0, diffPercent: null }, "Peer").note,
  ).toContain("baseline is zero");
  expect(
    comparisonDifference({ a: null, b: 0, diffPercent: null }, "Peer").note,
  ).toBe("Both figures are needed");
});
