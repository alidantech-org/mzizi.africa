import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/media_endpoints.dart';
import 'package:mzizi_api/src/models/media/article_collection.dart';
import 'package:mzizi_api/src/models/media/article_detail.dart';
import 'package:mzizi_api/src/models/media/article_key.dart';
import 'package:mzizi_api/src/models/media/identity_media.dart';
import 'package:mzizi_api/src/models/media/use_collection.dart';

/// Typed client for the Media group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class MediaFeature {
  const MediaFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = MediaEndpoints();

  /// One article with its texts in every language; machine translations are marked by origin.
  ///
  /// GET /v1/media/articles/{code}
  Future<ApiResult<MediaArticleDetail>> getArticle({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<MediaArticleDetail>(
        endpoint: _routes.getArticle(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'media.getArticle'),
        fromJson: (json) => MediaArticleDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The articles for a named thing, newest first, with their titles in every language.
  ///
  /// GET /v1/media/articles
  Future<ApiResult<MediaArticleCollection>> listArticles({MediaIdentityMedia? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<MediaArticleCollection>(
        endpoint: _routes.listArticles,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'media.listArticles'),
        query: input?.toJson(),
        fromJson: (json) => MediaArticleCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The photos, logos, flags and videos that illustrate a named thing, with captions.
  ///
  /// GET /v1/media/assets
  Future<ApiResult<MediaUseCollection>> listAssets({MediaIdentityMedia? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<MediaUseCollection>(
        endpoint: _routes.listAssets,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'media.listAssets'),
        query: input?.toJson(),
        fromJson: (json) => MediaUseCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
