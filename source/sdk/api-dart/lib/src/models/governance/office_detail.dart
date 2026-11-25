import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders.dart';
import 'package:mzizi_api/src/models/governance/office_detail_names.dart';

part 'office_detail.g.dart';

/// Office Detail
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetail {
  const GovernanceOfficeDetail({
    required this.code,
    this.featureId,
    required this.holders,
    required this.institutionId,
    required this.names,
    required this.officeId,
    required this.positionId,
    required this.roleTerm,
    this.seat,
    this.termLimit,
    this.termYears,
  });
  final String code;
  final String? featureId;
  final List<GovernanceOfficeDetailHolders> holders;
  final String institutionId;
  final List<GovernanceOfficeDetailNames> names;
  final String officeId;
  final String positionId;
  final String roleTerm;
  final String? seat;
  final int? termLimit;
  final int? termYears;

  factory GovernanceOfficeDetail.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailToJson(this);
}
