import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/ledger_endpoints.dart';
import 'package:mzizi_api/src/models/ledger/budget_list.dart';
import 'package:mzizi_api/src/models/ledger/coalition_list.dart';
import 'package:mzizi_api/src/models/ledger/coverage_list.dart';
import 'package:mzizi_api/src/models/ledger/fund_list.dart';
import 'package:mzizi_api/src/models/ledger/ledger_input.dart';
import 'package:mzizi_api/src/models/ledger/manifesto_list.dart';

/// Typed client for the Ledger group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class LedgerFeature {
  const LedgerFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = LedgerEndpoints();

  /// What the platform expects to be published and what has been checked: the honest map of what is missing.
  ///
  /// GET /v1/coverage
  Future<ApiResult<LedgerCoverageList>> getCoverage({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LedgerCoverageList>(
        endpoint: _routes.getCoverage,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'ledger.getCoverage'),
        fromJson: (json) => LedgerCoverageList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Budgets by fiscal year with their revisions, newest first.
  ///
  /// GET /v1/budgets
  Future<ApiResult<LedgerBudgetList>> listBudgets({LedgerLedgerInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LedgerBudgetList>(
        endpoint: _routes.listBudgets,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'ledger.listBudgets'),
        query: input?.toJson(),
        fromJson: (json) => LedgerBudgetList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Coalitions of parties.
  ///
  /// GET /v1/coalitions
  Future<ApiResult<LedgerCoalitionList>> listCoalitions({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LedgerCoalitionList>(
        endpoint: _routes.listCoalitions,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'ledger.listCoalitions'),
        fromJson: (json) => LedgerCoalitionList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Funds with who manages them, where they apply and how many money flows are recorded.
  ///
  /// GET /v1/funds
  Future<ApiResult<LedgerFundList>> listFunds({LedgerLedgerInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LedgerFundList>(
        endpoint: _routes.listFunds,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'ledger.listFunds'),
        query: input?.toJson(),
        fromJson: (json) => LedgerFundList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Party and candidate manifestos by election.
  ///
  /// GET /v1/manifestos
  Future<ApiResult<LedgerManifestoList>> listManifestos({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LedgerManifestoList>(
        endpoint: _routes.listManifestos,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'ledger.listManifestos'),
        fromJson: (json) => LedgerManifestoList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
