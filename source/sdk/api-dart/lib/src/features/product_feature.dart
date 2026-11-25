import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/product_endpoints.dart';
import 'package:mzizi_api/src/models/product/message_collection.dart';
import 'package:mzizi_api/src/models/product/message_window.dart';
import 'package:mzizi_api/src/models/product/release_collection.dart';
import 'package:mzizi_api/src/models/product/release_window.dart';
import 'package:mzizi_api/src/models/product/site_detail.dart';
import 'package:mzizi_api/src/models/product/site_key.dart';

/// Typed client for the Product group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ProductFeature {
  const ProductFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ProductEndpoints();

  /// The site served on a host, with its app, country and default locale.
  ///
  /// GET /v1/product/site
  Future<ApiResult<ProductSiteDetail>> getSite({ProductSiteKey? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ProductSiteDetail>(
        endpoint: _routes.getSite,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'product.getSite'),
        query: input?.toJson(),
        fromJson: (json) => ProductSiteDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The interface messages of an app in one language; missing keys are gaps the UI shows as keys.
  ///
  /// GET /v1/product/messages
  Future<ApiResult<ProductMessageCollection>> listMessages({ProductMessageWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ProductMessageCollection>(
        endpoint: _routes.listMessages,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'product.listMessages'),
        query: input?.toJson(),
        fromJson: (json) => ProductMessageCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Which countries are served on which app, and since when.
  ///
  /// GET /v1/product/releases
  Future<ApiResult<ProductReleaseCollection>> listReleases({ProductReleaseWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ProductReleaseCollection>(
        endpoint: _routes.listReleases,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'product.listReleases'),
        query: input?.toJson(),
        fromJson: (json) => ProductReleaseCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
