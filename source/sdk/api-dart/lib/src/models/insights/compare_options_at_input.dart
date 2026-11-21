import 'package:json_annotation/json_annotation.dart';

part 'compare_options_at_input.g.dart';

/// Compare Options At Input
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsAtInput {
  const InsightsCompareOptionsAtInput({required this.countryCode, this.languageCode, this.metric, this.path});
  final String countryCode;
  final String? languageCode;
  final String? metric;
  final String? path;

  factory InsightsCompareOptionsAtInput.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsAtInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsAtInputToJson(this);
}
