import 'package:json_annotation/json_annotation.dart';

part 'facts_input.g.dart';

/// Facts Input
@JsonSerializable(includeIfNull: false)
class InsightsFactsInput {
  const InsightsFactsInput({this.featureId, this.limit});
  final String? featureId;
  final int? limit;

  factory InsightsFactsInput.fromJson(Map<String, dynamic> json) => _$InsightsFactsInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsFactsInputToJson(this);
}
