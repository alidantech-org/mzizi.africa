import 'package:json_annotation/json_annotation.dart';

part 'compare_options_input.g.dart';

/// Compare Options Input
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsInput {
  const InsightsCompareOptionsInput({required this.featureId, this.metric});
  final String featureId;
  final String? metric;

  factory InsightsCompareOptionsInput.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsInputToJson(this);
}
