import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/source_endpoints.dart';
import 'package:mzizi_api/src/models/source/evidence_collection.dart';
import 'package:mzizi_api/src/models/source/row_evidence.dart';
import 'package:mzizi_api/src/models/source/source_collection.dart';
import 'package:mzizi_api/src/models/source/source_window.dart';

/// Typed client for the Source group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class SourceFeature {
  const SourceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = SourceEndpoints();

  /// Where one row came from: each citation with its artifact, edition, product and publisher.
  ///
  /// GET /v1/source/evidence
  Future<ApiResult<SourceEvidenceCollection>> listEvidence({SourceRowEvidence? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<SourceEvidenceCollection>(
        endpoint: _routes.listEvidence,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'source.listEvidence'),
        query: input?.toJson(),
        fromJson: (json) => SourceEvidenceCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The publication channels Mzizi reads, with their publishers.
  ///
  /// GET /v1/source/sources
  Future<ApiResult<SourceSourceCollection>> listSources({SourceSourceWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<SourceSourceCollection>(
        endpoint: _routes.listSources,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'source.listSources'),
        query: input?.toJson(),
        fromJson: (json) => SourceSourceCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
