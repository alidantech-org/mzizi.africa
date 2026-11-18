import 'package:json_annotation/json_annotation.dart';

part 'facility_key.g.dart';

/// Facility Key
@JsonSerializable(includeIfNull: false)
class ExperienceFacilityKey {
  const ExperienceFacilityKey({required this.code, this.languageCode});
  final String code;
  final String? languageCode;

  factory ExperienceFacilityKey.fromJson(Map<String, dynamic> json) => _$ExperienceFacilityKeyFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFacilityKeyToJson(this);
}
