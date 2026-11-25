import 'package:json_annotation/json_annotation.dart';

/// Frequency
enum StatisticsFrequency {
  @JsonValue('annual')
  annual,
  @JsonValue('decennial')
  decennial,
  @JsonValue('intercensal')
  intercensal,
  @JsonValue('monthly')
  monthly,
  @JsonValue('quarterly')
  quarterly,
}
