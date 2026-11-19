import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'offices.g.dart';

/// One established public office, independent of any current holder and optionally scoped to a geographic unit.
@JsonSerializable(includeIfNull: false)
class GovernanceOffices {
  const GovernanceOffices({
    this.abolishedOn,
    required this.code,
    required this.createdAt,
    this.createdOn,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.institutionId,
    required this.positionId,
    this.seatOrdinal,
    this.sourceCitationId,
    this.toYear,
    this.unitFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? abolishedOn;
  final String code;
  final DateTime createdAt;
  final DateTime? createdOn;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String institutionId;
  final String positionId;
  final int? seatOrdinal;
  final String? sourceCitationId;
  final int? toYear;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceOffices.fromJson(Map<String, dynamic> json) => _$GovernanceOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficesToJson(this);
}
