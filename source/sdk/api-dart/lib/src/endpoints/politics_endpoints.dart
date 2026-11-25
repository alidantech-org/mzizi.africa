/// Typed route registry for the Politics group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class PoliticsEndpoints {
  const PoliticsEndpoints();

  /// GET /v1/politics/parties/{code}
  String getParty({required String code}) => '/v1/politics/parties/$code';

  /// GET /v1/politics/commitments
  String get listCommitments => '/v1/politics/commitments';

  /// GET /v1/politics/parties
  String get listParties => '/v1/politics/parties';
}
