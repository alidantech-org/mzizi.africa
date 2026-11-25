import 'package:json_annotation/json_annotation.dart';

/// Message Status
enum ProductMessageStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('published')
  published,
  @JsonValue('reviewed')
  reviewed,
}
