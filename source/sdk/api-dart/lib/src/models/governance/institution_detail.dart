import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_mandates.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_names.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices.dart';

part 'institution_detail.g.dart';

/// Institution Detail
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetail {
  const GovernanceInstitutionDetail({
    required this.code,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.kind,
    required this.mandates,
    required this.names,
    required this.offices,
    this.toYear,
  });
  final String code;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String kind;
  final List<GovernanceInstitutionDetailMandates> mandates;
  final List<GovernanceInstitutionDetailNames> names;
  final List<GovernanceInstitutionDetailOffices> offices;
  final int? toYear;

  factory GovernanceInstitutionDetail.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailToJson(this);
}
