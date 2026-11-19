import 'package:json_annotation/json_annotation.dart';

part 'like_input.g.dart';

/// Like Input
@JsonSerializable(includeIfNull: false)
class InteractionsLikeInput {
  const InteractionsLikeInput({required this.deviceId, required this.subjectRef, required this.subjectTable});
  final String deviceId;
  final String subjectRef;
  final String subjectTable;

  factory InteractionsLikeInput.fromJson(Map<String, dynamic> json) => _$InteractionsLikeInputFromJson(json);

  Map<String, dynamic> toJson() => _$InteractionsLikeInputToJson(this);
}
