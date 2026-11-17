import 'package:go_router/go_router.dart';

import '../screens/features/_features.router.dart';

/// Every generated screen route, grouped by feature.
final appRouter = GoRouter(
  initialLocation: '/app/feature-list',
  routes: [...featuresRouterRoutes],
);
