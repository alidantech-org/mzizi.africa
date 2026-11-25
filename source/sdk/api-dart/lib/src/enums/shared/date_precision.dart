import 'package:json_annotation/json_annotation.dart';

/// Date Precision
enum SharedDatePrecision {
  @JsonValue('circa')
  circa,
  @JsonValue('day')
  day,
  @JsonValue('decade')
  decade,
  @JsonValue('month')
  month,
  @JsonValue('year')
  year,
}
