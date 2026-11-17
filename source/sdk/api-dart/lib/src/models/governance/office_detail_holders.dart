import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders_names.dart';

part 'office_detail_holders.g.dart';

/// Office Detail Holders
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHolders {
  const GovernanceOfficeDetailHolders({
    required this.appointment,
    this.fromToPrecision,
    this.fromYear,
    required this.individualId,
    required this.names,
    this.toYear,
  });
  final String appointment;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String individualId;
  final List<GovernanceOfficeDetailHoldersNames> names;
  final int? toYear;

  factory GovernanceOfficeDetailHolders.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersToJson(this);
}
