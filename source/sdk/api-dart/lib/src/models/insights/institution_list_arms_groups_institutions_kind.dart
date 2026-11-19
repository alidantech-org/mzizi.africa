import 'package:json_annotation/json_annotation.dart';

part 'institution_list_arms_groups_institutions_kind.g.dart';

/// Institution List Arms Groups Institutions Kind
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsInstitutionsKind {
  const InsightsInstitutionListArmsGroupsInstitutionsKind({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionListArmsGroupsInstitutionsKind.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionListArmsGroupsInstitutionsKindFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsInstitutionsKindToJson(this);
}
