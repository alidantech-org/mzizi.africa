import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/feature_detail_names.dart';

part 'feature_detail.g.dart';

/// Feature Detail
@JsonSerializable(includeIfNull: false)
class GeographyFeatureDetail {
  const GeographyFeatureDetail({
    required this.code,
    required this.featureId,
    required this.featureTypeId,
    required this.names,
    this.validFrom,
    this.validUntil,
  });
  final String code;
  final String featureId;
  final String featureTypeId;
  final List<GeographyFeatureDetailNames> names;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory GeographyFeatureDetail.fromJson(Map<String, dynamic> json) => _$GeographyFeatureDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureDetailToJson(this);
}
