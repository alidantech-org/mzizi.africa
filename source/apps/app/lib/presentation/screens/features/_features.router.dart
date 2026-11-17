import 'package:go_router/go_router.dart';

import 'package:mzizi_app/core/network/app_network_gate.dart';
import 'package:mzizi_app/presentation/routers/_utils.dart';
import 'package:mzizi_app/presentation/routers/constants/features_screens.dart';

import 'feature_browse_screen.dart';
import 'feature_detail_screen.dart';

/// Routes of the Features screens.
final featuresRouterRoutes = <GoRoute>[
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
];
