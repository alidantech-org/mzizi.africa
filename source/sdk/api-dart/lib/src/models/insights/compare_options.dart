import 'package:json_annotation/json_annotation.dart';

part 'compare_options.g.dart';

/// Compare Options
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptions {
  const InsightsCompareOptions({
    required this.gaps,
    required this.hierarchy,
    required this.metrics,
    required this.nearby,
    required this.place,
    required this.top,
  });
  final List<String> gaps;
  final List<Object?> hierarchy;
  final List<Object?> metrics;
  final List<Object?> nearby;
  final Object? place;
  final List<Object?> top;

  factory InsightsCompareOptions.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsToJson(this);
}
