import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'period_entity.g.dart';

/// Base for versioned records with a period of integer years.
@JsonSerializable(includeIfNull: false)
class SharedPeriodEntity {
  const SharedPeriodEntity({
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SharedPeriodEntity.fromJson(Map<String, dynamic> json) => _$SharedPeriodEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPeriodEntityToJson(this);
}
