import 'package:json_annotation/json_annotation.dart';

/// Retention
enum FilesystemRetention {
  @JsonValue('preserve_history')
  preserveHistory,
  @JsonValue('replace_current')
  replaceCurrent,
}
