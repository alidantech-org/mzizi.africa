import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_leaders_unit.g.dart';

/// Institution Detail Leaders Unit
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailLeadersUnit {
  const InsightsInstitutionDetailLeadersUnit({required this.featureId, required this.name});
  final String featureId;
  final String name;

  factory InsightsInstitutionDetailLeadersUnit.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailLeadersUnitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailLeadersUnitToJson(this);
}
