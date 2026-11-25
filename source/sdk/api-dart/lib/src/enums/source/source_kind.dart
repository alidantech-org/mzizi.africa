import 'package:json_annotation/json_annotation.dart';

/// Source Kind
enum SourceSourceKind {
  @JsonValue('api')
  api,
  @JsonValue('feed')
  feed,
  @JsonValue('portal')
  portal,
  @JsonValue('website')
  website,
}
