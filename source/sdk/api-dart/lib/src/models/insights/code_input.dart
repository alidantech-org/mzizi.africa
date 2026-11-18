import 'package:json_annotation/json_annotation.dart';

part 'code_input.g.dart';

/// Code Input
@JsonSerializable(includeIfNull: false)
class InsightsCodeInput {
  const InsightsCodeInput({required this.code});
  final String code;

  factory InsightsCodeInput.fromJson(Map<String, dynamic> json) => _$InsightsCodeInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCodeInputToJson(this);
}
