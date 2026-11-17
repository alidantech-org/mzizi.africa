import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'mandates.g.dart';

/// One responsibility or authority assignment for an institution or office.
@JsonSerializable(includeIfNull: false)
class GovernanceMandates {
  const GovernanceMandates({
    required this.createdAt,
    this.deletedAt,
    required this.description,
    this.endsOn,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.institutionId,
    required this.mandateKindId,
    this.officeId,
    this.sourceCitationId,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String description;
  final DateTime? endsOn;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String? institutionId;
  final String mandateKindId;
  final String? officeId;
  final String? sourceCitationId;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceMandates.fromJson(Map<String, dynamic> json) => _$GovernanceMandatesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceMandatesToJson(this);
}
