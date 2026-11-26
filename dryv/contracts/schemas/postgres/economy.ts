/**
 * Schema: economy | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 33 (approved 2026-11-25).
 * Contract authors: "goods" includes services and works (`kind` says which). Goods are not identities: their names are
 * `economy.names`, read with the same language-choosing function as `identity.names`. `prices` is hash-partitioned by
 * `country_id`. Comparisons are like with like only: each specification is its own leaf good.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, term } from "./_links.ts";
import { measureProperties } from "./_measures.ts";
import { Features } from "./geography.ts";
import { Countries, Currencies, Languages, Units } from "./reference.ts";
import { Collections } from "./statistics.ts";

export const economy = dryv
  .group({ name: "economy" })
  .description("Goods, services and works, their names and classification codes, compositions, prices, baskets and weights.")
  .facets({ storage: { namespace: "economy", store: "main" } });

const economyProperties = economy.properties({
  GoodKind: dryv.property.enum({ Good: "good", Service: "service", Works: "works" }),
  GoodStatus: dryv.property.enum({ Active: "active", Retired: "retired" }),
  NameKind: dryv.property.enum({ Preferred: "preferred", Plural: "plural", Short: "short", Alternative: "alternative" }),
  CrosswalkKind: dryv.property.enum({ Exact: "exact", Partial: "partial" }),
  ClassCode: dryv.property.string().length({ min: 1, max: 50 }),
  Weight: dryv.property.number().range({ min: 0 }),
});

/*---------------- economy.goods ----------------*/
export const Goods = economy
  .schema("Goods", {
    kind: dryv.field(economyProperties.GoodKind).description("good, service or works."),
    parentId: belongsTo(dryv.self).maybe().description("The broader good (cement above cement 50 kg bag)."),
    unitId: belongsTo(() => Units)
      .maybe()
      .description("The unit the good is priced in."),
    size: dryv.field(sharedProperties.Number).maybe().description("Pack size (50 for a 50 kg bag), in `size_unit_id`."),
    sizeUnitId: belongsTo(() => Units).maybe(),
    standardTerm: term("eco.standard", "The specification or grade it meets (a national standard).").maybe(),
    status: dryv.field(economyProperties.GoodStatus),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("GoodIsNotItsOwnParent", rule.differs("id", "parentId"))
  .rule("SizeHasUnit", (v) => v.size.isNull().or(v.sizeUnitId.isNotNull()))
  .description('The catalogue of goods, services and works ("Cement, 50 kg bag, grade 42.5N").')
  .role("entity")
  .facets({ storage: dryv.storage("goods").index("parentId").acyclic("GoodParentsHaveNoCycle", { field: "parentId" }) });

/*---------------- economy.names ----------------*/
export const GoodNames = economy
  .schema("Names", {
    goodId: belongsTo(() => Goods, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    text: dryv.field(sharedProperties.NonEmptyString1000),
    kind: dryv.field(economyProperties.NameKind),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set for a local name used in one country."),
  })
  .extends(baseSchemas.Entity)
  .description("Names of a good in any language.")
  .role("entity")
  .facets({ storage: dryv.storage("names").index("goodId", "languageId").index("text") });

/*---------------- economy.codes ----------------*/
export const GoodCodes = economy
  .schema("Codes", {
    goodId: belongsTo(() => Goods, { onDelete: "cascade" }),
    schemeTerm: term("eco.classification", "CPC, COICOP, UNSPSC or HS."),
    value: dryv.field(economyProperties.ClassCode),
  })
  .extends(baseSchemas.Association)
  .description("A good's code in an international classification; CPC is the pivot.")
  .role("entity")
  .facets({ storage: dryv.storage("codes").unique("goodId", "schemeTerm", "value").index("schemeTerm", "value") });

/*---------------- economy.crosswalks ----------------*/
export const Crosswalks = economy
  .schema("Crosswalks", {
    fromSchemeTerm: term("eco.classification", "Classification of `from_value`."),
    fromValue: dryv.field(economyProperties.ClassCode),
    toSchemeTerm: term("eco.classification", "Classification of `to_value`."),
    toValue: dryv.field(economyProperties.ClassCode),
    kind: dryv
      .field(economyProperties.CrosswalkKind)
      .description("exact or partial; a partial match is used only with a warning."),
  })
  .extends(baseSchemas.Association)
  .description("Official correspondence tables between classifications (UN CPC to COICOP, HS).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("crosswalks")
      .unique("fromSchemeTerm", "fromValue", "toSchemeTerm", "toValue")
      .index("toSchemeTerm", "toValue"),
  });

/*---------------- economy.compositions ----------------*/
export const Compositions = economy
  .schema("Compositions", {
    goodId: belongsTo(() => Goods, { onDelete: "cascade" }).description("The works item."),
    inputId: belongsTo(() => Goods).description("One input (cement, sand, labour days)."),
    quantity: dryv.field(sharedProperties.Number),
    unitId: belongsTo(() => Units),
  })
  .extends(baseSchemas.Entity)
  .rule("CompositionIsNotItself", rule.differs("goodId", "inputId"))
  .description("What a works item is made of: a bill of quantities.")
  .role("entity")
  .facets({ storage: dryv.storage("compositions").unique("goodId", "inputId").index("inputId") });

/*---------------- economy.prices ----------------*/
export const Prices = economy
  .schema("Prices", {
    goodId: belongsTo(() => Goods),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The place the price was observed for."),
    countryId: belongsTo(() => Countries).description("Partition key."),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    kindTerm: term("eco.price.kind", "retail, wholesale, farm-gate, standard cost, contract, modelled."),
    amount: dryv
      .field(sharedProperties.AmountMinorUnits)
      .maybe()
      .description("Price in whole minor units of `currency_id`."),
    currencyId: belongsTo(() => Currencies),
    status: dryv.field(measureProperties.FigureStatus),
    basis: dryv.field(measureProperties.FigureBasis),
    collectionId: belongsTo(() => Collections).maybe(),
    revision: dryv.field(sharedProperties.PositiveInteger),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("PricePeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("PriceDatesAreOrdered", dryv.rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("One observed, reference or modelled price of a good at a place and time.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("prices")
      .partitioning(byCountry("prices"))
      .primaryKey("id", "countryId")
      .index("countryId", "goodId", "fromYear")
      .index("countryId", "featureId")
      .index("collectionId")
      .references("PriceSupersedes", {
        fields: ["supersedesId", "countryId"],
        target: () => Prices,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- economy.baskets ----------------*/
export const Baskets = economy
  .schema("Baskets", {
    countryId: belongsTo(() => Countries),
    ...periodFields,
    collectionId: belongsTo(() => Collections).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A set of goods with weights (a CPI basket).")
  .role("entity")
  .facets({ storage: dryv.storage("baskets").index("countryId") });

/*---------------- economy.weights ----------------*/
export const Weights = economy
  .schema("Weights", {
    basketId: belongsTo(() => Baskets, { onDelete: "cascade" }),
    goodId: belongsTo(() => Goods),
    weight: dryv.field(economyProperties.Weight),
  })
  .extends(baseSchemas.Association)
  .description("A good's weight in a basket.")
  .role("entity")
  .facets({ storage: dryv.storage("weights").unique("basketId", "goodId").index("goodId") });
