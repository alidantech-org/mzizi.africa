/// Typed route registry for the Auth group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class AuthEndpoints {
  const AuthEndpoints();

  /// GET /v1/account
  String get getMyAccount => '/v1/account';

  /// GET /v1/admin/accounts
  String get listAccounts => '/v1/admin/accounts';
}
