import 'package:json_annotation/json_annotation.dart';
import 'historical_validity_entity.dart';

part 'coded_historical_entity.g.dart';

/// Base for versioned records with a unique identity code and an uncertain validity period.
@JsonSerializable(includeIfNull: false)
class CodedHistoricalEntity {
  const CodedHistoricalEntity({
    required this.code,
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
  final String code;
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

  factory CodedHistoricalEntity.fromJson(Map<String, dynamic> json) => _$CodedHistoricalEntityFromJson(json);

  Map<String, dynamic> toJson() => _$CodedHistoricalEntityToJson(this);
}