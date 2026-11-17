import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/auth_endpoints.dart';
import 'package:mzizi_api/src/models/auth/account_collection.dart';
import 'package:mzizi_api/src/models/auth/account_read.dart';
import 'package:mzizi_api/src/models/auth/account_window.dart';

/// Typed client for the Auth group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class AuthFeature {
  const AuthFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = AuthEndpoints();

  /// The signed-in person's own account.
  ///
  /// GET /v1/account
  Future<ApiResult<AuthAccountRead>> getMyAccount({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<AuthAccountRead>(
        endpoint: _routes.getMyAccount,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'auth.getMyAccount'),
        fromJson: (json) => AuthAccountRead.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Page through accounts, optionally by status. Administrators only.
  ///
  /// GET /v1/admin/accounts
  Future<ApiResult<AuthAccountCollection>> listAccounts({AuthAccountWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<AuthAccountCollection>(
        endpoint: _routes.listAccounts,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'auth.listAccounts'),
        query: input?.toJson(),
        fromJson: (json) => AuthAccountCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
