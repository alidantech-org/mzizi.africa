import 'package:json_annotation/json_annotation.dart';
import 'features.dart';
import 'historical_validity_entity.dart';
import 'value.dart';

part 'classifications.g.dart';

/// One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time.
@JsonSerializable(includeIfNull: false)
class Classifications {
  const Classifications({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    required this.updatedAt,
    this.validFrom,
    this.validFromEarliest,
    this.validFromLatest,
    this.validUntil,
    this.validUntilEarliest,
    this.validUntilLatest,
    required this.valueId,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final String valueId;
  final int version;

  factory Classifications.fromJson(Map<String, dynamic> json) => _$ClassificationsFromJson(json);

  Map<String, dynamic> toJson() => _$ClassificationsToJson(this);
}