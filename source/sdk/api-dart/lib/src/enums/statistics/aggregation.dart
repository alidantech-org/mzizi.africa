import 'package:json_annotation/json_annotation.dart';

/// Aggregation
enum StatisticsAggregation {
  @JsonValue('mean')
  mean,
  @JsonValue('none')
  none,
  @JsonValue('sum')
  sum,
  @JsonValue('weighted')
  weighted,
}
