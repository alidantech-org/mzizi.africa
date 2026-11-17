import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';

part 'features.g.dart';

/// The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.
@JsonSerializable(includeIfNull: false)
class GeographyFeatures {
  const GeographyFeatures({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endedOn,
    this.establishedOn,
    required this.featureTypeId,
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
  final DateTime? endedOn;
  final DateTime? establishedOn;
  final String featureTypeId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyFeatures.fromJson(Map<String, dynamic> json) => _$GeographyFeaturesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeaturesToJson(this);
}
