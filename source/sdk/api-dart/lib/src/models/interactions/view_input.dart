import 'package:json_annotation/json_annotation.dart';

part 'view_input.g.dart';

/// View Input
@JsonSerializable(includeIfNull: false)
class InteractionsViewInput {
  const InteractionsViewInput({required this.subjectRef, required this.subjectTable, required this.visitor});
  final String subjectRef;
  final String subjectTable;
  final String visitor;

  factory InteractionsViewInput.fromJson(Map<String, dynamic> json) => _$InteractionsViewInputFromJson(json);

  Map<String, dynamic> toJson() => _$InteractionsViewInputToJson(this);
}
