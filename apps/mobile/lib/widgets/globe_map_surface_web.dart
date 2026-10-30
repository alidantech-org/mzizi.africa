import 'dart:async';
import 'dart:js_interop';
import 'dart:js_util' as js_util;
import 'dart:ui_web' as ui_web;
import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

import 'globe_map_surface.dart';

GlobeMapSurface createGlobeMapSurface({
  required GlobeMessageCallback onMessage,
  required GlobeLoadCallback onLoad,
  required GlobeErrorCallback onError,
}) => _WebGlobeMapSurface(
  onMessage: onMessage,
  onLoad: onLoad,
  onError: onError,
);

class _WebGlobeMapSurface implements GlobeMapSurface {
  _WebGlobeMapSurface({
    required GlobeMessageCallback onMessage,
    required GlobeLoadCallback onLoad,
    required GlobeErrorCallback onError,
  }) : _onLoad = onLoad,
       _onError = onError {
    _viewType = 'mzizi-cesium-globe-${_nextViewId++}';
    _messageSubscription = web.window.onMessage.listen((event) {
      final frame = _frame;
      if (frame == null || event.source != frame.contentWindow) return;
      if (event.origin != Uri.base.origin) return;
      final message = js_util.dartify(event.data);
      if (message is String) onMessage(message);
    });
    ui_web.platformViewRegistry.registerViewFactory(_viewType, (viewId) {
      final frame = web.HTMLIFrameElement()
        ..src = Uri.base.resolve('assets/assets/map/index.html').toString()
        ..title = 'Interactive 3D political globe'
        ..allow = 'fullscreen'
        ..style.border = '0'
        ..style.width = '100%'
        ..style.height = '100%';
      frame.onLoad.listen((_) => _onLoad());
      frame.onError.listen((_) => _onError('The 3D map page could not be loaded.'));
      _frame = frame;
      return frame;
    });
  }

  static int _nextViewId = 0;
  final GlobeLoadCallback _onLoad;
  final GlobeErrorCallback _onError;
  late final String _viewType;
  late final StreamSubscription<web.MessageEvent> _messageSubscription;
  web.HTMLIFrameElement? _frame;

  @override
  Widget build() => HtmlElementView(viewType: _viewType);

  @override
  Future<void> invoke(String method, [Map<String, dynamic>? payload]) async {
    final target = _frame?.contentWindow;
    if (target == null) return;
    final command = jsonEncode({
      'source': 'mziziFlutter',
      'method': method,
      'payload': payload,
    });
    target.postMessage(command.toJS, Uri.base.origin);
  }

  @override
  void dispose() {
    _messageSubscription.cancel();
    _frame?.src = 'about:blank';
    _frame = null;
  }
}
