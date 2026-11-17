import 'package:json_annotation/json_annotation.dart';

/// Language Name Kind
enum ReferenceLanguageNameKind {
  @JsonValue('abbreviation')
  abbreviation,
  @JsonValue('alternative')
  alternative,
  @JsonValue('endonym')
  endonym,
  @JsonValue('exonym')
  exonym,
}
