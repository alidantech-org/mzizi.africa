import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_entry_holders.dart';
import 'package:mzizi_api/src/models/governance/office_entry_names.dart';

part 'office_entry.g.dart';

/// Office Entry
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeEntry {
  const GovernanceOfficeEntry({
    required this.code,
    required this.holders,
    required this.institutionCode,
    required this.institutionId,
    this.methodTerm,
    required this.names,
    required this.officeId,
    this.order,
    required this.roleTerm,
    this.seat,
  });
  final String code;
  final List<GovernanceOfficeEntryHolders> holders;
  final String institutionCode;
  final String institutionId;
  final String? methodTerm;
  final List<GovernanceOfficeEntryNames> names;
  final String officeId;
  final int? order;
  final String roleTerm;
  final String? seat;

  factory GovernanceOfficeEntry.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeEntryToJson(this);
}
