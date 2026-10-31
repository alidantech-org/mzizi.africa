import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import 'globe_map_surface.dart';

GlobeMapSurface createGlobeMapSurface({
  required GlobeMessageCallback onMessage,
  required GlobeLoadCallback onLoad,
  required GlobeErrorCallback onError,
}) => _UnsupportedGlobeSurface();

class _UnsupportedGlobeSurface implements GlobeMapSurface {
  @override
  Widget build() => const ColoredBox(
    color: AppColors.lightBackground,
    child: Center(
      child: Text(
        '3D globe is not available on this platform.',
        style: TextStyle(color: AppColors.lightForeground),
      ),
    ),
  );

  @override
  Future<void> invoke(String method, [Map<String, dynamic>? payload]) async {}

  @override
  void dispose() {}
}
