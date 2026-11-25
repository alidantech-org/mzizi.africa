import 'package:json_annotation/json_annotation.dart';

part 'indicator_key.g.dart';

/// Indicator Key
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorKey {
  const StatisticsIndicatorKey({required this.code});
  final String code;

  factory StatisticsIndicatorKey.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorKeyFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorKeyToJson(this);
}
