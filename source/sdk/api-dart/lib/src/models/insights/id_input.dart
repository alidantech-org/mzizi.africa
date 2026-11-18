import 'package:json_annotation/json_annotation.dart';

part 'id_input.g.dart';

/// Id Input
@JsonSerializable(includeIfNull: false)
class InsightsIdInput {
  const InsightsIdInput({required this.id});
  final String id;

  factory InsightsIdInput.fromJson(Map<String, dynamic> json) => _$InsightsIdInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIdInputToJson(this);
}
