import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_institution_parent.g.dart';

/// Institution Detail Institution Parent
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailInstitutionParent {
  const InsightsInstitutionDetailInstitutionParent({required this.code, required this.name});
  final String code;
  final String name;

  factory InsightsInstitutionDetailInstitutionParent.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailInstitutionParentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailInstitutionParentToJson(this);
}
