import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

/// A page that fades in, keyed so the router can tell routes apart. Hand-written: the generated `_utils.dart` is managed
/// output and its `fadeTransition` carries no key.
CustomTransitionPage<void> fadePage({
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
