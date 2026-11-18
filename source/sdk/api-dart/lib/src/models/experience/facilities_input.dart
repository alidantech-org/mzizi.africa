import 'package:json_annotation/json_annotation.dart';

part 'facilities_input.g.dart';

/// Facilities Input
@JsonSerializable(includeIfNull: false)
class ExperienceFacilitiesInput {
  const ExperienceFacilitiesInput({this.classCode, this.featureId, this.languageCode, this.limit, this.query});
  final String? classCode;
  final String? featureId;
  final String? languageCode;
  final int? limit;
  final String? query;

  factory ExperienceFacilitiesInput.fromJson(Map<String, dynamic> json) => _$ExperienceFacilitiesInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFacilitiesInputToJson(this);
}
