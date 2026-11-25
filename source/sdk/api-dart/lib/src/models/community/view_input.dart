import 'package:json_annotation/json_annotation.dart';

part 'view_input.g.dart';

/// View Input
@JsonSerializable(includeIfNull: false)
class CommunityViewInput {
  const CommunityViewInput({required this.subjectCode, required this.visitor});
  final String subjectCode;
  final String visitor;

  factory CommunityViewInput.fromJson(Map<String, dynamic> json) => _$CommunityViewInputFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityViewInputToJson(this);
}
