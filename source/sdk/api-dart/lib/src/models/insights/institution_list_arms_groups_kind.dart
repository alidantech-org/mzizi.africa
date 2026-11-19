import 'package:json_annotation/json_annotation.dart';

part 'institution_list_arms_groups_kind.g.dart';

/// Institution List Arms Groups Kind
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsKind {
  const InsightsInstitutionListArmsGroupsKind({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionListArmsGroupsKind.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionListArmsGroupsKindFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsKindToJson(this);
}
