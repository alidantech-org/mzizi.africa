import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders_names.dart';

part 'office_detail_holders.g.dart';

/// Office Detail Holders
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHolders {
  const GovernanceOfficeDetailHolders({
    required this.appointment,
    required this.individualId,
    required this.names,
    this.validFrom,
    this.validUntil,
  });
  final String appointment;
  final String individualId;
  final List<GovernanceOfficeDetailHoldersNames> names;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory GovernanceOfficeDetailHolders.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersToJson(this);
}
