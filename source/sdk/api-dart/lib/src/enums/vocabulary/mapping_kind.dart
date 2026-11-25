import 'package:json_annotation/json_annotation.dart';

/// Mapping Kind
enum VocabularyMappingKind {
  @JsonValue('broader')
  broader,
  @JsonValue('close')
  close,
  @JsonValue('exact')
  exact,
  @JsonValue('narrower')
  narrower,
  @JsonValue('related')
  related,
}
