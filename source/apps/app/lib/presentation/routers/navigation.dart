/// The destinations of the app's navigation, generated from its views. Managed by Dryv: regenerated every time.
/// Detail views need context (a record to open), so they are routes but not destinations.
class AppDestination {
  const AppDestination({required this.label, required this.path});

  final String label;
  final String path;
}

/// Every view's root-level path.
abstract final class AppRoutes {
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

/// The entries for a bottom bar, drawer or menu, in view order.
const appDestinations = <AppDestination>[
  AppDestination(label: 'Feature Browse', path: AppRoutes.featureBrowse),
  AppDestination(label: 'Place Search', path: AppRoutes.placeSearch),
  AppDestination(label: 'Source Browse', path: AppRoutes.sourceBrowse),
];