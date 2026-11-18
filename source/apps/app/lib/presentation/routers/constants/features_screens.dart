/// Route paths of the Features screens.
abstract final class FeaturesScreensRoutes {
  /// One citation with its source and files.
  static const String evidenceView = '/evidence-view';
  /// Browse geographic features, narrowed by feature kind or code prefix.
  static const String featureBrowse = '/feature-browse';
  /// One geographic feature with its names.
  static const String featureDetail = '/feature-detail';
  /// Who serves a place: officials, procurement, media and the evidence for each claim.
  static const String placeProfile = '/place-profile';
  /// Find a place by name and open its profile.
  static const String placeSearch = '/place-search';
  /// The data sources behind the platform.
  static const String sourceBrowse = '/source-browse';
}