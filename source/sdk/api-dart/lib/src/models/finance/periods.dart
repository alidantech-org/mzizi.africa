import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'periods.g.dart';

/// A fiscal period of a country (FY 2023/24).
@JsonSerializable(includeIfNull: false)
class FinancePeriods {
  const FinancePeriods({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.endsOn,
    this.fromYear,
    required this.id,
    required this.kindTerm,
    required this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime endsOn;
  final int? fromYear;
  final String id;
  final String kindTerm;
  final DateTime startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory FinancePeriods.fromJson(Map<String, dynamic> json) => _$FinancePeriodsFromJson(json);

  Map<String, dynamic> toJson() => _$FinancePeriodsToJson(this);
}
