import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'holders.g.dart';

/// One person's continuous tenure in one office, with appointment kind and effective dates.
@JsonSerializable(includeIfNull: false)
class GovernanceHolders {
  const GovernanceHolders({
    this.appointedByEntityId,
    required this.appointmentKindId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.individualId,
    this.leftOfficeOn,
    required this.officeId,
    this.sourceCitationId,
    this.toYear,
    this.tookOfficeOn,
    required this.updatedAt,
    required this.version,
  });
  final String? appointedByEntityId;
  final String appointmentKindId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String individualId;
  final DateTime? leftOfficeOn;
  final String officeId;
  final String? sourceCitationId;
  final int? toYear;
  final DateTime? tookOfficeOn;
  final DateTime updatedAt;
  final int version;

  factory GovernanceHolders.fromJson(Map<String, dynamic> json) => _$GovernanceHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceHoldersToJson(this);
}
