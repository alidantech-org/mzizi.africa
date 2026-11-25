/// Typed route registry for the Identity group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class IdentityEndpoints {
  const IdentityEndpoints();

  /// GET /v1/identity/things/{code}
  String getIdentity({required String code}) => '/v1/identity/things/$code';

  /// GET /v1/identity/addresses
  String get resolveAddress => '/v1/identity/addresses';

  /// GET /v1/identity/search
  String get searchNames => '/v1/identity/search';
}
