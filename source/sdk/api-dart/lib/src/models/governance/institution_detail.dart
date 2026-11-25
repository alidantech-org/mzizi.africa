import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_names.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices.dart';

part 'institution_detail.g.dart';

/// Institution Detail
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetail {
  const GovernanceInstitutionDetail({
    this.armTerm,
    this.basisTerm,
    this.classTerm,
    required this.code,
    required this.countryId,
    this.fromYear,
    required this.institutionId,
    required this.kindTerm,
    required this.names,
    required this.offices,
    this.toYear,
  });
  final String? armTerm;
  final String? basisTerm;
  final String? classTerm;
  final String code;
  final String countryId;
  final int? fromYear;
  final String institutionId;
  final String kindTerm;
  final List<GovernanceInstitutionDetailNames> names;
  final List<GovernanceInstitutionDetailOffices> offices;
  final int? toYear;

  factory GovernanceInstitutionDetail.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailToJson(this);
}
