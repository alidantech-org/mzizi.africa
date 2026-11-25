import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/vocabulary_endpoints.dart';
import 'package:mzizi_api/src/models/vocabulary/scheme_detail.dart';
import 'package:mzizi_api/src/models/vocabulary/scheme_key.dart';
import 'package:mzizi_api/src/models/vocabulary/term_collection.dart';
import 'package:mzizi_api/src/models/vocabulary/term_window.dart';

/// Typed client for the Vocabulary group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class VocabularyFeature {
  const VocabularyFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = VocabularyEndpoints();

  /// One scheme by code with its labels.
  ///
  /// GET /v1/vocabulary/schemes/{code}
  Future<ApiResult<VocabularySchemeDetail>> getScheme({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<VocabularySchemeDetail>(
        endpoint: _routes.getScheme(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'vocabulary.getScheme'),
        fromJson: (json) => VocabularySchemeDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The terms of a scheme in display order, with display hints, bands and all labels.
  ///
  /// GET /v1/vocabulary/terms
  Future<ApiResult<VocabularyTermCollection>> listTerms({VocabularyTermWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<VocabularyTermCollection>(
        endpoint: _routes.listTerms,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'vocabulary.listTerms'),
        query: input?.toJson(),
        fromJson: (json) => VocabularyTermCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
