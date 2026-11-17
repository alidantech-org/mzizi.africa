import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// A page that fades in; every generated route uses it.
CustomTransitionPage<void> fadeTransition({required Widget child}) {
  return CustomTransitionPage<void>(
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) =>
        FadeTransition(opacity: animation, child: child),
  );
}
