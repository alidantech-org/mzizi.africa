import 'package:json_annotation/json_annotation.dart';

part 'law_input.g.dart';

/// Law Input
@JsonSerializable(includeIfNull: false)
class InsightsLawInput {
  const InsightsLawInput({this.kindCode});
  final String? kindCode;

  factory InsightsLawInput.fromJson(Map<String, dynamic> json) => _$InsightsLawInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLawInputToJson(this);
}
