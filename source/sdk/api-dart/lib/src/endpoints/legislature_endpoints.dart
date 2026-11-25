/// Typed route registry for the Legislature group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class LegislatureEndpoints {
  const LegislatureEndpoints();

  /// GET /v1/legislature/bills/{code}
  String getBill({required String code}) => '/v1/legislature/bills/$code';

  /// GET /v1/legislature/bills
  String get listBills => '/v1/legislature/bills';

  /// GET /v1/legislature/votes
  String get listVotes => '/v1/legislature/votes';
}
