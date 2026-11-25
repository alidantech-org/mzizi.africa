import 'package:json_annotation/json_annotation.dart';

/// Evidence Role
enum SourceEvidenceRole {
  @JsonValue('contradicts')
  contradicts,
  @JsonValue('origin')
  origin,
  @JsonValue('supports')
  supports,
}
