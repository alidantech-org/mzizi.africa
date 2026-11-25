/// Typed route registry for the Media group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class MediaEndpoints {
  const MediaEndpoints();

  /// GET /v1/media/articles/{code}
  String getArticle({required String code}) => '/v1/media/articles/$code';

  /// GET /v1/media/articles
  String get listArticles => '/v1/media/articles';

  /// GET /v1/media/assets
  String get listAssets => '/v1/media/assets';
}
