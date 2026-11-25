import 'package:json_annotation/json_annotation.dart';

/// Text Direction
enum SharedTextDirection {
  @JsonValue('ltr')
  ltr,
  @JsonValue('rtl')
  rtl,
}
