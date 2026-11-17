import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_historical_entity.dart';

part 'features.g.dart';

/// The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.
@JsonSerializable(includeIfNull: false)
class GeographyFeatures {
  const GeographyFeatures({
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

  factory GeographyFeatures.fromJson(Map<String, dynamic> json) => _$GeographyFeaturesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeaturesToJson(this);
}
