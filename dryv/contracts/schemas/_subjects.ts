import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";

/**
 * The closed set of tables a generic single-subject association may point at, spelled exactly as the fully qualified
 * SQL table name. Every table here has a UUID primary key. The `audit` and `auth` schemas are operational, not subjects.
 * `dryv/tools/check-subject-tables.ts` fails when this list and the generated schema disagree.
 */
export const subjectProperties = shared.properties({
  SubjectTable: dryv.property.enum({
    CivicBids: "civic.bids",
    CivicContracts: "civic.contracts",
    CivicDeliveries: "civic.deliveries",
    CivicProcurements: "civic.procurements",
    CivicProjectFeatures: "civic.project_features",
    CivicProjects: "civic.projects",
    CivicServices: "civic.services",
    FilesystemFileExtensions: "filesystem.file_extensions",
    FilesystemFileVersions: "filesystem.file_versions",
    FilesystemFiles: "filesystem.files",
    FilesystemFolders: "filesystem.folders",
    FilesystemMedia: "filesystem.media",
    FilesystemTaggings: "filesystem.taggings",
    FilesystemTags: "filesystem.tags",
    FinanceAppropriations: "finance.appropriations",
    FinanceBudgetVersions: "finance.budget_versions",
    FinanceBudgets: "finance.budgets",
    FinanceDebts: "finance.debts",
    FinanceFiscalPeriods: "finance.fiscal_periods",
    FinanceFlows: "finance.flows",
    FinanceFunds: "finance.funds",
    GeographyAssets: "geography.assets",
    GeographyChanges: "geography.changes",
    GeographyClassifications: "geography.classifications",
    GeographyFeatures: "geography.features",
    GeographyGeometries: "geography.geometries",
    GeographyIdentifiers: "geography.identifiers",
    GeographyNames: "geography.names",
    GeographyRelationships: "geography.relationships",
    GovernanceAuthorityScopes: "governance.authority_scopes",
    GovernanceHolders: "governance.holders",
    GovernanceInstitutions: "governance.institutions",
    GovernanceMandates: "governance.mandates",
    GovernanceOffices: "governance.offices",
    GovernanceRelationships: "governance.relationships",
    LegalEditions: "legal.editions",
    LegalEffects: "legal.effects",
    LegalInstruments: "legal.instruments",
    LegalNames: "legal.names",
    LegalProvisions: "legal.provisions",
    LegalReferences: "legal.references",
    LegalRelationships: "legal.relationships",
    LegalTranslations: "legal.translations",
    LegalWordings: "legal.wordings",
    OfficialBranding: "official.branding",
    OfficialContacts: "official.contacts",
    OfficialEntities: "official.entities",
    OfficialIdentifiers: "official.identifiers",
    OfficialIndividuals: "official.individuals",
    OfficialNames: "official.names",
    OfficialRelationships: "official.relationships",
    PoliticsAlignments: "politics.alignments",
    PoliticsCandidates: "politics.candidates",
    PoliticsCoalitions: "politics.coalitions",
    PoliticsContests: "politics.contests",
    PoliticsElections: "politics.elections",
    PoliticsElectorates: "politics.electorates",
    PoliticsManifestoItems: "politics.manifesto_items",
    PoliticsManifestos: "politics.manifestos",
    PoliticsMemberships: "politics.memberships",
    PoliticsOptionResults: "politics.option_results",
    PoliticsParties: "politics.parties",
    PoliticsReferendumOptions: "politics.referendum_options",
    PoliticsResults: "politics.results",
    ReferenceCountries: "reference.countries",
    ReferenceLanguageNames: "reference.language_names",
    ReferenceLanguages: "reference.languages",
    ReferencePatterns: "reference.patterns",
    ReferenceSchemes: "reference.schemes",
    ReferenceTopics: "reference.topics",
    ReferenceUnits: "reference.units",
    ReferenceValueLabels: "reference.value_labels",
    ReferenceValueRelations: "reference.value_relations",
    ReferenceValues: "reference.values",
    SourceAddresses: "source.addresses",
    SourceArtifacts: "source.artifacts",
    SourceAttributions: "source.attributions",
    SourceCaptures: "source.captures",
    SourceCitations: "source.citations",
    SourceDiscoveries: "source.discoveries",
    SourceDomains: "source.domains",
    SourceEditions: "source.editions",
    SourceProducts: "source.products",
    SourcePublishers: "source.publishers",
    SourceRelationships: "source.relationships",
    SourceSources: "source.sources",
    SourceVerifications: "source.verifications",
  }),
});

/** The only fields a subject reference contributes. Every base that carries a subject spreads exactly these. */
export const subjectFields = {
  subjectTable: dryv.field(subjectProperties.SubjectTable),
  subjectId: dryv.field(sharedProperties.Id),
};

/** Standalone base for a record that is nothing but a subject reference. Bases that also need identity fields spread `subjectFields`. */
const SubjectReferenceBase = dryv
  .schema({ ...subjectFields })
  .abstract()
  .description("Base for a record about one subject: the subject's fully qualified table and its row id. Contributes no other fields.");

export const subjectSchemas = shared.schemas({ SubjectReference: SubjectReferenceBase });
