import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_mandates.g.dart';

/// Institution Detail Mandates
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailMandates {
  const GovernanceInstitutionDetailMandates({required this.description, required this.kind, this.validFrom, this.validUntil});
  final String description;
  final String kind;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory GovernanceInstitutionDetailMandates.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailMandatesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailMandatesToJson(this);
}
