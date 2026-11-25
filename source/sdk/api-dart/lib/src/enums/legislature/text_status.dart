import 'package:json_annotation/json_annotation.dart';

/// Text Status
enum LegislatureTextStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('published')
  published,
  @JsonValue('reviewed')
  reviewed,
}
