import 'package:json_annotation/json_annotation.dart';

part 'institution_list_arms_groups_institutions_basis.g.dart';

/// Institution List Arms Groups Institutions Basis
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsInstitutionsBasis {
  const InsightsInstitutionListArmsGroupsInstitutionsBasis({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionListArmsGroupsInstitutionsBasis.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionListArmsGroupsInstitutionsBasisFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsInstitutionsBasisToJson(this);
}
