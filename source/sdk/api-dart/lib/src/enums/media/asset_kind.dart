import 'package:json_annotation/json_annotation.dart';

/// Asset Kind
enum MediaAssetKind {
  @JsonValue('embed')
  embed,
  @JsonValue('external')
  externalValue,
  @JsonValue('held')
  held,
}
