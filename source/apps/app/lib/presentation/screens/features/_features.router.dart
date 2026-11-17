import 'package:go_router/go_router.dart';

import '../../../core/network/app_network_gate.dart';
import '../../routers/_utils.dart';
import '../../routers/constants/features_screens.dart';
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
