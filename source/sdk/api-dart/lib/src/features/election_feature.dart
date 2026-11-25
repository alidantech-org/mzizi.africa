import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/election_endpoints.dart';
import 'package:mzizi_api/src/models/election/country_elections.dart';
import 'package:mzizi_api/src/models/election/election_collection.dart';
import 'package:mzizi_api/src/models/election/election_detail.dart';
import 'package:mzizi_api/src/models/election/election_key.dart';
import 'package:mzizi_api/src/models/election/place_tallies.dart';
import 'package:mzizi_api/src/models/election/tally_collection.dart';

/// Typed client for the Election group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ElectionFeature {
  const ElectionFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ElectionEndpoints();

  /// One election with its contests and candidates.
  ///
  /// GET /v1/election/elections/{code}
  Future<ApiResult<ElectionElectionDetail>> getElection({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ElectionElectionDetail>(
        endpoint: _routes.getElection(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'election.getElection'),
        fromJson: (json) => ElectionElectionDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's elections, newest first.
  ///
  /// GET /v1/election/elections
  Future<ApiResult<ElectionElectionCollection>> listElections({ElectionCountryElections? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ElectionElectionCollection>(
        endpoint: _routes.listElections,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'election.listElections'),
        query: input?.toJson(),
        fromJson: (json) => ElectionElectionCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The results to show for a place, per contest and option, chosen by the country's priorities.
  ///
  /// GET /v1/election/tallies
  Future<ApiResult<ElectionTallyCollection>> listTallies({ElectionPlaceTallies? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ElectionTallyCollection>(
        endpoint: _routes.listTallies,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'election.listTallies'),
        query: input?.toJson(),
        fromJson: (json) => ElectionTallyCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
