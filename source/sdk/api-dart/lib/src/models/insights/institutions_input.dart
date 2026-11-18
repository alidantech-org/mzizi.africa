import 'package:json_annotation/json_annotation.dart';

part 'institutions_input.g.dart';

/// Institutions Input
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionsInput {
  const InsightsInstitutionsInput({this.armCode, this.kindCode, this.query});
  final String? armCode;
  final String? kindCode;
  final String? query;

  factory InsightsInstitutionsInput.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionsInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionsInputToJson(this);
}
