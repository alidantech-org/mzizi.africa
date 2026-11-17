import 'package:go_router/go_router.dart';

import 'package:mzizi_app/core/network/app_network_gate.dart';
import 'package:mzizi_app/presentation/routers/_utils.dart';
import 'package:mzizi_app/presentation/routers/constants/features_screens.dart';

import 'evidence_view_screen.dart';
import 'feature_browse_screen.dart';
import 'feature_detail_screen.dart';
import 'place_profile_screen.dart';
import 'place_search_screen.dart';
import 'source_browse_screen.dart';

/// Routes of the Features screens.
final featuresRouterRoutes = <GoRoute>[
  GoRoute(
    path: FeaturesScreensRoutes.evidenceView,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Evidence View',
        child: EvidenceViewScreen(),
      ),
    ),
  ),
  GoRoute(
    path: FeaturesScreensRoutes.featureBrowse,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Feature Browse',
        child: FeatureBrowseScreen(),
      ),
    ),
  ),
  GoRoute(
    path: FeaturesScreensRoutes.featureDetail,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Feature Detail',
        child: FeatureDetailScreen(),
      ),
    ),
  ),
  GoRoute(
    path: FeaturesScreensRoutes.placeProfile,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Place Profile',
        child: PlaceProfileScreen(),
      ),
    ),
  ),
  GoRoute(
    path: FeaturesScreensRoutes.placeSearch,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Place Search',
        child: PlaceSearchScreen(),
      ),
    ),
  ),
  GoRoute(
    path: FeaturesScreensRoutes.sourceBrowse,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Source Browse',
        child: SourceBrowseScreen(),
      ),
    ),
  ),
];
