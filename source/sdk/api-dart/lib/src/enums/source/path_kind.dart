import 'package:json_annotation/json_annotation.dart';

/// Path Kind
enum SourcePathKind {
  @JsonValue('api')
  api,
  @JsonValue('feed')
  feed,
  @JsonValue('file')
  file,
  @JsonValue('listing')
  listing,
  @JsonValue('page')
  page,
}
