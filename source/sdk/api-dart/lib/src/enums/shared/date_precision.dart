import 'package:json_annotation/json_annotation.dart';

/// Date Precision
enum SharedDatePrecision {
  @JsonValue('approximate')
  approximate,
  @JsonValue('end-approximate')
  endApproximate,
  @JsonValue('exact')
  exact,
  @JsonValue('start-approximate')
  startApproximate,
  @JsonValue('unknown')
  unknown,
}
