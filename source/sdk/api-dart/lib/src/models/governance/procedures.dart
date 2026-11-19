import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'procedures.g.dart';

/// A named sequence of rights, such as appointing a judge or removing a governor; its steps are powers.
@JsonSerializable(includeIfNull: false)
class GovernanceProcedures {
  const GovernanceProcedures({
    this.basisProvisionId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.description,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.kindId,
    this.sourceCitationId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String description;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String kindId;
  final String? sourceCitationId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceProcedures.fromJson(Map<String, dynamic> json) => _$GovernanceProceduresFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceProceduresToJson(this);
}
