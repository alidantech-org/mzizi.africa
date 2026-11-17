import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'period_entity.g.dart';

/// Base for versioned records with a period of integer years and one precision for the pair.
@JsonSerializable(includeIfNull: false)
class SharedPeriodEntity {
  const SharedPeriodEntity({
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SharedPeriodEntity.fromJson(Map<String, dynamic> json) => _$SharedPeriodEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPeriodEntityToJson(this);
}
