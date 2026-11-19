import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_leaders_how.g.dart';

/// Institution Detail Leaders How
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailLeadersHow {
  const InsightsInstitutionDetailLeadersHow({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailLeadersHow.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailLeadersHowFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailLeadersHowToJson(this);
}
