import 'package:go_router/go_router.dart';

import 'package:mzizi_app/core/network/app_network_gate.dart';
import 'package:mzizi_app/presentation/routers/_utils.dart';
import 'package:mzizi_app/presentation/routers/constants/features_screens.dart';

import 'feature_list_screen.dart';

/// Routes of the Features screens.
final featuresRouterRoutes = <GoRoute>[
  GoRoute(
    path: FeaturesScreensRoutes.featureList,
    pageBuilder: (context, state) => fadeTransition(
      child: const AppNetworkRequiredGate(
        title: 'Feature List',
        child: FeatureListScreen(),
      ),
    ),
  ),
];
