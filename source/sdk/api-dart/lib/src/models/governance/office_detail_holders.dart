import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders_names.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders_steps.dart';

part 'office_detail_holders.g.dart';

/// Office Detail Holders
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHolders {
  const GovernanceOfficeDetailHolders({
    this.endsOn,
    this.fromYear,
    required this.holderId,
    required this.individualCode,
    required this.individualId,
    required this.methodTerm,
    required this.names,
    this.startsOn,
    required this.steps,
    this.toYear,
  });
  final DateTime? endsOn;
  final int? fromYear;
  final String holderId;
  final String individualCode;
  final String individualId;
  final String methodTerm;
  final List<GovernanceOfficeDetailHoldersNames> names;
  final DateTime? startsOn;
  final List<GovernanceOfficeDetailHoldersSteps> steps;
  final int? toYear;

  factory GovernanceOfficeDetailHolders.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersToJson(this);
}
