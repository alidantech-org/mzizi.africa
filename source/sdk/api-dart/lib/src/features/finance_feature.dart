import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/finance_endpoints.dart';
import 'package:mzizi_api/src/models/finance/appropriation_collection.dart';
import 'package:mzizi_api/src/models/finance/budget_collection.dart';
import 'package:mzizi_api/src/models/finance/finding_collection.dart';
import 'package:mzizi_api/src/models/finance/government_budgets.dart';
import 'package:mzizi_api/src/models/finance/institution_findings.dart';
import 'package:mzizi_api/src/models/finance/revision_lines.dart';

/// Typed client for the Finance group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class FinanceFeature {
  const FinanceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = FinanceEndpoints();

  /// The lines of one budget revision, in code order (the tree is given by parent ids).
  ///
  /// GET /v1/finance/appropriations
  Future<ApiResult<FinanceAppropriationCollection>> listAppropriations({FinanceRevisionLines? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FinanceAppropriationCollection>(
        endpoint: _routes.listAppropriations,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'finance.listAppropriations'),
        query: input?.toJson(),
        fromJson: (json) => FinanceAppropriationCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A government's budgets by fiscal period, each with its revisions.
  ///
  /// GET /v1/finance/budgets
  Future<ApiResult<FinanceBudgetCollection>> listBudgets({FinanceGovernmentBudgets? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FinanceBudgetCollection>(
        endpoint: _routes.listBudgets,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'finance.listBudgets'),
        query: input?.toJson(),
        fromJson: (json) => FinanceBudgetCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Audit findings about an institution.
  ///
  /// GET /v1/finance/findings
  Future<ApiResult<FinanceFindingCollection>> listFindings({FinanceInstitutionFindings? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FinanceFindingCollection>(
        endpoint: _routes.listFindings,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'finance.listFindings'),
        query: input?.toJson(),
        fromJson: (json) => FinanceFindingCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
