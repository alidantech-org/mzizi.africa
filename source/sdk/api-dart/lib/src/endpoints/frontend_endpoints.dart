/// Typed route registry for the Frontend group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class FrontendEndpoints {
  const FrontendEndpoints();

  /// GET /v1/frontend/copy
  String get getCopyBundle => '/v1/frontend/copy';

  /// GET /v1/frontend/home
  String get getHomeScreen => '/v1/frontend/home';

  /// GET /v1/frontend/institution
  String get getInstitutionScreen => '/v1/frontend/institution';

  /// GET /v1/frontend/place
  String get getPlaceScreen => '/v1/frontend/place';

  /// GET /v1/frontend/ranking
  String get getRankingScreen => '/v1/frontend/ranking';

  /// GET /v1/frontend/search
  String get searchScreen => '/v1/frontend/search';
}
