import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/reference_endpoints.dart';
import 'package:mzizi_api/src/models/reference/found_member.dart';
import 'package:mzizi_api/src/models/reference/member_collection.dart';
import 'package:mzizi_api/src/models/reference/member_key.dart';
import 'package:mzizi_api/src/models/reference/member_window.dart';
import 'package:mzizi_api/src/models/reference/scheme_collection.dart';
import 'package:mzizi_api/src/models/reference/scheme_window.dart';

/// Typed client for the Reference group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ReferenceFeature {
  const ReferenceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ReferenceEndpoints();

  /// Page through the members of one scheme, including superseded members.
  ///
  /// GET /v1/reference/values
  Future<ApiResult<ReferenceMemberCollection>> browseSchemeMembers({ReferenceMemberWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceMemberCollection>(
        endpoint: _routes.browseSchemeMembers,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.browseSchemeMembers'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceMemberCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Page through classification schemes in code order.
  ///
  /// GET /v1/reference/schemes
  Future<ApiResult<ReferenceSchemeCollection>> browseSchemes({ReferenceSchemeWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceSchemeCollection>(
        endpoint: _routes.browseSchemes,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.browseSchemes'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceSchemeCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Find one classification member from its code (codes are unique across every scheme).
  ///
  /// GET /v1/reference/lookup
  Future<ApiResult<ReferenceFoundMember>> lookupMember({ReferenceMemberKey? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceFoundMember>(
        endpoint: _routes.lookupMember,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.lookupMember'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceFoundMember.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
