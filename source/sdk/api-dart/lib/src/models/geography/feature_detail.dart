import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/feature_detail_names.dart';

part 'feature_detail.g.dart';

/// Feature Detail
@JsonSerializable(includeIfNull: false)
class GeographyFeatureDetail {
  const GeographyFeatureDetail({
    required this.code,
    required this.featureId,
    required this.featureTypeId,
    this.fromToPrecision,
    this.fromYear,
    required this.names,
    this.toYear,
  });
  final String code;
  final String featureId;
  final String featureTypeId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final List<GeographyFeatureDetailNames> names;
  final int? toYear;

  factory GeographyFeatureDetail.fromJson(Map<String, dynamic> json) => _$GeographyFeatureDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureDetailToJson(this);
}
