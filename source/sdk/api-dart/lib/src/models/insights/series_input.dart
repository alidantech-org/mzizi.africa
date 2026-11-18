import 'package:json_annotation/json_annotation.dart';

part 'series_input.g.dart';

/// Series Input
@JsonSerializable(includeIfNull: false)
class InsightsSeriesInput {
  const InsightsSeriesInput({required this.featureId, required this.indicatorCode});
  final String featureId;
  final String indicatorCode;

  factory InsightsSeriesInput.fromJson(Map<String, dynamic> json) => _$InsightsSeriesInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsSeriesInputToJson(this);
}
