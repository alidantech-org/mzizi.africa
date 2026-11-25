import 'package:json_annotation/json_annotation.dart';

/// Evidence Method
enum SourceEvidenceMethod {
  @JsonValue('extracted')
  extracted,
  @JsonValue('manual')
  manual,
  @JsonValue('matched')
  matched,
  @JsonValue('modelled')
  modelled,
}
