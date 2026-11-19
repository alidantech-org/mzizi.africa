import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_institution_arm.g.dart';

/// Institution Detail Institution Arm
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailInstitutionArm {
  const InsightsInstitutionDetailInstitutionArm({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailInstitutionArm.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailInstitutionArmFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailInstitutionArmToJson(this);
}
