import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';

part 'coded_period_entity.g.dart';

/// Base for versioned records with a unique identity code and a period of integer years.
@JsonSerializable(includeIfNull: false)
class SharedCodedPeriodEntity {
  const SharedCodedPeriodEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SharedCodedPeriodEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedPeriodEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedPeriodEntityToJson(this);
}
