import 'package:json_annotation/json_annotation.dart';

part 'indicator_detail_dimensions.g.dart';

/// Indicator Detail Dimensions
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorDetailDimensions {
  const StatisticsIndicatorDetailDimensions({required this.isRequired, required this.position, required this.schemeId});
  final bool isRequired;
  final int position;
  final String schemeId;

  factory StatisticsIndicatorDetailDimensions.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorDetailDimensionsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorDetailDimensionsToJson(this);
}
