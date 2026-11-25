import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices_holders.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices_names.dart';

part 'institution_detail_offices.g.dart';

/// Institution Detail Offices
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailOffices {
  const GovernanceInstitutionDetailOffices({
    required this.code,
    this.featureId,
    required this.holders,
    required this.names,
    required this.officeId,
    this.order,
    required this.roleTerm,
    this.seat,
  });
  final String code;
  final String? featureId;
  final List<GovernanceInstitutionDetailOfficesHolders> holders;
  final List<GovernanceInstitutionDetailOfficesNames> names;
  final String officeId;
  final int? order;
  final String roleTerm;
  final String? seat;

  factory GovernanceInstitutionDetailOffices.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailOfficesToJson(this);
}
