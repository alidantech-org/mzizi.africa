import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_mandates.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_names.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices.dart';

part 'institution_detail.g.dart';

/// Institution Detail
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetail {
  const GovernanceInstitutionDetail({
    required this.code,
    required this.id,
    required this.kind,
    required this.mandates,
    required this.names,
    required this.offices,
    this.validFrom,
    this.validUntil,
  });
  final String code;
  final String id;
  final String kind;
  final List<GovernanceInstitutionDetailMandates> mandates;
  final List<GovernanceInstitutionDetailNames> names;
  final List<GovernanceInstitutionDetailOffices> offices;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory GovernanceInstitutionDetail.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailToJson(this);
}
