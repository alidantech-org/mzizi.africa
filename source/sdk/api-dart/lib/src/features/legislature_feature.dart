import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/legislature_endpoints.dart';
import 'package:mzizi_api/src/models/legislature/bill_collection.dart';
import 'package:mzizi_api/src/models/legislature/bill_detail.dart';
import 'package:mzizi_api/src/models/legislature/bill_key.dart';
import 'package:mzizi_api/src/models/legislature/bill_window.dart';
import 'package:mzizi_api/src/models/legislature/motion_votes.dart';
import 'package:mzizi_api/src/models/legislature/vote_collection.dart';

/// Typed client for the Legislature group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class LegislatureFeature {
  const LegislatureFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = LegislatureEndpoints();

  /// One bill with its stages, each dated through its sitting's calendar occurrence.
  ///
  /// GET /v1/legislature/bills/{code}
  Future<ApiResult<LegislatureBillDetail>> getBill({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegislatureBillDetail>(
        endpoint: _routes.getBill(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legislature.getBill'),
        fromJson: (json) => LegislatureBillDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The bills of a house, optionally by status, newest first.
  ///
  /// GET /v1/legislature/bills
  Future<ApiResult<LegislatureBillCollection>> listBills({LegislatureBillWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegislatureBillCollection>(
        endpoint: _routes.listBills,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legislature.listBills'),
        query: input?.toJson(),
        fromJson: (json) => LegislatureBillCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// How each member voted on a motion, with the party they voted as.
  ///
  /// GET /v1/legislature/votes
  Future<ApiResult<LegislatureVoteCollection>> listVotes({LegislatureMotionVotes? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegislatureVoteCollection>(
        endpoint: _routes.listVotes,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legislature.listVotes'),
        query: input?.toJson(),
        fromJson: (json) => LegislatureVoteCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
