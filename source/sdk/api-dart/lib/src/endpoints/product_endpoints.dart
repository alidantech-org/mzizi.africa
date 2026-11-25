/// Typed route registry for the Product group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ProductEndpoints {
  const ProductEndpoints();

  /// GET /v1/product/site
  String get getSite => '/v1/product/site';

  /// GET /v1/product/messages
  String get listMessages => '/v1/product/messages';

  /// GET /v1/product/releases
  String get listReleases => '/v1/product/releases';
}
