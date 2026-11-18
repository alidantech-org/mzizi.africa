import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'fiscal_periods.g.dart';

/// One fiscal reporting period for a country, with explicit date bounds and source citation.
@JsonSerializable(includeIfNull: false)
class FinanceFiscalPeriods {
  const FinanceFiscalPeriods({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.endsOn,
    required this.id,
    required this.periodKindId,
    this.sourceCitationId,
    required this.startsOn,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime endsOn;
  final String id;
  final String periodKindId;
  final String? sourceCitationId;
  final DateTime startsOn;
  final DateTime updatedAt;
  final int version;

  factory FinanceFiscalPeriods.fromJson(Map<String, dynamic> json) => _$FinanceFiscalPeriodsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFiscalPeriodsToJson(this);
}
