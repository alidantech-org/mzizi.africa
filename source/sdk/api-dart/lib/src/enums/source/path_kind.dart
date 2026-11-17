import 'package:json_annotation/json_annotation.dart';

/// Path Kind
enum SourcePathKind {
  @JsonValue('endpoint')
  endpoint,
  @JsonValue('file')
  file,
  @JsonValue('listing')
  listing,
  @JsonValue('page')
  page,
}
