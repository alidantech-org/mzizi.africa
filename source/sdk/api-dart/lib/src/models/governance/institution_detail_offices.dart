import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_offices.g.dart';

/// Institution Detail Offices
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailOffices {
  const GovernanceInstitutionDetailOffices({required this.code, required this.id, required this.kind});
  final String code;
  final String id;
  final String kind;

  factory GovernanceInstitutionDetailOffices.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailOfficesToJson(this);
}
