/// Typed route registry for the Election group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ElectionEndpoints {
  const ElectionEndpoints();

  /// GET /v1/election/elections/{code}
  String getElection({required String code}) => '/v1/election/elections/$code';

  /// GET /v1/election/elections
  String get listElections => '/v1/election/elections';

  /// GET /v1/election/tallies
  String get listTallies => '/v1/election/tallies';
}
