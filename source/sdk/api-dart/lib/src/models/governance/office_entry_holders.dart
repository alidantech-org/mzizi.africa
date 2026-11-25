import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_entry_holders_names.dart';

part 'office_entry_holders.g.dart';

/// Office Entry Holders
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeEntryHolders {
  const GovernanceOfficeEntryHolders({
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
  final List<GovernanceOfficeEntryHoldersNames> names;
  final DateTime? startsOn;
  final int? toYear;

  factory GovernanceOfficeEntryHolders.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeEntryHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeEntryHoldersToJson(this);
}
