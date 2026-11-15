/**
 * Auth: who the caller is, and (for administrators) who else exists.
 *
 * Policies are deliberately simple stubs. A policy names an access rule and the trusted values it
 * provides (here the caller's account id). Dryv wires the guard; the project decides how the rule holds.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Accounts, auth, authEnums } from "#/schemas/postgres/auth.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

export const authPolicies = auth.policies({
  /** Any signed-in account. Provides the caller's account id. */
  SignedIn: dryv.policy().provides({ accountId: p.Id }),
  /** Platform administrators only. */
  PlatformAdmin: dryv.policy().provides({ accountId: p.Id }),
});

const accounts = auth.feature("Accounts").failureDefaults(apiHttp);
const account = Accounts.asRef();

/**
 * Filters plus the shared page window. The status filter reuses the stored property; a projection cannot
 * be extended by the window (a Dryv limit, see the issues list), so this one input is declared, not projected.
 */
const AccountWindow = auth
  .schema("AccountWindow", { status: dryv.field(authEnums.AccountStatus).optional() })
  .extends(PageWindow)
  .asRef();

const { OwnAccount, ScanAccounts } = accounts.queries({
  OwnAccount: dryv.readQuery
    .from(account)
    .params({ accountId: p.Id })
    .where((row, args) => [row.fields.id.eq(args.accountId)])
    .select(({ fields }) => ({
      id: fields.id,
      displayName: fields.displayName,
      actorKind: fields.actorKind,
      status: fields.status,
      lastAuthenticatedAt: fields.lastAuthenticatedAt,
    }))
    .zeroOrOne(),
  ScanAccounts: dryv.readQuery
    .from(account)
    .input(AccountWindow)
    .where((row, args) => [row.fields.status.eq(args.status)])
    .select(({ fields }) => ({
      id: fields.id,
      displayName: fields.displayName,
      actorKind: fields.actorKind,
      status: fields.status,
    }))
    .orderBy(({ fields }) => [fields.displayName.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});

/** Result shapes come from the queries themselves: Dryv requires a query-bound output to be query-derived. */
const rows = accounts.schemas({
  AccountRead: dryv.schema.fromQuery(OwnAccount),
  AccountSummary: dryv.schema.fromQuery(ScanAccounts),
});
const io = accounts.schemas({
  AccountCollection: dryv.schema({ accounts: dryv.field(rows.AccountSummary).array() }),
});

export const authOperations = accounts.operations({
  /** The account is the trusted `accountId` the SignedIn policy provides, never a client value. */
  GetMyAccount: dryv
    .operation()
    .role("detail")
    .description("The signed-in person's own account.")
    .output(rows.AccountRead)
    .authenticated()
    .requires(authPolicies.SignedIn)
    .query(OwnAccount, () => ({
      parameters: { accountId: { policy: authPolicies.SignedIn, name: "accountId" } },
      missing: f.NotFound,
    }))
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/account").output(output) })),

  ListAccounts: dryv
    .operation()
    .role("list")
    .description("Page through accounts, optionally by status. Administrators only.")
    .input(AccountWindow)
    .output(io.AccountCollection)
    .authenticated()
    .requires(authPolicies.PlatformAdmin)
    .queryFromInput(ScanAccounts, { envelope: { accounts: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/admin/accounts").input(input, dryv.queryObject()).output(output),
    })),
});
