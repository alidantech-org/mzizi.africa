import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'globe_map_surface.dart';

GlobeMapSurface createGlobeMapSurface({
  required GlobeMessageCallback onMessage,
  required GlobeLoadCallback onLoad,
  required GlobeErrorCallback onError,
}) => _MobileGlobeMapSurface(
  onMessage: onMessage,
  onLoad: onLoad,
  onError: onError,
);

class _MobileGlobeMapSurface implements GlobeMapSurface {
  _MobileGlobeMapSurface({
    required GlobeMessageCallback onMessage,
    required GlobeLoadCallback onLoad,
    required GlobeErrorCallback onError,
  }) {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF071612))
      ..addJavaScriptChannel(
        'MziziMapBridge',
        onMessageReceived: (message) => onMessage(message.message),
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) => onLoad(),
          onWebResourceError: (error) {
            if (error.isForMainFrame == true) {
              onError('The 3D map could not be loaded. Check your connection and retry.');
            }
          },
        ),
      )
      ..loadFlutterAsset('assets/map/index.html');
  }

  late final WebViewController _controller;

  @override
  Widget build() => WebViewWidget(controller: _controller);

  @override
  Future<void> invoke(String method, [Map<String, dynamic>? payload]) {
    final arguments = payload == null ? '' : jsonEncode(payload);
    return _controller.runJavaScript(
      'window.MziziMap && window.MziziMap.$method($arguments);',
    );
  }

  @override
  void dispose() {}
}
