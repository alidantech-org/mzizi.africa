import 'package:json_annotation/json_annotation.dart';

part 'engagement_input.g.dart';

/// Engagement Input
@JsonSerializable(includeIfNull: false)
class InteractionsEngagementInput {
  const InteractionsEngagementInput({this.deviceId, required this.subjectRef, required this.subjectTable});
  final String? deviceId;
  final String subjectRef;
  final String subjectTable;

  factory InteractionsEngagementInput.fromJson(Map<String, dynamic> json) => _$InteractionsEngagementInputFromJson(json);

  Map<String, dynamic> toJson() => _$InteractionsEngagementInputToJson(this);
}
