import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_detail_offices_holders_names.dart';

part 'institution_detail_offices_holders.g.dart';

/// Institution Detail Offices Holders
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailOfficesHolders {
  const GovernanceInstitutionDetailOfficesHolders({
    this.endsOn,
    this.fromYear,
    required this.holderId,
    required this.individualCode,
    required this.individualId,
    required this.methodTerm,
    required this.names,
    this.startsOn,
    this.toYear,
  });
  final DateTime? endsOn;
  final int? fromYear;
  final String holderId;
  final String individualCode;
  final String individualId;
  final String methodTerm;
  final List<GovernanceInstitutionDetailOfficesHoldersNames> names;
  final DateTime? startsOn;
  final int? toYear;

  factory GovernanceInstitutionDetailOfficesHolders.fromJson(Map<String, dynamic> json) =>
      _$GovernanceInstitutionDetailOfficesHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailOfficesHoldersToJson(this);
}
