import 'package:json_annotation/json_annotation.dart';

/// Name Part
enum OfficialNamePart {
  @JsonValue('family')
  family,
  @JsonValue('given')
  given,
  @JsonValue('middle')
  middle,
  @JsonValue('prefix')
  prefix,
  @JsonValue('suffix')
  suffix,
}
