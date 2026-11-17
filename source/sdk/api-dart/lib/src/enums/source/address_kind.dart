import 'package:json_annotation/json_annotation.dart';

/// Address Kind
enum SourceAddressKind {
  @JsonValue('endpoint')
  endpoint,
  @JsonValue('file')
  file,
  @JsonValue('listing')
  listing,
  @JsonValue('page')
  page,
}
