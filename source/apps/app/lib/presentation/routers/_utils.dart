import 'package:material_ui/material_ui.dart';
import 'package:go_router/go_router.dart';

/// A page that fades in; every generated route uses it.
CustomTransitionPage<void> fadeTransition({
  required LocalKey key,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: key,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) =>
        FadeTransition(opacity: animation, child: child),
  );
}

/// Explicit route metadata for screens that supply their own Scaffold and app bar.
class SelfFramedGoRoute extends GoRoute {
  SelfFramedGoRoute({required super.path, required super.builder});
}
