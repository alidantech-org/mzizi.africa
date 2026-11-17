import 'package:json_annotation/json_annotation.dart';
import 'coded_historical_entity.dart';
import 'value.dart';

part 'features.g.dart';

/// The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.
@JsonSerializable(includeIfNull: false)
class Features {
  const Features({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.featureTypeId,
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
  final String featureTypeId;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final int version;

  factory Features.fromJson(Map<String, dynamic> json) => _$FeaturesFromJson(json);

  Map<String, dynamic> toJson() => _$FeaturesToJson(this);
}