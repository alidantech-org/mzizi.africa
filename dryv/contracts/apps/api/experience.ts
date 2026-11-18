/**
 * Experience: the reads that make the product contextual. Context (country, language, place, how it was decided), the
 * calendar with the countdown to the next election, civic infrastructure (offices, schools, hospitals, polling stations,
 * roads) and fun facts. Every section is a named, typed schema: nothing here is open JSON, so every client reads the same
 * shapes, and every document says what is missing (`gaps`).
 *
 * Context is a backend concept. The country comes from the caller's choice, then the CDN country header (trusted only when
 * the deployment says it sits behind the edge, with a development override), then the first served country; the place comes
 * from the clean address path resolved through the slug registry. No client names a country, a level or a currency.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { apiHttp } from "./_shared.ts";

export const experience = dryv
  .group({ name: "experience" })
  .description("Context, calendar, infrastructure and fun facts composed for screens.");
const reads = experience.feature("Experience").failureDefaults(apiHttp);

const props = experience.properties({
  Code: dryv.property.string().length({ min: 1, max: 200 }),
  Path: dryv.property.string().length({ min: 1, max: 1000 }),
  Language: dryv.property.string().length({ min: 2, max: 35 }),
  Limit: dryv.property.number.integer({ range: { min: 1, max: 500 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
});

const leaf = experience.schemas({
  /** A place as the address and the breadcrumbs know it. */
  PlaceRef: dryv.schema({
    featureId: dryv.field(p.Id),
    name: dryv.field(p.Name),
    kindCode: dryv.field(p.NonEmptyString100),
    kindLabel: dryv.field(p.Name),
    /** The clean address path of the place, for example `nairobi/westlands`. */
    path: dryv.field(p.NonEmptyString1000),
  }),
  ContextCountry: dryv.schema({
    code: dryv.field(p.NonEmptyString100),
    isoCode: dryv.field(p.NonEmptyString100).maybe(),
    name: dryv.field(p.Name),
    currencyCode: dryv.field(p.NonEmptyString100).maybe(),
    defaultLanguageCode: dryv.field(p.NonEmptyString100).maybe(),
    subdomain: dryv.field(p.NonEmptyString100).maybe(),
    isServed: dryv.field(p.Flag),
  }),
  ContextLevel: dryv.schema({
    depth: dryv.field(p.NonNegativeInteger),
    kindCode: dryv.field(p.NonEmptyString100),
    kindLabel: dryv.field(p.Name),
    isRouting: dryv.field(p.Flag),
  }),
  CountryChoice: dryv.schema({
    code: dryv.field(p.NonEmptyString100),
    name: dryv.field(p.Name),
    isServed: dryv.field(p.Flag),
  }),
  /** One scheduled thing in the calendar, with how we know the date and whether it moved. */
  CalendarEvent: dryv.schema({
    occurrenceCode: dryv.field(p.NonEmptyString255),
    eventCode: dryv.field(p.NonEmptyString255),
    name: dryv.field(p.Name),
    kindCode: dryv.field(p.NonEmptyString100),
    kindLabel: dryv.field(p.Name),
    plannedOn: dryv.field(p.CalendarDate),
    actualOn: dryv.field(p.CalendarDate).maybe(),
    statusCode: dryv.field(p.NonEmptyString100),
    statusLabel: dryv.field(p.Name),
    knowledgeCode: dryv.field(p.NonEmptyString100),
    knowledgeLabel: dryv.field(p.Name),
    changeReason: dryv.field(p.Name).maybe(),
    changeNote: dryv.field(p.Description).maybe(),
    venueCount: dryv.field(p.NonNegativeInteger),
    daysAway: dryv.field(p.Integer),
  }),
  CountdownMilestone: dryv.schema({
    name: dryv.field(p.Name),
    plannedOn: dryv.field(p.CalendarDate),
    daysAway: dryv.field(p.Integer),
    offsetDays: dryv.field(p.Integer).maybe(),
  }),
  /** How a recurring date is produced, so a screen can say why the date is what it is. */
  RecurrenceRule: dryv.schema({
    kindCode: dryv.field(p.NonEmptyString100),
    month: dryv.field(p.PositiveInteger).maybe(),
    dayOfMonth: dryv.field(p.PositiveInteger).maybe(),
    weekday: dryv.field(p.PositiveInteger).maybe(),
    nthWeekday: dryv.field(p.PositiveInteger).maybe(),
    intervalYears: dryv.field(p.PositiveInteger).maybe(),
    rrule: dryv.field(p.NonEmptyString500).maybe(),
  }),
  ClassCount: dryv.schema({
    code: dryv.field(p.NonEmptyString100),
    label: dryv.field(p.Name),
    parentCode: dryv.field(p.NonEmptyString100).maybe(),
    count: dryv.field(p.NonNegativeInteger),
  }),
  Capacity: dryv.schema({
    indicatorCode: dryv.field(p.NonEmptyString255),
    label: dryv.field(p.Name),
    value: dryv.field(p.Number),
  }),
  HostedStation: dryv.schema({
    stationName: dryv.field(p.Name),
    electionCode: dryv.field(p.NonEmptyString255),
    electionYear: dryv.field(p.Integer),
    statusLabel: dryv.field(p.Name),
    registeredVoters: dryv.field(p.NonNegativeInteger).maybe(),
    streamCount: dryv.field(p.NonNegativeInteger).maybe(),
    ballotsCast: dryv.field(p.NonNegativeInteger).maybe(),
  }),
  FactRow: dryv.schema({
    code: dryv.field(p.NonEmptyString255),
    statement: dryv.field(p.Name),
    detail: dryv.field(p.Description).maybe(),
    place: dryv.field(p.Name).maybe(),
    tagged: dryv.field(p.Flag),
  }),
});

const shapes2 = experience.schemas({
  Countdown: dryv.schema({
    eventCode: dryv.field(p.NonEmptyString255),
    name: dryv.field(p.Name),
    plannedOn: dryv.field(p.CalendarDate),
    daysAway: dryv.field(p.Integer),
    knowledgeCode: dryv.field(p.NonEmptyString100),
    knowledgeLabel: dryv.field(p.Name),
    rule: dryv.field(leaf.RecurrenceRule).maybe(),
    milestones: dryv.field(leaf.CountdownMilestone).array(),
  }),
  FacilityRow: dryv.schema({
    code: dryv.field(p.NonEmptyString255),
    name: dryv.field(p.Name),
    classCode: dryv.field(p.NonEmptyString100),
    classLabel: dryv.field(p.Name),
    domainCode: dryv.field(p.NonEmptyString100),
    domainLabel: dryv.field(p.Name),
    operator: dryv.field(p.Name).maybe(),
    ownershipLabel: dryv.field(p.Name).maybe(),
    statusLabel: dryv.field(p.Name),
    featureId: dryv.field(p.Id),
    placeName: dryv.field(p.Name).maybe(),
    placePath: dryv.field(p.NonEmptyString1000).maybe(),
    latitude: dryv.field(p.Number).maybe(),
    longitude: dryv.field(p.Number).maybe(),
    capacity: dryv.field(leaf.Capacity).array(),
  }),
});

const shapes = { ...leaf, ...shapes2 };

const documents = experience.schemas({
  Context: dryv.schema({
    country: dryv.field(shapes.ContextCountry),
    /** How the country was decided: selection, cdn_header, development_override or default. */
    countrySource: dryv.field(p.NonEmptyString100),
    countries: dryv.field(shapes.CountryChoice).array(),
    languageCode: dryv.field(p.NonEmptyString100),
    place: dryv.field(shapes.PlaceRef).maybe(),
    chain: dryv.field(shapes.PlaceRef).array(),
    /** The address segments left after the place was resolved: the section path. */
    rest: dryv.field(p.NonEmptyString255).array(),
    levels: dryv.field(shapes.ContextLevel).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  Calendar: dryv.schema({
    from: dryv.field(p.CalendarDate),
    to: dryv.field(p.CalendarDate),
    events: dryv.field(shapes.CalendarEvent).array(),
    next: dryv.field(shapes.Countdown).maybe(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  FacilityList: dryv.schema({
    total: dryv.field(p.NonNegativeInteger),
    facilities: dryv.field(shapes.FacilityRow).array(),
    classes: dryv.field(shapes.ClassCount).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  FacilityDetail: dryv.schema({
    facility: dryv.field(shapes.FacilityRow),
    chain: dryv.field(shapes.PlaceRef).array(),
    stations: dryv.field(shapes.HostedStation).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  FactList: dryv.schema({
    facts: dryv.field(shapes.FactRow).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
});

const inputs = experience.schemas({
  ContextInput: dryv.schema({
    countryCode: dryv.field(props.Code).optional(),
    languageCode: dryv.field(props.Language).optional(),
    path: dryv.field(props.Path).optional(),
    /** A place by identity instead of by path, for a switcher that already holds a search hit. */
    featureId: dryv.field(p.Id).optional(),
    /** The CDN's country header; trusted only when the deployment sits behind the edge. */
    edgeCountry: dryv.field(props.Code).optional(),
  }),
  CalendarInput: dryv.schema({
    from: dryv.field(p.CalendarDate).optional(),
    to: dryv.field(p.CalendarDate).optional(),
    kindCode: dryv.field(props.Code).optional(),
    featureId: dryv.field(p.Id).optional(),
    languageCode: dryv.field(props.Language).optional(),
  }),
  FacilitiesInput: dryv.schema({
    classCode: dryv.field(props.Code).optional(),
    featureId: dryv.field(p.Id).optional(),
    query: dryv.field(props.Code).optional(),
    languageCode: dryv.field(props.Language).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  FacilityKey: dryv.schema({ code: dryv.field(props.Code), languageCode: dryv.field(props.Language).optional() }),
  FactsInput: dryv.schema({ featureId: dryv.field(p.Id).optional(), limit: dryv.field(props.Limit).optional() }),
});

export const experienceOperations = reads.operations({
  GetContext: dryv
    .operation()
    .role("detail")
    .description(
      "Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.",
    )
    .input(inputs.ContextInput)
    .output(documents.Context)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/context")
        .input(inputField("countryCode"), dryv.query("countryCode"))
        .input(inputField("languageCode"), dryv.query("languageCode"))
        .input(inputField("path"), dryv.query("path"))
        .input(inputField("featureId"), dryv.query("featureId"))
        .input(inputField("edgeCountry"), dryv.header("cf-ipcountry"))
        .output(output),
    })),

  GetCalendar: dryv
    .operation()
    .role("list")
    .description(
      "Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.",
    )
    .input(inputs.CalendarInput)
    .output(documents.Calendar)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/calendar").input(input, dryv.queryObject()).output(output),
    })),

  ListFacilities: dryv
    .operation()
    .role("search")
    .description(
      "Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.",
    )
    .input(inputs.FacilitiesInput)
    .output(documents.FacilityList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/facilities").input(input, dryv.queryObject()).output(output),
    })),

  GetFacility: dryv
    .operation()
    .role("detail")
    .description("One facility with its capacity, the places it is in and the polling stations it hosts.")
    .input(inputs.FacilityKey)
    .output(documents.FacilityDetail)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/facilities/{code}")
        .input(inputField("code"), dryv.path())
        .input(inputField("languageCode"), dryv.query("languageCode"))
        .output(output),
    })),

  ListFacts: dryv
    .operation()
    .role("list")
    .description("Fun facts for the country and, with a place, for it and the places above it.")
    .input(inputs.FactsInput)
    .output(documents.FactList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/facts").input(input, dryv.queryObject()).output(output),
    })),
});
