import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/politics_endpoints.dart';
import 'package:mzizi_api/src/models/politics/commitment_collection.dart';
import 'package:mzizi_api/src/models/politics/country_parties.dart';
import 'package:mzizi_api/src/models/politics/maker_commitments.dart';
import 'package:mzizi_api/src/models/politics/party_collection.dart';
import 'package:mzizi_api/src/models/politics/party_detail.dart';
import 'package:mzizi_api/src/models/politics/party_key.dart';

/// Typed client for the Politics group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class PoliticsFeature {
  const PoliticsFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = PoliticsEndpoints();

  /// One party with the coalitions it has belonged to.
  ///
  /// GET /v1/politics/parties/{code}
  Future<ApiResult<PoliticsPartyDetail>> getParty({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<PoliticsPartyDetail>(
        endpoint: _routes.getParty(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'politics.getParty'),
        fromJson: (json) => PoliticsPartyDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The commitments a person, party or office made, in their original words, with fulfilments.
  ///
  /// GET /v1/politics/commitments
  Future<ApiResult<PoliticsCommitmentCollection>> listCommitments({PoliticsMakerCommitments? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<PoliticsCommitmentCollection>(
        endpoint: _routes.listCommitments,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'politics.listCommitments'),
        query: input?.toJson(),
        fromJson: (json) => PoliticsCommitmentCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's political parties.
  ///
  /// GET /v1/politics/parties
  Future<ApiResult<PoliticsPartyCollection>> listParties({PoliticsCountryParties? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<PoliticsPartyCollection>(
        endpoint: _routes.listParties,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'politics.listParties'),
        query: input?.toJson(),
        fromJson: (json) => PoliticsPartyCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
