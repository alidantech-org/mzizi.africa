/// Typed route registry for the Finance group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class FinanceEndpoints {
  const FinanceEndpoints();

  /// GET /v1/finance/appropriations
  String get listAppropriations => '/v1/finance/appropriations';

  /// GET /v1/finance/budgets
  String get listBudgets => '/v1/finance/budgets';

  /// GET /v1/finance/findings
  String get listFindings => '/v1/finance/findings';
}
