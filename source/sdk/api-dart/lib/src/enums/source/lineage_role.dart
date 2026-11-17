import 'package:json_annotation/json_annotation.dart';

/// Lineage Role
enum SourceLineageRole {
  @JsonValue('derived')
  derived,
  @JsonValue('lookup')
  lookup,
  @JsonValue('raw')
  raw,
}
