import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';

part 'historical_validity_entity.g.dart';

/// Base for versioned records valid over a period whose start and end may be uncertain.
@JsonSerializable(includeIfNull: false)
class SharedHistoricalValidityEntity {
  const SharedHistoricalValidityEntity({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    this.validFrom,
    this.validFromEarliest,
    this.validFromLatest,
    this.validUntil,
    this.validUntilEarliest,
    this.validUntilLatest,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final int version;

  factory SharedHistoricalValidityEntity.fromJson(Map<String, dynamic> json) => _$SharedHistoricalValidityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedHistoricalValidityEntityToJson(this);
}
