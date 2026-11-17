import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Shows an operation's result: its JSON fields (only [select] when given), or the error.
class DryvResultView extends StatelessWidget {
  const DryvResultView({super.key, required this.result, this.select = const <String>[]});

  /// A result that loads when the screen opens.
  static Widget async(AsyncValue<ApiResult<Object?>> value, {List<String> select = const <String>[]}) {
    return value.when(
      data: (result) => DryvResultView(result: result, select: select),
      loading: () => const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => Text('$error'),
    );
  }

  final ApiResult<Object?>? result;
  final List<String> select;

  Widget _value(Object? value) {
    if (value is Map) {
      final entries = value.entries.where((entry) => select.isEmpty || select.contains('${entry.key}'));
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final entry in entries) ListTile(dense: true, title: Text('${entry.key}'), subtitle: Text('${entry.value}')),
        ],
      );
    }
    if (value is List) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [for (final item in value) Card(child: _value(item))],
      );
    }
    return Text('${value ?? ''}');
  }

  @override
  Widget build(BuildContext context) {
    final current = result;
    if (current == null) return const SizedBox.shrink();
    return current.when(
      success: (data, message, statusCode) => _value(jsonDecode(jsonEncode(data))),
      error: (error, message, statusCode) =>
          Text(message, style: TextStyle(color: Theme.of(context).colorScheme.error)),
    );
  }
}
