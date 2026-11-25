import 'package:json_annotation/json_annotation.dart';

/// Text Status
enum MediaTextStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('published')
  published,
  @JsonValue('reviewed')
  reviewed,
}
