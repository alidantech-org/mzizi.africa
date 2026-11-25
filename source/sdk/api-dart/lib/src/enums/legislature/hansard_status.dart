import 'package:json_annotation/json_annotation.dart';

/// Hansard Status
enum LegislatureHansardStatus {
  @JsonValue('final')
  finalValue,
  @JsonValue('provisional')
  provisional,
}
