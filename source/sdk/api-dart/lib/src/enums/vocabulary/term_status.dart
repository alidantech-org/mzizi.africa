import 'package:json_annotation/json_annotation.dart';

/// Term Status
enum VocabularyTermStatus {
  @JsonValue('active')
  active,
  @JsonValue('deprecated')
  deprecated,
  @JsonValue('retired')
  retired,
}
