import 'package:flutter/widgets.dart';

abstract interface class GlobeMapSurface {
  Widget build();

  Future<void> invoke(String method, [Map<String, dynamic>? payload]);

  void dispose();
}

typedef GlobeMessageCallback = void Function(String message);
typedef GlobeLoadCallback = void Function();
typedef GlobeErrorCallback = void Function(String message);
