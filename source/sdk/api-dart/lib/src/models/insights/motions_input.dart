import 'package:json_annotation/json_annotation.dart';

part 'motions_input.g.dart';

/// Motions Input
@JsonSerializable(includeIfNull: false)
class InsightsMotionsInput {
  const InsightsMotionsInput({this.institutionId, this.limit});
  final String? institutionId;
  final int? limit;

  factory InsightsMotionsInput.fromJson(Map<String, dynamic> json) => _$InsightsMotionsInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionsInputToJson(this);
}
