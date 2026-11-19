/// Typed route registry for the Ledger group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class LedgerEndpoints {
  const LedgerEndpoints();

  /// GET /v1/coverage
  String get getCoverage => '/v1/coverage';

  /// GET /v1/budgets
  String get listBudgets => '/v1/budgets';

  /// GET /v1/coalitions
  String get listCoalitions => '/v1/coalitions';

  /// GET /v1/funds
  String get listFunds => '/v1/funds';

  /// GET /v1/manifestos
  String get listManifestos => '/v1/manifestos';
}
