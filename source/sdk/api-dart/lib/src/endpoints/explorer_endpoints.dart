/// Typed route registry for the Explorer group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ExplorerEndpoints {
  const ExplorerEndpoints();

  /// GET /v1/explorer/copy
  String get getCopyBundle => '/v1/explorer/copy';

  /// GET /v1/explorer/context
  String get getExplorerContext => '/v1/explorer/context';

  /// GET /v1/explorer/navigation
  String get getExplorerNavigation => '/v1/explorer/navigation';

  /// GET /v1/explorer/overview
  String get getExplorerOverview => '/v1/explorer/overview';

  /// GET /v1/explorer/setup
  String get getSetupBootstrap => '/v1/explorer/setup';

  /// GET /v1/explorer/children
  String get listExplorerChildren => '/v1/explorer/children';

  /// POST /v1/explorer/resolve
  String get resolveExplorerCoordinates => '/v1/explorer/resolve';

  /// GET /v1/explorer/search
  String get searchExplorerPlaces => '/v1/explorer/search';
}
